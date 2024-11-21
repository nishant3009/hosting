import fs from 'fs';
import path from 'path';

export default function getAllFilePaths(directoryPath : string ) : Array<string> {
    // Initialize an array to store file paths
    let filePaths : Array<string> = [];

    // Synchronously read all files in the directory
    const files = fs.readdirSync(directoryPath);

    // Iterate through each file in the directory
    files.forEach(file => {
        // Construct the full path of the file
        const filePath = path.join(directoryPath, file);

        // Check if the file is a directory
        if (fs.statSync(filePath).isDirectory()) {
            // If it's a directory, recursively get file paths from it
            filePaths = filePaths.concat(getAllFilePaths(filePath));
        } else {
            // If it's a file, add its path to the array
            filePaths.push(filePath);
        }
    });

    return filePaths;
}
   