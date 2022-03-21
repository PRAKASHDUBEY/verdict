const bucket = require('../config/cloud');

module.exports = async(req,res,next)=>{
  try{
    if (req.file) {
      const blob = bucket.file(`${req.user.id}/${req.file.fieldname}/${req.user.id}-${Date.now()}`);
      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
        resumable:false
      });
      blobWriter.on('error', (err) => next(err));
      blobWriter.on('finish', () => {
        // console.log('finished uploading image');
      });
      blobWriter.end(req.file.buffer);
      req.imgUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}`;
      next();
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
}