"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const child_process_1 = require("child_process");
function execute(pathToDir) {
    return new Promise((resolve, reject) => {
        var _a, _b;
        // const finalPath : string  = pathToDir.split(path.sep).join('/')
        // console.log(finalPath)
        const childProcess = (0, child_process_1.exec)(`cd ../dist/${pathToDir} && npm install && npm run build`);
        console.log("Building 🛫🛫🛫🛫");
        (_a = childProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        (_b = childProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        childProcess.on('close', (code) => {
            resolve("");
        });
    });
}
exports.execute = execute;
