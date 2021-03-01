import {ReadUtils} from "./readUtils";
import * as fs from 'fs'
import * as path from "path";
import {DeviceName} from "../static/deviceName";
import {LogUtils} from "./logUtils";

const deviceName:string = DeviceName.getDeviceName();

/**
 * 获取机器配置信息并且保存在一个Map中
 * 单例模式
 * 请使用GlobalUtil.getConfigMap()获得配置信息Map
 */
export class GlobalUtil {
    private static configMap:Map<string, string>;
    private static instance:GlobalUtil;
    private constructor() {
        GlobalUtil.configMap = new Map<string, string>();
        GlobalUtil.readTest();
        LogUtils.log.info(GlobalUtil.configMap);
    }

    /**
     * @returns {Map<string, string>} : 机器配置信息Map, 例如: 
     */
    public static getConfigMap():Map<string, string> {
        if (GlobalUtil.instance == null) {
            GlobalUtil.instance = new GlobalUtil();
        }
        return GlobalUtil.configMap;
    }


    /**
     * 读取json文件，获得配置参数的map集合
     */
    private static readTest(){
        LogUtils.log.info("***开始获取自动化测试的配置参数***");
        //读取json自动化测试所需参数
        let buffer:any;
        let fileName:string = '../../globalconfig_'+deviceName+'.json';  // 例如: ../../globalconfig_a8.json
        buffer=fs.readFileSync(path.join(__dirname, fileName));
        let data=buffer.toString();
        //将json转换为字符串，再将字符串转换为map集合 获取对应参数值
        for (let obj of Object.keys(JSON.parse(data))){
            GlobalUtil.configMap.set(obj,JSON.parse(data)[obj])
        }
        LogUtils.log.info("***获取自动化测试的配置参数完成***");
    }


    /**
     * @deprecated The variable should not be used
     * 请使用GlobalUtil.getConfigMap()获得配置信息Map
     */
    public static map:any = new Map();
    // 初始化，获取配置信息
    public static init(){
        ReadUtils.readTest(this.map);
    }
}