
import nextConnect from "next-connect";

// let transporter = nodemailer.createTransport({
//   SES: { ses, aws },
// });

// let testAccount = await nodemailer.createTestAccount();

import db from "../../../../db/models";

export default nextConnect()
	// .use(upload.single('uploads'))
  .get(async (req, res) => {
		// send mail with defined transport object
		const { email_token } = req.query
		if(!email_token)
			res.status(400).send("You don't have permission to access this url.")

		try {
			const personal_secret = await db.PersonalSecret.findOne({ where : { email_token }})
			if(personal_secret) {
				personal_secret.email_token = null
				personal_secret.save()
				res.status(200).redirect("/", 200)
			}
		} catch (error) {
			res.status(500).send("Server Error.")
		}
		
	})