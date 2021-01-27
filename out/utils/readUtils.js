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
const path = __importStar(require("path"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const LogUtils_1 = require("./LogUtils");
class ReadUtils {
    async readTextContent(filePath) {
        let map = [];
        await fs.readFile(filePath, "utf-8", function (err, data) {
            if (err) {
                return console.error(err);
            }
            if (data != null) {
                let d = data.toString();
                let strings = d.split(new RegExp(/\r\n/));
                for (let string of strings) {
                    if (string != "") {
                        let str = string.split("：");
                        // for (let s of str) {
                        //     console.log(s);
                        // }
                        let s1 = str[0];
                        console.log(s1);
                        map.push(s1);
                        let s2 = Number(str[1]);
                        for (let i = 0; i < s2; i++) {
                            console.log(s1 + "=>>" + i);
                        }
                        console.log(s2);
                        //  map.set(s1,s2);
                        //map.push(s2);
                    }
                }
            }
        });
    }
    static readTestforSale() {
        let map = new Map();
        this.readTest(map);
        let path = map.get("testPath"); //获取得到自动化测试文件
        let fileStr = fs.readFileSync(path, { encoding: 'binary' });
        //文件为gbk编码 读取的编码格式为utf8，需要进行gbk编码
        let buffer = new Buffer(fileStr, 'binary');
        let data = iconv_lite_1.default.decode(buffer, 'GBK');
        //console.log(data);
        LogUtils_1.LogUtils.log.info("获取的自动化测试数据====>>" + data);
        return data;
    }
    static readForRefund() {
        let map = new Map();
        this.readTest(map);
        let path1 = map.get("refundDataPath"); //获取得到自动化测试文件
        let fileStr = fs.readFileSync(path.join(__dirname, path1), { encoding: 'binary' });
        //文件为gbk编码 读取的编码格式为utf8，需要进行gbk编码
        let buffer = new Buffer(fileStr, 'binary');
        let data = iconv_lite_1.default.decode(buffer, 'utf8');
        //console.log(data);
        LogUtils_1.LogUtils.log.info("获取的退款的自动化测试数据====>>" + data);
        return data;
    }
    //读取json文件，获得配置参数的map集合
    static readTest(map) {
        //LogUtils.log.info("===开始获取自动化测试的配置参数===");
        //读取json自动化测试所需参数
        this.sleep(2000);
        let buffer = fs.readFileSync(path.join(__dirname, "../../globalconfig.json"));
        let data = buffer.toString();
        console.log(JSON.parse(data));
        //将json转换为字符串，再将字符串转换为map集合 获取对应参数值
        //let map=new Map();ss
        for (let obj of Object.keys(JSON.parse(data))) {
            map.set(obj, JSON.parse(data)[obj]);
        }
        //LogUtils.log.info("===获取自动化测试的配置参数完成===");
    }
    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms);
        });
    }
}
exports.ReadUtils = ReadUtils;
