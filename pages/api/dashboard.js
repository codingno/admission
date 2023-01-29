import nc from "next-connect";

import db from "../../db/models";

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
		const data = [
		{
			name : 'Registered',
			total : 1023,
			position : 'top',
		},
		{
			name : 'Submitted',
			total : 870,
			position : 'top',
		},
		{
			name : 'Domestic',
			total : 450,
			position : 'top',
		},
		{
			name : 'Overseas',
			total : 420,
			position : 'top',
		},
		{
			name : 'Interviewed',
			total : 620,
			position : 'top',
		},
		{
			name : 'Passed',
			total : 400,
			position : 'top',
		},
		{
			name : 'Overseas',
			total : 420,
			position : 'top',
		},
		{
			name : 'Interviewed',
			total : 620,
			position : 'top',
		},
		{
			name : 'Passed',
			total : 400,
			position : 'top',
		},
		{
			name : 'Passed',
			total : 400,
			position : 'top',
		},
		{
			name : 'Passed-Domestic',
			total : 220,
			position : 'bottom',
		},
		{
			name : 'Passed-Overseas',
			total : 180,
			position : 'bottom',
		},
		{
			name : 'Master / PhD',
			position : 'bottom',
			type : 'double',
			data : [
				{
					name : 'Master',
					total : 320,
				},
				{
					name : 'PhD',
					total : 80,
				},
			]
		},
		]

		const queryTop = `
			SELECT * from dashboard_top;
		`
		const dashboardTop = await db.sequelize.query(queryTop, { type: db.Sequelize.QueryTypes.SELECT });
		const queryBottom = `
			SELECT * from dashboard_bottom;
		`
		const dashboardBottom = await db.sequelize.query(queryBottom, { type: db.Sequelize.QueryTypes.SELECT });

		return res.status(200).json({dashboardTop,dashboardBottom})
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