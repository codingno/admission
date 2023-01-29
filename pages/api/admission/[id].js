import nc from "next-connect";
import { getSession } from "next-auth/react"

import db from "../../../db/models";

let nodemailer = require("nodemailer");
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

function capitalize(string) {
  if (typeof string !== 'string') {
    throw new Error(process.env.NODE_ENV !== "production" ? `MUI: \`capitalize(string)\` expects a string argument.` : (0, _formatMuiErrorMessage2.default)(7));
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end(err.message);
    // res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
})
  .get(async (req, res) => {
		// const session = await getSession({ req })
		const { id } = req.query
		try {
			const personal = await db.Personal.findOne({ 
				where : { id },
				include : [
					{
						model : db.PersonalDetail,
						as : 'personal_detail',
					},
					{
						model : db.ContactDetail,
						as : 'contact_detail',
					},
					"financial_support",
					"proposed_study",
					"education_background",
					"language_ability",
					"language_score",
					"job_status",
					"referee_detail",
					"document_upload",
					"pre_admission",
				],
			})

			return res.status(200).json(personal)
		} catch (error) {
			throw error
		}
	})
  .post(async (req, res) => {
		const { id } = req.query
		// console.log(req.body)
		const isBodyExist = Object.keys(req.body)
		if(isBodyExist.length === 0)
			return res.status(400).send("Bad Request, parameter missing.")
		const personal = await db.Personal.findOne({ 
			where : { id },
			include : [
				{
					model : db.PersonalDetail,
					as : 'personal_detail',
				},
				{
					model : db.ContactDetail,
					as : 'contact_detail',
				},
				"financial_support",
				"proposed_study",
				"education_background",
				"language_ability",
				"language_score",
				"job_status",
				"referee_detail",
			],
		})

		let allData = {};

		if(personal.submitted) {
			throw Error("All data already submitted.")
		}

		if((personal.dataValues?.personal_detail[0] || personal.personal_detail[0]) && personal.submitted) {
			throw Error("Data personal detail already submitted.")
		} else {
			let prepareData = {
				personal_id: personal.id,
				tittle: req.body.tittle,
				family_name: req.body.family_name,
				given_name: req.body.given_name,
				place_of_birth: req.body.place_of_birth,
				date_of_birth: req.body.date_of_birth,
				gender: req.body.gender,
				country_citizen: req.body.country_citizen,
				national_identity_number: req.body.national_identity_number || "",
				passport_no: req.body.passport_no || "",
				issue_date: req.body.issue_date || "",
				expiry_date: req.body.expiry_date || "",
				// country_id: req.body.country_id,
			}

			Object.keys(prepareData).map(item => {
				if(item === 'personal_id')
					return
				if(item === "national_identity_number") {
					if(prepareData[item] === "" && prepareData.country_citizen.toLowerCase() === "indonesia")
						throw Error(`Please fill form ${item.split('_').map(x => capitalize(x)).join(' ')} in Personal Details`)
				}
				if(item === 'passport_no') {
					if(prepareData[item] === "" && prepareData.national_identity_number === "")
						throw Error(`Please fill form between ${item.split('_').map(x => capitalize(x)).join(' ')} or ${"national_identity_number".split('_').map(x => capitalize(x)).join(' ')} in Personal Details`)
					if(prepareData[item] !== "" && ( prepareData.issue_date === "" || prepareData.expiry_date === ""))
						throw Error(`Please choose date for ${"issue_date".split('_').map(x => capitalize(x)).join(' ')} and ${"expiry_date".split('_').map(x => capitalize(x)).join(' ')} in Personal Details`)
				}
				if(!prepareData[item] && prepareData[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Personal Details`)
				
				if(personal.dataValues?.personal_detail[0])
					prepareData.id = personal.dataValues?.personal_detail[0].id 
			})
			if(prepareData.passport_no === "") {
				prepareData.passport_no = null
				prepareData.issue_date = null
				prepareData.expiry_date = null
			}

			allData.personal_detail = prepareData
			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		if((personal.dataValues?.contact_detail[0] || personal.contact_detail[0]) && personal.submitted) {
			throw Error("Data contact details already submitted.")
		} else {
			let prepareData = {
				personal_id: personal.id,
				address_1: req.body.address_1,
				address_2: req.body.address_2 || "",
				city: req.body.city,
				postal_code: req.body.postal_code,
				province: req.body.province,
				country: req.body.country,
				// country_id: req.body.country_id,
				home_number: req.body.home_number || "",
				mobile_number: req.body.mobile_number,
				work_number: req.body.work_number || "",
				primary_email: req.body.primary_email,
				alternate_email: req.body.alternate_email || "",
			}

			Object.keys(prepareData).map(item => {
				if(item === 'personal_id')
					return
				if(!prepareData[item] && prepareData[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Contact Details`)
			})

			if(personal.dataValues?.contact_detail[0])
				prepareData.id = personal.dataValues?.contact_detail[0].id 
			allData.contact_detail = prepareData
			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		if((personal.dataValues?.financial_support[0] || personal.financial_support[0]) && personal.submitted) {
			throw Error("Data financial support already submitted.")
		} else {
			let prepareData = {
				personal_id: personal.id,
				admission_type: req.body.admission_type,
			}

			Object.keys(prepareData).map(item => {
				if(item === 'personal_id')
					return
				if(!prepareData[item] && prepareData[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Financial Support`)
			})

			if(personal.dataValues?.financial_support[0])
				prepareData.id = personal.dataValues?.financial_support[0].id 

			allData.financial_support = prepareData
			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		if((personal.dataValues?.proposed_study[0] || personal.proposed_study[0]) && personal.submitted) {
			throw Error("Data proposed study already submitted.")
		} else {
			let prepareData = {
				personal_id: personal.id,
				level_study: req.body.level_study,
				course_title: req.body.course_title,
			}

			Object.keys(prepareData).map(item => {
				if(item === 'personal_id')
					return
				if(!prepareData[item] && prepareData[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Proposed Study Program`)
			})
			if(personal.dataValues?.proposed_study[0])
				prepareData.id = personal.dataValues?.proposed_study[0].id 

			allData.proposed_study = prepareData
			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		if((personal.dataValues?.education_background[0] || personal.education_background[0]) && personal.submitted) {
			throw Error("Data education background already submitted.")
		} else {
			let prepareData= {
				personal_id: personal.id,
				degree_type : "undergraduate",
				institution_name: req.body.undergraduate_institution_name,
				country: req.body.undergraduate_country,
				province: req.body.undergraduate_province,
				language: req.body.undergraduate_language,
				graduation_date: req.body.undergraduate_graduation_date,
			}

			Object.keys(prepareData).map(item => {
				if(item === 'personal_id')
					return
				if(!prepareData[item] && prepareData[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Undergraduate Degree in Education Background`)
			})

			if(personal.dataValues?.proposed_study[0]){
				const degree_type = personal.dataValues?.education_background.filter(x => x.degree_type === "undergraduate")
				prepareData.id = degree_type[0]?.id 
			}

			allData.education_background = [prepareData]

			if(req.body.master_institution_name) {
				let prepareDataMaster = {
					degree_type : "master",
					personal_id: personal.id,
					institution_name: req.body.master_institution_name,
					country: req.body.master_country,
					province: req.body.master_province,
					language: req.body.master_language,
					graduation_date: req.body.master_graduation_date,
				}
			Object.keys(prepareDataMaster).map(item => {
				if(item === 'personal_id')
					return
				if(!prepareDataMaster[item] && prepareDataMaster[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Master Degree in Education Background`)
			})
			if(personal.dataValues?.proposed_study[0]){
				const degree_type = personal.dataValues?.education_background.filter(x => x.degree_type === "master")
				prepareDataMaster.id = degree_type[0]?.id 
			}

			allData.education_background.push(prepareDataMaster)
			}

			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		if((personal.dataValues?.language_ability[0] || personal.language_ability[0]) && personal.submitted) {
			throw Error("Data proficiency already submitted.")
		} else {
			let prepareData = {
				personal_id: personal.id,
				language_type: "English",
				proficiency_score: req.body.english_proficiency_score,
			}

			Object.keys(prepareData).map(item => {
				if(item === 'personal_id')
					return
				if(!prepareData[item] && prepareData[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Language Ability`)
			})

			if(personal.dataValues?.language_ability[0]){
				const language_type = personal.dataValues?.language_ability.filter(x => x.language_type === "English")
				prepareData.id = language_type[0]?.id 
			}

			allData.language_ability = [prepareData]

			if(req.body.arabic_proficiency_score) {

				let prepareDataArabic = {
					personal_id: personal.id,
					language_type: "Arabic",
					proficiency_score: req.body.arabic_proficiency_score,
				}

				Object.keys(prepareDataArabic).map(item => {
					if(item === 'personal_id')
						return
					if(!prepareData[item] && prepareDataArabic[item] !== "")
						throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Language Ability`)
				})
			if(personal.dataValues?.language_ability[0]){
				const language_type = personal.dataValues?.language_ability.filter(x => x.language_type === "Arabic")
				prepareDataArabic.id = language_type[0]?.id 
			}

				allData.language_ability.push(prepareDataArabic)
			}

			if(req.body.language_type) {
				if(!req.body.proficiency_score)
					throw Error(`Missing Parameter ${"proficiency_score".split('_').map(x => capitalize(x)).join(' ')} if insert other language in Language Ability`)
				
				let prepareData = { personal_id : personal.id, language_type : req.body.language_type, proficiency_score : req.body.proficiency_score }
				if(personal.dataValues?.language_ability[0]){
					const language_type = personal.dataValues?.language_ability.filter(x => x.language_type === req.body.language_type)
					prepareData.id = language_type[0]?.id 
				}
				allData.language_ability.push(prepareData)
			}
			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		if((personal.dataValues?.language_score[0] || personal.language_score[0]) && personal.submitted) {
			throw Error("Data language test already submitted.")
		} else {
			let prepareData = {
				personal_id: personal.id,
				test_name: req.body.test_name,
				date_test_taken: req.body.date_test_taken,
				overall_score: req.body.overall_score,
			}

			Object.keys(prepareData).map(item => {
				if(item === 'personal_id')
					return
				if(!prepareData[item] && prepareData[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Language Ability`)
			})

			if(personal.dataValues?.language_score[0]){
				const test_name = personal.dataValues?.language_score.filter(x => x.test_name === req.body.test_name)
				prepareData.id = test_name[0]?.id 
			}

			allData.language_score = prepareData
			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		if((personal.dataValues?.job_status[0] || personal.job_status[0]) && personal.submitted) {
			throw Error("Data job status already submitted.")
		} else {
			if(req.body.job_status_type === "Currently employed") {
				let prepareData = {
					personal_id: personal.id,
					employee_type: 1,
					position_title: req.body.position_title,
					organization_name: req.body.organization_name,
					organization_address: req.body.organization_address,
					organization_type: req.body.organization_type,
					date_commenced: req.body.date_commenced,
				}

				Object.keys(prepareData).map(item => {
					if(item === 'personal_id')
						return
					if(!prepareData[item] && prepareData[item] !== "")
						throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Job Status`)
				})

				if(personal.dataValues?.job_status[0]){
					const job_data = personal.dataValues?.job_status.filter(x => x.employee_type === 1)
					prepareData.id = job_data[0]?.id 
				}

				if(personal.job_status[0]) {
					Object.keys(prepareData).map(job_status_obj => {
						personal.job_status[0][job_status_obj] = prepareData[job_status_obj]
					})
					personal.job_status[0].save()
				}
				else
					allData.job_status = prepareData
			}
			else {
				let prepareData = {
					personal_id : personal.id,
					self_employee_type : 1,
				}

				if(personal.dataValues?.job_status[0]){
					const job_data = personal.dataValues?.job_status.filter(x => x.self_employee_type === 1)
					prepareData.id = job_data[0]?.id 
				}

				allData.job_status = prepareData
			}
			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		if((personal.dataValues?.referee_detail[0] || personal.referee_detail[0]) && personal.submitted) {
			throw Error("Data referee detail already submitted.")
		} else {
			let prepareData = {
				personal_id: personal.id,
				title: req.body.referee1_title,
				family_name: req.body.referee1_family_name,
				given_name: req.body.referee1_given_name,
				position: req.body.referee1_position,
				relationship_to_applicant: req.body.referee1_relationship_to_applicant,
				country: req.body.referee1_country,
				phone_number: req.body.referee1_phone_number,
				email_address: req.body.referee1_email_address,
				address: req.body.referee1_address,
			}

			Object.keys(prepareData).map(item => {
				if(item === 'personal_id')
					return
				if(!prepareData[item] && prepareData[item] !== "")
					throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Referee 1 Details`)
			})

			if(personal.dataValues?.referee_detail[0]){
				// const job_data = personal.dataValues?.referee_detail.filter(x => x.self_employee_type === 1)
				prepareData.id = personal.dataValues?.referee_detail[0]?.id 
			}

			allData.referee_detail = [prepareData]

			if(req.body.referee2_title) {

				let prepareData2 = {
					personal_id: personal.id,
					title: req.body.referee2_title,
					family_name: req.body.referee2_family_name,
					given_name: req.body.referee2_given_name,
					position: req.body.referee2_position,
					relationship_to_applicant: req.body.referee2_relationship_to_applicant,
					country: req.body.referee2_country,
					phone_number: req.body.referee2_phone_number,
					email_address: req.body.referee2_email_address,
					address: req.body.referee2_address,
				}

				Object.keys(prepareData2).map(item => {
					if(item === 'personal_id')
						return
					if(!prepareData2[item] && prepareData2[item] !== "")
						throw Error(`Missing Parameter ${item.split('_').map(x => capitalize(x)).join(' ')} of Referee 2 Details`)
				})

			if(personal.dataValues?.referee_detail[1]){
				// const job_data = personal.dataValues?.referee_detail.filter(x => x.self_employee_type === 1)
				prepareData2.id = personal.dataValues?.referee_detail[1]?.id 
			}

			allData.referee_detail.push(prepareData2)
			}
			// const personal_detail = await db.PersonalDetail.create(preparePersonalDetail)
		}

		// const personal_detail = await db.PersonalDetail.create(allData.personal_detail)
		// const contact_detail = await db.ContactDetail.create(allData.contact_detail)
		// const financial_support = await db.FinancialSupport.create(allData.financial_support)
		// const proposed_study = await db.ProposedStudy.create(allData.proposed_study)
		// const education_background = await db.EducationBackground.bulkCreate(allData.education_background)
		// const language_ability = await db.LanguageAbility.bulkCreate(allData.language_ability)
		// const language_score = await db.LanguageScore.create(allData.language_score)
		// const job_status = await db.JobStatus.create(allData.job_status)
		// const referee_details = await db.RefereeDetail.bulkCreate(allData.referee_detail)

		// const personal_detail = await db.PersonalDetail.bulkCreate([allData.personal_detail], { updateOnDuplicate : ["id"]})
		// const contact_detail = await db.ContactDetail.bulkCreate([allData.contact_detail], { updateOnDuplicate : ["id"]})
		// const financial_support = await db.FinancialSupport.bulkCreate([allData.financial_support], { updateOnDuplicate : ["id"]})
		// const proposed_study = await db.ProposedStudy.bulkCreate([allData.proposed_study], { updateOnDuplicate : ["id"]})
		// const education_background = await db.EducationBackground.bulkCreate(allData.education_background, { updateOnDuplicate : ["id"]})
		// const language_ability = await db.LanguageAbility.bulkCreate(allData.language_ability, { updateOnDuplicate : ["id"]})
		// const language_score = await db.LanguageScore.bulkCreate([allData.language_score], { updateOnDuplicate : ["id"]})
		// const job_status = await db.JobStatus.bulkCreate([allData.job_status], { updateOnDuplicate : ["id"]})
		// const referee_details = await db.RefereeDetail.bulkCreate(allData.referee_detail, { updateOnDuplicate : ["id"]})

		function filterAttributes(model) {
			return Object.keys(model.rawAttributes).filter(x => x !== "id")
		}

		const personal_detail = await db.PersonalDetail.bulkCreate([allData.personal_detail], { updateOnDuplicate : filterAttributes(db.PersonalDetail)})
		const contact_detail = await db.ContactDetail.bulkCreate([allData.contact_detail], { updateOnDuplicate : filterAttributes(db.ContactDetail)})
		const financial_support = await db.FinancialSupport.bulkCreate([allData.financial_support], { updateOnDuplicate : filterAttributes(db.FinancialSupport)})
		const proposed_study = await db.ProposedStudy.bulkCreate([allData.proposed_study], { updateOnDuplicate : filterAttributes(db.ProposedStudy)})
		const education_background = await db.EducationBackground.bulkCreate(allData.education_background, { updateOnDuplicate : filterAttributes(db.EducationBackground)})
		const language_ability = await db.LanguageAbility.bulkCreate(allData.language_ability, { updateOnDuplicate : filterAttributes(db.LanguageAbility)})
		const language_score = await db.LanguageScore.bulkCreate([allData.language_score], { updateOnDuplicate : filterAttributes(db.LanguageScore)})
		const job_status = await db.JobStatus.bulkCreate([allData.job_status], { updateOnDuplicate : filterAttributes(db.JobStatus)})
		const referee_details = await db.RefereeDetail.bulkCreate(allData.referee_detail, { updateOnDuplicate : filterAttributes(db.RefereeDetail)})

	// 'proposed-study-program',
	// 'education-background',
	// 'language-ability',
	// 'job-status',
	// 'referee-details',
		// console.log(req.body)
		return res.status(200).json({
			personal_detail,
			contact_detail,
			financial_support,
			proposed_study,
			education_background,
			language_ability,
			language_score,
			job_status,
			referee_details,
		})
	})
  .patch(async (req, res) => {
		const { id } = req.query
		console.log(req.body)
		const isBodyExist = Object.keys(req.body)
		if(isBodyExist.length === 0)
			return res.status(400).send("Bad Request, parameter missing.")
		const personal = await db.Personal.findOne({ 
			where : { id },
			include : [
				{
					model : db.PersonalDetail,
					as : 'personal_detail',
				},
				{
					model : db.ContactDetail,
					as : 'contact_detail',
				},
				"financial_support",
				"proposed_study",
				"education_background",
				"language_ability",
				"language_score",
				"job_status",
				"referee_detail",
			],
		})

		if(!personal)
			throw Error("User not found.")

		personal.submitted = true
		personal.save()


		for await (const referee of personal.referee_detail) {
			const email_token = referee.email_token || referee.dataValues.email_token
			const email_token_url = `https://${process.env.EMAIL_TOKEN_URL}/referee/${email_token}`

			let info = await transporter.sendMail({
				from: `"Admission UIII" <` + process.env.SMTP_EMAIL_FROM + '>', // sender address
				// from: 'Codingno <codingno@gmail.com>', // sender address
				// to: "bar@example.com, baz@example.com", // list of receivers
				// to: "codingno@gmail.com", // list of receivers
				to: referee.email_address, // list of receivers
				subject: "Admission UIII Referee Recommendation", // Subject line
				// text: "Hello world?", // plain text body
				// html: "<b>Hello world?</b>", // html body
				html : `
					<p>Dear ${referee.title} ${referee.family_name} ${referee.given_name}.</p>
					<p>We have recently received an application to Indonesian International Islamic University from ${personal.name} who requested that you provide a reference (letter of recommendation) in support of their application to UIII.</p>
					<br />
					<p>In order for us to consider this application promptly we could ask that you please click the link below to fill in the reference.</p>
					<p>
					Click here
					<a href = "${email_token_url}" >${email_token_url}</a>
					</p>
					<br />
					<br />
					<p>With regards,</p>
					<br />
					<br />
					<br />
					<br />
					<p>Bahrul Hayat</p>
					<p>Vice Rector for Academic, Human Resource and Student Affairs</p>
				`
			});

			console.log("Message sent: %s", JSON.stringify(info, null, 4));
		}

		return res.status(200).send("ok")
	})