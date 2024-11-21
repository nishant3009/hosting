import S3 from 'aws-sdk/clients/s3.js';
import fs from 'fs';

const s3_endpoint = "https://16aa2c401244123bf49ffa092578012c.r2.cloudflarestorage.com"
const access_key_secret = "7f499ab896c634242e46e525a8d2d0ab99796a776d316437ebdfaec4824b8263"
const access_key_id = "e9b39deb33c18cb5c1b8a2915dad1798"
const bucket_name = "vercel-project"

const s3 = new S3({
    endpoint: s3_endpoint,
    accessKeyId: `${access_key_id}`,
    secretAccessKey: `${access_key_secret}`,
    signatureVersion: 'v4',
  });

export default async function uploadGitFiles(filename : string , filePath : string)
 {
    const fileContent = fs.readFileSync(filePath)
   const response =  await s3.upload({
        Bucket: bucket_name ,
        Key: filename,
        Body: fileContent
    },).promise();

    console.log(response)

 }