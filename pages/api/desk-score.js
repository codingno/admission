// import crudApi from '../../../utils/crudApi'
import crudApi from '../../utils/crudApi'
import db from '../../db/models'

export default crudApi('DeskScore', 
	{ 
		include : [
			'aspect',
			{
				model : db.Personal,
				as : 'personal',
				include : [
					'proposed_study'
				],
			},
			{
				model : db.Personal,
				as : 'admin',
			},
		]
	},
	 'isLogin')