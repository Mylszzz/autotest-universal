import * as fs from 'fs'
import * as path from "path";
import  incon from 'iconv-lite'
import {LogUtils} from "./logUtils";
import {DeviceName} from "../static/deviceName";

const deviceName:string = DeviceName.getDeviceName();


export class ReadUtils {

    public async readTextContent(filePath: string) {
        let map: string[] = [];
        await fs.readFile(filePath, "utf-8", function (err, data) {
            if (err) {
                return console.error(err)
            }
            if (data != null) {
                let d: string = data.toString();
                let strings: string[] = d.split(new RegExp(/\r\n/));

                for (let string of strings) {
                    if (string != "") {
                        let str: string[] = string.split("：");
                        // for (let s of str) {
                        //     console.log(s);
                        // }
                        let s1 = str[0];
                        console.log(s1);
                        map.push(s1);
                        let s2: number = Number(str[1]);
                        for (let i = 0; i < s2; i++) {
                            console.log(s1 + "=>>" + i)

                        }
                        console.log(s2);
                        //  map.set(s1,s2);
                        //map.push(s2);
                    }
                }
            }

        });

    }

    public static  readTestforSale():string {
        let map=new Map();
        this.readTest(map);
        let path:string=map.get("testPath");//获取得到自动化测试文件
        let fileStr = fs.readFileSync(path,{encoding:'binary'});
        //文件为gbk编码 读取的编码格式为utf8，需要进行gbk编码
        let buffer = new Buffer(fileStr,'binary');
        let data:string =incon.decode(buffer,'GBK');
        //console.log(data);
        LogUtils.log.info("获取的自动化测试数据====>>"+data)
        return data;
    }

    public static readForRefund():string{
        let map=new Map();
        this.readTest(map);
        let path1:string=map.get("refundDataPath");//获取得到自动化测试文件
        let fileStr = fs.readFileSync(path.join(__dirname,path1),{encoding:'binary'});
        //文件为gbk编码 读取的编码格式为utf8，需要进行gbk编码
        let buffer = new Buffer(fileStr,'binary');
        let data:string =incon.decode(buffer,'utf8');
        //console.log(data);
        LogUtils.log.info("获取的退款的自动化测试数据====>>"+data);
        return data;
    }

    //读取json文件，获得配置参数的map集合
    public static readTest(map:any){
        //LogUtils.log.info("===开始获取自动化测试的配置参数===");
        //读取json自动化测试所需参数
        this.sleep(2000);
        let buffer:any;
        if (deviceName=="a8") {
            buffer=fs.readFileSync(path.join(__dirname,"../../globalconfig.json"));
        } else if (deviceName=='elo'){
            buffer=fs.readFileSync(path.join(__dirname,"../../globalconfig_elo.json"));
        }

        let  data=buffer.toString();
        console.log(JSON.parse(data));
        //将json转换为字符串，再将字符串转换为map集合 获取对应参数值
        //let map=new Map();ss
        for (let obj of Object.keys(JSON.parse(data))){
            map.set(obj,JSON.parse(data)[obj])
        }
        //LogUtils.log.info("===获取自动化测试的配置参数完成===");
    }

    public static sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms)
        });

    }
}
