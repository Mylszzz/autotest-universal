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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalUtil = void 0;
const readUtils_1 = require("./readUtils");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const deviceName_1 = require("../static/deviceName");
const logUtils_1 = require("./logUtils");
/**
 * 获取机器配置信息并且保存在一个Map中
 * 单例模式
 * 请使用GlobalUtil.getConfigMap()获得配置信息Map
 */
class GlobalUtil {
    constructor() {
        GlobalUtil.configMap = new Map();
        GlobalUtil.readTest();
        logUtils_1.LogUtils.log.info(GlobalUtil.configMap);
        logUtils_1.LogUtils.log.info("*******获取自动化测试的配置参数完成*******");
    }
    /**
     * @returns {Map<string, string>} : 机器配置信息Map, 例如:
     */
    static getConfigMap() {
        if (GlobalUtil.instance == null) {
            GlobalUtil.instance = new GlobalUtil();
        }
        return GlobalUtil.configMap;
    }
    /**
     * 读取json文件，获得配置参数的map集合
     */
    static readTest() {
        logUtils_1.LogUtils.log.info("*******开始获取自动化测试的配置参数*******");
        //读取json自动化测试所需参数
        let buffer;
        let fileName = '../../globalconfig_' + deviceName_1.DeviceName.getDeviceName() + '.json'; // 例如: ../../globalconfig_a8.json
        buffer = fs.readFileSync(path.join(__dirname, fileName));
        let data = buffer.toString();
        //将json转换为字符串，再将字符串转换为map集合 获取对应参数值
        for (let obj of Object.keys(JSON.parse(data))) {
            GlobalUtil.configMap.set(obj, JSON.parse(data)[obj]);
        }
    }
    // 初始化，获取配置信息
    static init() {
        readUtils_1.ReadUtils.readTest(this.map);
    }
}
exports.GlobalUtil = GlobalUtil;
/**
 * @deprecated The variable should not be used
 * 请使用GlobalUtil.getConfigMap()获得配置信息Map
 */
GlobalUtil.map = new Map();
