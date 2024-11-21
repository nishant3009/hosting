"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getAllFilePaths(directoryPath) {
    // Initialize an array to store file paths
    let filePaths = [];
    // Synchronously read all files in the directory
    const files = fs_1.default.readdirSync(directoryPath);
    // Iterate through each file in the directory
    files.forEach(file => {
        // Construct the full path of the file
        const filePath = path_1.default.join(directoryPath, file);
        // Check if the file is a directory
        if (fs_1.default.statSync(filePath).isDirectory()) {
            // If it's a directory, recursively get file paths from it
            filePaths = filePaths.concat(getAllFilePaths(filePath));
        }
        else {
            // If it's a file, add its path to the array
            filePaths.push(filePath);
        }
    });
    return filePaths;
}
exports.default = getAllFilePaths;
