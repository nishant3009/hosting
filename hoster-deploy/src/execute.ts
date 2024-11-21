import {exec} from 'child_process';
import path from 'path';

export function execute(pathToDir : string){
  return new Promise((resolve, reject) => {

    // const finalPath : string  = pathToDir.split(path.sep).join('/')
    // console.log(finalPath)
    const childProcess = exec(`cd ../dist/${pathToDir} && npm install && npm run build`)
    console.log("Building 🛫🛫🛫🛫")
    childProcess.stdout?.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      
      childProcess.stderr?.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      childProcess.on('close', (code) => {
        resolve("");
      })
  })
 
}