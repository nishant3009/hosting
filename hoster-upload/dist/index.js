"use strict";
// 84110ad2b9165709ab36c800da5093c4
// 43e388d61b8dd4a4be6b8194330f74dea9261660ca86f400aa336a7d36f3f256
// https://16aa2c401244123bf49ffa092578012c.r2.cloudflarestorage.com
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const simple_git_1 = require("simple-git");
const file_1 = __importDefault(require("./file"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const upload_1 = __importDefault(require("./upload"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
const redisClient = (0, redis_1.createClient)();
redisClient.connect();
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const options = {
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
};
app.use(body_parser_1.default.urlencoded({ extended: false }));
const git = (0, simple_git_1.simpleGit)(options);
app.use((0, cors_1.default)());
function generate() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
app.get("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repoUrl = req.body.repoUrl;
        const sessionId = generate();
        const gitFileDir = path_1.default.join(__dirname, `../out/${sessionId}`);
        yield git.clone(repoUrl, gitFileDir);
        res.json({
            id: sessionId
        });
        const fileArray = yield (0, file_1.default)(path_1.default.join(__dirname, `../out/${sessionId}`));
        fileArray.forEach((file) => {
            const path = file.toString();
            const parts = path.split("\\"); // Split the string by "/"
            const extractedPath = parts.slice(3).join("/"); // Extract the last 4 parts and join them with "/"
            (0, upload_1.default)(extractedPath, file);
        });
        redisClient.lPush("repo-queue", sessionId);
        redisClient.hSet("repo-status", sessionId, "uploaded");
    }
    catch (error) {
        res.send(error.message);
        res.status(error.status);
    }
}));
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const status = yield subscriber.hGet("repo-status", id);
        res.send(status);
    }
    catch (error) {
        res.send(error.message);
    }
}));
app.listen(5000, () => {
    console.log("listening on port " + 5000);
});
