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
const logUtils_1 = require("./logUtils");
const deviceName_1 = require("../static/deviceName");
const deviceName = deviceName_1.DeviceName.getDeviceName();
class ReadUtils {
    static readForRefund() {
        let map = new Map();
        this.readTest(map);
        let path1 = map.get("refundDataPath"); //获取得到自动化测试文件
        let fileStr = fs.readFileSync(path.join(__dirname, path1), { encoding: 'binary' });
        //文件为gbk编码 读取的编码格式为utf8，需要进行gbk编码
        let buffer = new Buffer(fileStr, 'binary');
        let data = iconv_lite_1.default.decode(buffer, 'utf8');
        //console.log(data);
        logUtils_1.LogUtils.log.info("获取的退款的自动化测试数据====>>" + data);
        return data;
    }
    // TODO: 这里要改！
    //读取json文件，获得配置参数的map集合
    static readTest(map) {
        this.sleep(2000);
        let buffer;
        let fileName = '../../globalconfig_' + deviceName + '.json'; // 例如: ../../globalconfig_a8.json
        buffer = fs.readFileSync(path.join(__dirname, fileName));
        let data = buffer.toString();
        for (let obj of Object.keys(JSON.parse(data))) {
            map.set(obj, JSON.parse(data)[obj]);
        }
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
