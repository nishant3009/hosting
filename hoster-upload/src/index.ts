// 84110ad2b9165709ab36c800da5093c4
// 43e388d61b8dd4a4be6b8194330f74dea9261660ca86f400aa336a7d36f3f256
// https://16aa2c401244123bf49ffa092578012c.r2.cloudflarestorage.com


import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { simpleGit, SimpleGit, CleanOptions, SimpleGitOptions } from 'simple-git';
import getAllFilePaths from "./file"
import path from 'path';
import bodyParser from 'body-parser';
import uploadGitFiles from './upload';
import {createClient} from 'redis'

const app = express();
const redisClient = createClient();
redisClient.connect();
const subscriber = createClient();
subscriber.connect();

const options: Partial<SimpleGitOptions> = {
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};

app.use(bodyParser.urlencoded({ extended: false }));
const git: SimpleGit = simpleGit(options);

app.use(cors());

function generate() : string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.get("/deploy" ,async (req,res)=>
{
  try {
  const repoUrl: string = req.body.repoUrl;
  const sessionId : string = generate();
  const gitFileDir = path.join(__dirname, `../out/${sessionId}`)
  await git.clone(repoUrl, gitFileDir)
  res.json({
    id : sessionId
  })
  const fileArray = await getAllFilePaths(path.join(__dirname, `../out/${sessionId}`))
  fileArray.forEach((file) =>{
    const path = file.toString();
const parts = path.split("\\"); // Split the string by "/"
const extractedPath = parts.slice(3).join("/"); // Extract the last 4 parts and join them with "/"
     uploadGitFiles(extractedPath, file)
  })
  redisClient.lPush("repo-queue" , sessionId)
  redisClient.hSet("repo-status" , sessionId , "uploaded")
  } catch (error: any) {
    res.send(error.message)
    res.status(error.status)
  }
})

app.get("/status" , async (req,res)=>{
  try {
    const id = req.query.id;
    const status = await subscriber.hGet("repo-status", id as string);
    res.send(status)
  } catch (error : any) {
    res.send(error.message)
  }

})
app.listen(5000, () => {
  console.log("listening on port " + 5000);
});
