import { createClient, commandOptions } from "redis";
import express from "express";
import {downloadS3Folder} from "./downloadFromS3";
import {execute} from "./execute";
import getAllFilePaths from "./getAllFiles";
import uploadBuild from "./uploadBuild";
import path from 'path' ;

const app =  express();
const  subscriber = createClient();
subscriber.connect();
const port: number = 5001;

const  publisher = createClient();
subscriber.connect();

//function to loop the queue
async function main() {
    while (1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'repo-queue',
            0
        );
        //@ts-ignore
          await  downloadS3Folder(`out/${res.element}`)
          console.log("Downloaded file")
      
            //@ts-ignore
         await  execute( `out/${res.element}`)
          console.log("File builded")
            //@ts-ignore
            const fileArray = await getAllFilePaths(path.join(__dirname + `/out/${res.element}/dist`))
            console.log(fileArray)
            fileArray.forEach((file)=>
            {
                const path = file.toString();
                const parts = path.split("\\"); // Split the string by "/"
                const extractedPath = parts.slice(5).join("/");
                console.log(extractedPath)
                uploadBuild(`dist/${extractedPath}`, file)

            })
            await console.log("✅ Build Uploaded")
           //@ts-ignore
          publisher.hSet('repo-status', res.element, 'deployed')
            // console.log(res.element)
    }
}
main();

app.listen(port, ()=>
{
    console.log("listening on port" + port)
})
