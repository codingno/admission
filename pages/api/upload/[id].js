import nc from "next-connect";

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
	})
  .post(async (req, res) => {
		const { id } = req.query
		console.log(req.body)
		const { name, filename, url_link } = req.body
		if( !name || !filename || !url_link )
			return res.status(400).end("Missinng Parameter")

		try {
			const fileExist = await db.DocumentUpload.findOne({ where : {filename}})
			if(fileExist) {
				fileExist.url_link = url_link
				fileExist.save()
			}
			else
				await db.DocumentUpload.bulkCreate([{...req.body, personal_id : id}], { updateOnDuplicate : Object.keys({...req.body, personal_id : id})})
			return res.status(200).end("File Upldated.")
		} catch (error) {
			return res.status(500).end(error)
		}
	})