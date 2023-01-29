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
		const session  = await getSession({req});
		req.user = !session ? null : session.user 
		try {
			let options = { email_token : req.query.token }
			if(req.user) 
				if(req.user.role_id == 1 || req.user.role_id == 3) {
					options = 
					{
						id : req.query.token
					}
				}
			const referee = await db.RefereeDetail.findOne({
				where : options,
				include : [
					{
						model : db.Personal,
						as : 'personal',
						include : [
							{
								model : db.PersonalDetail,
								as : 'personal_detail',
							},
							{
								model : db.ContactDetail,
								as : 'contact_detail',
							},
							"proposed_study",
						]
					},
							"referee_recommendation_form",
				]
			})	
			if(!referee)
				return res.status(400).send("Token not found.")
			return res.status(200).json(referee)
		} catch (error) {
			
		}
	})
  .post(async (req, res) => {
		try {
			if(
			!req.body.intellectual_ability ||
			!req.body.oral_communication_skills ||
			!req.body.written_communication_skills ||
			!req.body.ability_to_work||
			!req.body.ability_to_organize||
			!req.body.motivation ||
			!req.body.overall_assesment ||
			!req.body.recommendation
			)
				return res.status(400).send("Missing Parameters.")

			const referee = await db.RefereeDetail.findOne({
				where : { email_token : req.query.token },
				include : [
					{
						model : db.Personal,
						as : 'personal',
						include : [
							{
								model : db.PersonalDetail,
								as : 'personal_detail',
							},
							{
								model : db.ContactDetail,
								as : 'contact_detail',
							},
							"proposed_study",
						]
					},
					"referee_recommendation_form"
				]
			})	
			if(!referee)
				return res.status(400).send("Token not found.")

			if(referee.referee_recommendation_form.length > 0)
				return res.status(400).send("Data already submitted.")

			const data = {
				referee_detail_id : referee.id,
				...req.body
			}

			const referee_form = await db.RefereeRecommendationForm.create(data)

			return res.status(200).json(referee_form)
		} catch (error) {
			
		}
	})