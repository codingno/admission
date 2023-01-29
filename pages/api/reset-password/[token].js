import nc from "next-connect";

import db from "../../../db/models";

import bcrypt from 'bcrypt'

const hashPassword = (password) => new Promise((resolve, reject) => {
	bcrypt.genSalt(10, function (err, salt) {
		if(err)
			return reject(err)
		bcrypt.hash(password, salt, function (err, hash) {
			if(err)
				return reject(err)
			return resolve(hash)
		});
	});		
})

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
		if(!req.query.token)
			throw Error("Missing parameter token.")
		try {
			const personal_secret = await db.PersonalSecret.findOne({
				where : { reset_password_token : req.query.token },
				include : [
					{
						model : db.Personal,
						as : 'personal',
					}
				]
			})	
			if(!personal_secret)
				return res.status(400).send("Token not found.")
			let data = personal_secret
			delete data.password
			return res.status(200).json(data)
		} catch (error) {
			throw error	
		}
	})
  .post(async (req, res) => {
		if(!req.query.token && !req.body.password)
			throw Error("Missing parameter token.")
		try {
			const personal_secret = await db.PersonalSecret.findOne({
				where : { reset_password_token : req.query.token },
				include : [
					{
						model : db.Personal,
						as : 'personal',
					}
				]
			})	
			if(!personal_secret)
				return res.status(400).send("Token not found.")

			const hashedPassword = await hashPassword(req.body.password);
			personal_secret.password = hashedPassword;
			personal_secret.reset_password_token = null;
			personal_secret.save()
			let data = personal_secret
			delete data.password
			return res.status(200).json(data)
		} catch (error) {
			throw error	
		}
	})