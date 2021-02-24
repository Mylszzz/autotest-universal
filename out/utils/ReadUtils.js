"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadUtils = void 0;
const fs = __importStar(require("fs"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const LogUtils_1 = require("./LogUtils");
class ReadUtils {
    async readTextContnt(filePath) {
        let map = [];
        await fs.readFile(filePath, "utf8", function (err, data) {
            if (err) {
                return console.error(err);
            }
            if (data != null || data != "") {
                let d = data.toString();
                let strings = d.split(new RegExp(/\r\n/));
                for (let string of strings) {
                    if (string != "") {
                        let str = string.split(":");
                        let key = str[0];
                        console.log(key);
                        map.push(key);
                        let value = Number(str[1]);
                        for (let i = 0; i < value; i++) {
                            console.log(key + "=>>" + i);
                        }
                        console.log(value);
                    }
                }
            }
        });
    }
    static readTestforSale() {
        let dataMap = new Map();
        this.readTest(dataMap);
        let path = dataMap.get("testPath");
        let fileStr = fs.readFileSync((path, 'binary'));
        let buffer = new Buffer(fileStr, 'binary');
        let data = iconv_lite_1.default.decode(buffer, 'GBK');
        LogUtils_1.LogUtils.log.info("获取的自动化测试数据====>>" + data);
        return data;
    }
    //读取json文件，获取配置参数的map集合
    static readTest(map) {
        //LogUtils.log.info("===开始获取自动化测试的配置参数===");
        //读取json自动化测试所需要的参数
        //path.join()方法会将所有给定的path片段链接到一起
        let buffer = fs.readFileSync("D:\\github file\\autotest-universal\\data.csv");
        let data = buffer.toString();
        console.log(JSON.parse(data));
        for (let obj of Object.keys(JSON.parse(data))) {
            map.set(obj, JSON.parse(data)[obj]);
        }
    }
}
exports.ReadUtils = ReadUtils;
