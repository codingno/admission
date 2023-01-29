
import nc from "next-connect";
import { getSession } from "next-auth/react"
import moment from "moment";

import db from "../../../db/models";

import dbSia from "../../../db-sia/models";

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
		const session = await getSession({ req })
		if(!session)
			return res.status(403).end("You don't have permission to access this features")
		if(session.user.role_id !== 1)
			return res.status(403).end("You don't have permission to access this features")
		try {
			// return res.status(200).end("OK")
			const personals = await db.Personal.findAll({ 
				where : { is_verified : 1, role_id : 2 },
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
					{
						model : db.InterviewScore,
						as : 'interview_score_personal',
					},
				],
			})
			const meanValue = parseInt(process.env.NEXT_PUBLIC_MEAN_VALUE)
			const passedPersonal = personals.filter(x => x.interview_score_personal.reduce((a,b) => b.score + a, 0) / 2 >= meanValue )	

			const listDepartement = await dbSia.departement.findAll({ where : { status : 'ACTIVE', }, include : ['study_type']})
			const listFinancialSupport = await dbSia.financial_type.findAll()

			let migrationData = []
			for (const personal of passedPersonal) {

			const departement = listDepartement.filter(x => personal.proposed_study[0]?.course_title.includes(x.name) && personal.proposed_study[0]?.level_study.includes(x.study_type.description))[0]
			const financial_type = listFinancialSupport.filter(x => x.description.includes(personal.financial_support[0]?.admission_type) || x.name.includes(personal.financial_support[0]?.admission_type))[0]

			const education_background_undergraduate = personal.education_background.filter(x => x.degree_type == 'undergraduate')[0]
			const education_background_master = personal.education_background.filter(x => x.degree_type == 'master')[0]

			const campus_background = education_background_master || education_background_undergraduate;

			const prepareData = 
				{
					// user_id: DataTypes.STRING,
					name: personal.personal_detail[0]?.given_name + ' ' + personal.personal_detail[0]?.family_name ,
					entry_year: moment().year(),
					departement: departement?.id,
					faculty: departement?.faculty_id,
					financial_type_id: financial_type?.id,
					email: personal.email,
					nationality: personal.personal_detail[0]?.country_citizen.toLowerCase() == 'indonesia' ? 'WNI' : 'WNA',
					// nationality: {
					//   type: DataTypes.ENUM,
					//   values: ["WNI", "WNA"],
					//   defaultValue: "WNI",
					// },
					// generate: DataTypes.BOOLEAN,
					place_of_birth: personal.personal_detail[0]?.place_of_birth,
					// date_of_birth: DataTypes.DATE,
					date_of_birth: personal.personal_detail[0]?.date_of_birth,
					gender : personal.personal_detail[0]?.gender == 'Male' ? 'MAN' : 'WOMAN',
					// gender: {
					// 	type: DataTypes.ENUM,
					// 		values: [
					// 			'MAN',
					// 			'WOMAN',
					// 		],
					// 		defaultValue: 'MAN',
					// },
					// nationality: {
					// 	type: DataTypes.ENUM,
					// 		values: [
					// 			'WNI',
					// 			'WNA',
					// 		],
					// 		defaultValue: 'WNI',
					// },
					// identity_id: DataTypes.STRING,
					identity_id: parseInt(personal.personal_detail[0]?.passport_no || personal.personal_detail[0]?.national_identity_number),
					identity_type_id: personal.personal_detail[0]?.passport_no ? 	2 : 1,
					// religion : DataTypes.INTEGER,
					// entry_semester: {
					//   type: DataTypes.ENUM,
					//   values: ["1", "2"],
					//   defaultValue: "1",
					// },
					entry_status: 'NEW',
					// entry_status: {
					//   type: DataTypes.ENUM,
					//   values: ["NEW", "TRANSFER"],
					//   defaultValue: "NEW",
					// },
					status: 1,
					// mother_name: DataTypes.STRING,
					// father_name: DataTypes.STRING,
					// father_income: DataTypes.INTEGER,
					// mother_income: DataTypes.INTEGER,
					// school_name: DataTypes.STRING,
					// school_telp: DataTypes.STRING,
					// school_address: DataTypes.STRING,
					// school_departement: DataTypes.STRING,
					// school_end: DataTypes.INTEGER,
					campus_name: campus_background?.institution_name,
					// campus_telp: DataTypes.STRING,
					// campus_address: DataTypes.STRING,
					campus_address: campus_background && (campus_background?.province + ' ' + campus_background?.country),
					// campus_departement: DataTypes.STRING,
					// campus_end: DataTypes.INTEGER,
					campus_end: moment(new Date(campus_background?.graduation_date)).year(),
					// institution_name: DataTypes.STRING,
					// institution_telp: DataTypes.STRING,
					// institution_address: DataTypes.STRING,
					// institution_start: DataTypes.INTEGER,
					// institution_end: DataTypes.INTEGER,
					semester_active: 1,
				}
				migrationData.push(prepareData)
			}
			const studentExist = await dbSia.student_temp.findAll({
				where : { name : { [dbSia.Sequelize.Op.in] : migrationData.map(x => x.name)}}
			})
			const filterStudentExist = migrationData.filter(function(x) { return this.indexOf(x.name) < 0 }, studentExist.map(x => x.name))

			await dbSia.student_temp.bulkCreate(filterStudentExist)
			// return res.status(200).end("OK")
			return res.status(200).json(migrationData)
		} catch (error) {
      console.log(`🚀 ~ file: index.js ~ line 139 ~ .get ~ error`, error)
    	return res.status(500).end(error);
		}
	})