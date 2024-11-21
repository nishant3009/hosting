"use strict";
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
const sendHtml_1 = require("./sendHtml");
const app = (0, express_1.default)();
const port = 3001;
app.get('/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
    const path = (_b = req.query) === null || _b === void 0 ? void 0 : _b.path;
    if (typeof id === 'string' && typeof path === 'string') {
        try {
            const data = yield (0, sendHtml_1.fetchHtml)(id, path);
            if (data) {
                res.set("Content-Type", data.type);
                res.send(data.content);
            }
            else {
                res.send("No data founded");
            }
        }
        catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
    else {
        res.status(400).send('Bad Request: id is required and should be a string');
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
