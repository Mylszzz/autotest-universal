import * as fs from 'fs'
import * as path from "path";
import incon from 'iconv-lite'
import {LogUtils} from "./logUtils";
import {DeviceName} from "../static/deviceName";


export class ReadUtils {

    public static readForRefund(filename:string): string {
        let fileStr = fs.readFileSync(path.join(__dirname, '../../csvData/sale/'+filename), {encoding: 'binary'});
        //文件为gbk编码 读取的编码格式为utf8，需要进行gbk编码
        let buffer = new Buffer(fileStr, 'binary');
        let data: string = incon.decode(buffer, 'utf8');
        //console.log(data);
        LogUtils.log.info("获取的退款的自动化测试数据====>>" + data);
        return data;
    }

    // TODO: 这里要改！
    //读取json文件，获得配置参数的map集合
    public static readTest(map: any) {
        this.sleep(2000);
        let buffer: any;
        let fileName: string = '../../globalconfig_' + DeviceName.getDeviceName() + '.json';  // 例如: ../../globalconfig_a8.json
        buffer = fs.readFileSync(path.join(__dirname, fileName));
        let data = buffer.toString();
        for (let obj of Object.keys(JSON.parse(data))) {
            map.set(obj, JSON.parse(data)[obj])
        }
    }

    public static sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms)
        });

    }
}
