const dotenv = require("dotenv");
dotenv.config({
  path:'./config/config.env'
});
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});
module.exports = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);