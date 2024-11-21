
import S3 from 'aws-sdk/clients/s3.js';
import path from 'path';
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




//   export async function downloadS3Folder(prefix: string) {
//     const allFiles = await s3.listObjectsV2({
//         Bucket: bucket_name,
//         Prefix: prefix
//     }).promise();
    
//     // // 
//     // const allPromises = allFiles.Contents?.map(async ({Key}) => {
//     //     return new Promise(async (resolve) => {
//     //         if (!Key) {
//     //             resolve("");
//     //             return;
//     //         }
//     //         const finalOutputPath = path.join(__dirname, Key);
//     //         const outputFile = fs.createWriteStream(finalOutputPath);
//     //         const dirName = path.dirname(finalOutputPath);
//     //         if (!fs.existsSync(dirName)){
//     //             fs.mkdirSync(dirName, { recursive: true });
//     //         }
//     //         s3.getObject({
//     //             Bucket: bucket_name,
//     //             Key
//     //         }).createReadStream().pipe(outputFile).on("finish", () => {
//     //             resolve("");
//     //         })
//     //     })
//     // }) || []

//     const allPromises = allFiles.Contents?.map(({Key}) => {
//         return new Promise((resolve, reject) => {
//             if (!Key) {
//                 resolve("");
//                 return;
//             }
//             const finalOutputPath = path.join(__dirname, Key);
//             const outputFile = fs.createWriteStream(finalOutputPath);
//             const dirName = path.dirname(finalOutputPath);
//             if (!fs.existsSync(dirName)){
//                 fs.mkdirSync(dirName, { recursive: true });
//             }
//             const readStream = s3.getObject({
//                 Bucket: bucket_name,
//                 Key
//             }).createReadStream();
//             readStream.on('error', (err) => {
//                 reject(err);
//             });
//             readStream.pipe(outputFile);
//             readStream.on("end", () => {
//                 outputFile.close();
//                 resolve(finalOutputPath);
//             });
//         });
//     }) || [];
//     console.log("awaiting");

//     await Promise.all(allPromises?.filter(x => x !== undefined));
// }