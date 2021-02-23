import * as fs from "fs";
import incon from 'iconv-lite'
import * as path from "path";
import {LogUtils} from "./LogUtils";

export class ReadUtils {
    public async readTextContnt(filePath:string){
        let map:string[] = [];
        await fs.readFile(filePath,"utf8",function (err,data) {
            if (err){
                return console.error(err);
            }
            if (data!=null || data!=""){
                let d = data.toString();
                let strings:string[] = d.split(new RegExp(/\r\n/));
                
                for (let string of strings){
                    if (string !=""){
                        let str:string[] = string.split(":");
                        let key = str[0];
                        console.log(key);
                        map.push(key);
                        let value:number=Number(str[1]);
                        for (let i=0;i<value;i++){
                            console.log(key+"=>>"+i);
                        }
                        console.log(value);
                    }
                } 
            }
        })

    }



    public static readTestforSale():string {
        let dataMap = new Map();
        this.readTest(dataMap);
        let path:string=dataMap.get("testPath");
        let fileStr = fs.readFileSync((path,'binary'));
        let buffer = new Buffer(fileStr,'binary');
        let data:string =incon.decode(buffer,'GBK');
        LogUtils.log.info("获取的自动化测试数据====>>"+data)
        return data;
    }


    //读取json文件，获取配置参数的map集合
    public static readTest(map:any){
            //LogUtils.log.info("===开始获取自动化测试的配置参数===");
            //读取json自动化测试所需要的参数
            //path.join()方法会将所有给定的path片段链接到一起
            let buffer = fs.readFileSync("D:\\github file\\autotest-universal\\data.csv");
            let data = buffer.toString();
            console.log(JSON.parse(data));
            for (let obj of Object.keys(JSON.parse(data))){
                map.set(obj,JSON.parse(data)[obj]);
            }

    }

}