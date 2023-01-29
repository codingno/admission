import nc from "next-connect";
import db from '../../db/models'
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

// import db from "../../../db/models";
// import police from "../../../config/police";

export default nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
})
  // .use(police[role])
  .post(async (req, res) => {
		try {
			console.log(JSON.stringify(req.body, null, 4))
			const { name, email, password } = req.body
			// const personal = await db.Personal.findAll({ 
			// 	include : [
			// 		{
			// 			model : db.PersonalSecret,
			// 			as : 'personal_secret',
			// 		},
			// 		{
			// 			model : db.PersonalDetail,
			// 			as : 'personal_detail',
			// 		},
			// 	]
			// })
			const isPersonalExist = await db.Personal.findOne({
				where : {
					email,
				},
			})
			if(isPersonalExist)
				return res.status(400).send("Email already registered.")
			const personal = await db.Personal.create({
				name,
				email,
			})
			const personal_secret = await db.PersonalSecret.create({
				personal_id: personal.id,
				username : name,
				password,
			})
			// const personal_secret = await db.PersonalSecret.findAll({
			// 	include : [
			// 		{
			// 			model : db.Personal,
			// 			as : 'personal',
			// 		},
			// 	]
			// })
			// return res.send("ok")
			// const personal_details = await db.PersonalDetail.findAll({
			// 	include : [
			// 		{
			// 			model : db.Personal,
			// 			as : 'personal',
			// 		},
			// 	]
			// })
			// return res.send("ok")
			
			const email_token = personal_secret.email_token || personal_secret.dataValues.email_token
			// const email_token_url = `${'http://' + req.headers.host }/api/mail/verify/${email_token}`
			const email_token_url = `https://${process.env.EMAIL_TOKEN_URL}/api/mail/verify/${email_token}`
			let info = await transporter.sendMail({
				from: `"Admission UIII" <` + process.env.SMTP_EMAIL_FROM + '>', // sender address
				// from: 'Codingno <codingno@gmail.com>', // sender address
				// to: "bar@example.com, baz@example.com", // list of receivers
				// to: "codingno@gmail.com", // list of receivers
				to: personal.email, // list of receivers
				// subject: "Admission UIII Account Registration", // Subject line
				// subject: "Account Registration for UIII Admissions 2022-2023", // Subject line
				subject: "Account Registration for UIII Admissions 2023-2024", // Subject line
				// text: "Hello world?", // plain text body
				// html: "<b>Hello world?</b>", // html body
				// html : `
				// 	<p>Please verification your email with link below.</p>
				// 	<a href = "${email_token_url}" >verify email</a>
					// <p>Thank you for registering your online account for the UIII Admissions 2022-2023.</p>
				// `
				html : `
					<p>Thank you for registering your online account for the UIII Admissions 2023-2024.</p>
					<p></p>
					<p></p>
					<p>Please pay attention to the following points:</p>
					<ol>
						<li><p>
You will be asked to fill out your personal information. Make sure that your data is valid and complete.
						</p></li>
						<li>
						<p>
						We highly advise your referees should be someone who knows you well and has spent time with them in academic or professional settings. They should be knowledgeable about your academic or work experiences; and qualifications, including your skills, strengths, goals, and accomplishments. Please provide your referee's active email address where we can send the link for them to fill their recommendation of you.
						</p>
						</li>
						<li>
							<p>
After all of your required documents are ready, upload them to the system. Make sure that the uploaded documents have been submitted successfully before proceeding to the next step.
							</p>
						</li>
						<li>
							<p>
								After submitting the documents, pay the application fee with the following amount and procedure:
							</p>
							<ol type="a">
							<li>
							<p>
							Application Cost
							</p>
							<ul>
								<li>
								Indonesian Residents: IDR 750,000
								</li>
								<li>
								Non-Indonesian Residents: USD 50
								</li>
							</ul>
							</li>
							<li>
							<p>
							Transfer the fee to:
							</p>
							<p>
							Bank Account Number: 1570025252009
							</p>
							<p>
							Bank Account Name: Universitas Islam Internasional Indonesia
							</p>
							<p>
							Bank Name: Bank Mandiri
							</p>
							<p>
							Swift Code: BMRIIDJA
							</p>
							<p style="color: red;">
							Before you make the payment, please add <span style="font-weight: 700;">"UIII APPLICATION FEE"</span> in the description of the money transfer
							</p>
							</li>
							<li>
							<p>
							Kindly note that you must upload your Proof of Payment in its intended document submission field.
							</p>
							</li>
							</ol>
						</li>
						<li>
						To complete your application, select “Declaration”. Your application will be automatically recorded in our system.
						</li>
					</ol>
					<p></p>
					<p></p>
					<p>Click the link below to verify your account.</p>
					<p>
					<a href = "${email_token_url}" >${email_token_url}</a>
					</p>
					<p></p>
					<p></p>
					<p>Thank you.</p>
					<p></p>
					<p></p>
					<p></p>
					<p>Best regards,</p>
					<p>Admission Committee</p>
					<p>
					<a href = "https://uiii.ac.id/admissions" >https://uiii.ac.id/admissions</a>
					</p>
					<p>This is an automated message. Please do not reply to this email.</p>
				`
			});

			console.log("Message sent: %s", info.messageId);
			res.status(200).end("Sign Up success, please verify your email.")
		} catch (error) {
			
		}
	})