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

		const queryOptions = {
			type : db.Sequelize.QueryTypes.SELECT
		}

		// const data = await db.sequelize.query(`select course_title from proposed_study where course_title not like '%MA in %' group by course_title;`, queryOptions)
		const data = await db.sequelize.query(`select course_title from proposed_study group by course_title;`, queryOptions)
		if(!data)
			throw new Error('Data not found.')
		return res.status(200).json(data.map(x => x.course_title))
	})
  .post(async (req, res) => {
	})