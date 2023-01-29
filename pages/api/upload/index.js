const multer = require("multer");
const path = require("path");
import nextConnect from "next-connect";

// const upload = multer({ dest: 'uploads/images' })
export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
		const folderTarget = req.body.name || 'files'
		// const pathTarget = 'uploads/'	+ folderTarget + '-' + file.fieldname	
		// const pathTarget = 'uploads/'	+ folderTarget + '-' + file.fieldname	
		const pathTarget = file.fieldname		
		// const pathTarget = `files/${file.fieldname}/${folderTarget}`
    cb(null, pathTarget)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix + "." +file.originalname.split('.').pop())
    // cb(null, file.fieldname + '-' + req.body.name + '-' + uniqueSuffix + "-" +file.originalname.replaceAll(' ', ''))
    cb(null, file.fieldname + '-' + req.body.name.split('/').join('-').split(' ').join('-') + '-' + uniqueSuffix + "-" +file.originalname.split(' ').join(''))
  }
})

const upload = multer({ storage: storage })

export default nextConnect()
	.use(upload.single('uploads'))
  .post(async (req, res) => {
    const file = req.file.path;
    if (!file) {
      res.status(400).send({
        status: false,
        data: "No File is selected.",
      });
    }
    res.send(file);
		// res.ok({message:"ok"})
  })
