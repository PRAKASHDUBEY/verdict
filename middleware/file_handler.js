const multer = require("multer");
const path = require('path');

function fileFilter (req, file, cb) {    
    const filetypes = /jpeg|jpg|png|gif/;
    const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
}
module.exports = multer({limits : {fileSize : 1000000}, fileFilter : fileFilter});