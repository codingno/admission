import { getSession } from "next-auth/react"

const police = (roles) => {
	return async (req, res, next) => {
		const session  = await getSession({req});
		req.user = !session ? null : session.user 
		if(req.user)
			if(!roles)
				return next()
				// return res.status(403).send("Maaf, Anda tidak diperkenankan untuk mengakses fitur ini.")
			const user_role = req.user.role_id
			let role = roles
			if(Array.isArray(roles)) {
				role = roles.filter(x => x == user_role)[0]
			}
			// else if(role == user_role || user_role == 16 || user_role == process.env.NEXT_PUBLIC_QC_ROLE_ID)
			if(role || user_role == process.env.NEXT_PUBLIC_ROLE_SUPER_ADMIN || user_role == process.env.NEXT_PUBLIC_ROLE_INSPEKTUR)
				return next()
		else 
			// return res.status(403).send("Maaf, Anda tidak diperkenankan untuk mengakses fitur ini.")
			return res.status(403).send("You don't have permission to access this features")
	}
}

export const isLogin = police(null)
export const isTeacher = police(3)
export const isAdmin = police([process.env.NEXT_PUBLIC_ROLE_OPERATION_INVENTORY,process.env.NEXT_PUBLIC_ROLE_CONTENT_CREATOR])
export const isQC = police(process.env.NEXT_PUBLIC_ROLE_INSPEKTUR)

export default {
	isLogin,
	isTeacher,
	isAdmin,
	isQC,
}