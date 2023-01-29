
import nextConnect from "next-connect";

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

import db from "../../../../db/models";

export default nextConnect()
  .post(async (req, res) => {
		try {
			if(!req.body.email)	
				return res.status(400).send("Missing parameters.")

			const personal = await db.Personal.findOne({ where : { email : req.body.email }, include : ['personal_secret']})	
			const reset_password_token = await require('crypto').randomBytes(32).toString('hex');
			if(personal.personal_secret[0]) {
				personal.personal_secret[0].reset_password_token = reset_password_token
				await personal.personal_secret[0].save()
			} else {
				throw new Error('Personal Secret not found.')
			}
			const reset_password_token_url = `https://${process.env.EMAIL_TOKEN_URL}/reset-password/${reset_password_token}`
			let info = await transporter.sendMail({
				from: `"Admission UIII" <` + process.env.SMTP_EMAIL_FROM + '>', // sender address
				// from: 'Codingno <codingno@gmail.com>', // sender address
				// to: "bar@example.com, baz@example.com", // list of receivers
				// to: "codingno@gmail.com", // list of receivers
				to: personal.email, // list of receivers
				subject: "Admission UIII | Reset Password", // Subject line
				// text: "Hello world?", // plain text body
				// html: "<b>Hello world?</b>", // html body
				html : `
					<p>Please follow this link to reset your password.</p>
					<a href = "${reset_password_token_url}" >reset_password</a>
				`
			});

			console.log("Message sent: %s", info.messageId);
			res.status(200).send("Email sent, please check your email.")
			
		} catch (error) {
			return res.status(500).send("Server Error : ", error)
		}
	})