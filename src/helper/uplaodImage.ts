import multer from "multer"
import path from "path"
import fs from "fs"


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const uploadImage = multer({

    storage: multer.diskStorage({
        destination: (req, file, cb) => {
          // Save files in the 'uploads' directory
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          // Create a unique filename with a timestamp
          cb(null, Date.now() + path.extname(file.originalname));
        },
      }),
   
    fileFilter: (req, file, cb: any) => {
        let ext = path.extname(file.originalname).toLocaleLowerCase()
        if (ext !== '.jpeg' && ext !== '.jpg' && ext !== '.png') {
            cb(new Error('unsupported format'), false)
            return
        }
        cb(null, true)
    }
});

export default uploadImage;
