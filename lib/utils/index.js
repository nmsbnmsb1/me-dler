"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileType = getFileType;
exports.isExists = isExists;
const promises_1 = __importDefault(require("node:fs/promises"));
__exportStar(require("./errs"), exports);
__exportStar(require("./http"), exports);
async function getFileType(p) {
    try {
        const stats = await promises_1.default.lstat(p);
        return stats.isDirectory() ? 'directory' : 'file';
    }
    catch (err) {
        if (err.code === 'ENOENT')
            return 'not-exist';
        throw err;
    }
}
async function isExists(p) {
    let fileType = await getFileType(p);
    if (fileType === 'not-exist')
        return false;
    return true;
}
//# sourceMappingURL=index.js.map