
import nc from "next-connect";
import { getSession } from "next-auth/react"

import db from "../../../db/models";

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
		let options = {...req.query}
		let proposedStudyOptions = {}

		if(options.submitted === '0' || options.submitted === null)
			options.submitted = null

		if(req.query.is_verified === 'null' || options.is_verified === null)
			options.is_verified = { [db.Sequelize.Op.ne] : null }
		
		if(req.query.course_title) {
			// course_title = { [db.Sequelize.Op.ne] : null }
			proposedStudyOptions = {
				where : {
					course_title : req.query.course_title
				},
			}
			delete req.query.course_title
		}

		let is_preadmission = false
		if ( req.query.is_preadmission )
			is_preadmission = true	
		
		if(session.user.ROLE_ID !== 1 && session.user.ROLE_ID !== 3)
    	return res.status(403).end("You don't have permission to access this list");

		// const { id } = req.query
		let listColumn = {...db.Personal.rawAttributes}
		if(options)
			options = Object.keys(options).filter(function(x) { return this.indexOf(x) >= 0 }, Object.keys(listColumn)).reduce((a,v) => ({...a, [v] : options[v]}),{})
		try {
			console.time("timing")
			let include = [
					{
						model : db.PersonalDetail,
						as : 'personal_detail',
						separate : true,
					},
					{
						model : db.ContactDetail,
						as : 'contact_detail',
						separate : true,
					},
					"financial_support",
					{
						model : db.ProposedStudy,
						as : 'proposed_study',
						// separate : true,
						...proposedStudyOptions,
						// where : proposedStudyOptions,
					},
					"education_background",
					"language_ability",
					"language_score",
					"job_status",
					"referee_detail",
					{
						model : db.DocumentUpload,
						as : 'document_upload',
						separate : true,
					},
					{
						model : db.DeskScore,
						as : 'desk_score',
						separate : true,
					},
					{
						model : db.InterviewScore,
						as : 'interview_score_personal',
						separate : true,
						include : ['teacher']
					},
					// "document_upload",
					// "desk_score",
					// "interview_score_personal",
				]
			if ( is_preadmission )
				include.push(
					{
						model : db.PreAdmission,
						as : 'pre_admission',
						required : true,
					},
				)
			let personal = await db.Personal.findAll({ 
				where : options,
				include,
			})
			console.timeEnd("timing")
			// return res.status(200).json(personal)

			if(personal.length > 0) {
				personal = JSON.parse(JSON.stringify(personal))
				personal.map((each_personal, index_each_personal) => {
					if(each_personal.document_upload.length > 0) {
						const document_name = [... new Set(each_personal.document_upload.map(x => x.name))]
						const sorted_document = each_personal.document_upload.sort((a,b) => b.id - a.id)
						// const sorted_document = each_personal.document_upload
						let latest_document = []
						sorted_document.map((item, index) => {
							const isExist = latest_document.filter(x => x.name == item.name)[0]
							if(!isExist)
								latest_document.push(item)
							// else
							// 	delete each_personal.document_upload[index]
						})
						each_personal.document_upload.splice(0,each_personal.document_upload.length)
						latest_document.map(item =>
								each_personal.document_upload.splice(0, 0, item)
						)
						// each_personal.document_upload = each_personal.document_upload.filter(x => x)
					}

					if(each_personal.desk_score.length > 0) {
						each_personal.desk_score_value = each_personal.desk_score.reduce((a,b) => a + b.score, 0)
					}
					else each_personal.desk_score_value = null

					if(each_personal.interview_score_personal.length > 0) {
						// each_personal.interview_score_value = each_personal.interview_score_personal.reduce((a,b) => a + b.score, 0)
						const dozen = [... new Set(each_personal.interview_score_personal.map(x => x.teacher_id))]
						const dozenScore1 = each_personal.interview_score_personal.filter(x => x.teacher_id == dozen[0]).reduce((a,b) => a + b.score, 0)
						const dozenScore2 = each_personal.interview_score_personal.filter(x => x.teacher_id == dozen[1]).reduce((a,b) => a + b.score, 0)
						each_personal.interview_score_teacher1 = dozenScore1
						each_personal.interview_score_teacher2 = dozenScore2
						each_personal.interview_score_value = dozenScore1 + dozenScore2
					}
					else each_personal.interview_score_value = null
				})

				if(req.query.passed)
					personal = personal.filter(x => x.interview_score_value > 40)
			}

			return res.status(200).json(personal)
		} catch (error) {
			console.timeEnd("timing")
			throw error
		}
	})