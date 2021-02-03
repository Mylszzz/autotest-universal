import fs from "fs";
import {ExportToCsv, Options} from "ts-export-to-csv";
import {GlobalUtil} from "./GlobalUtil";
import * as path from "path";
import {Tools} from "./Tools";
import {Title} from "../entity/title";
import {createObjectCsvWriter} from 'csv-writer'


export class ExportCsv {

    /**
     *
     * @param options: 输出csv的配置，在csvOptions.ts中配置
     * @param data: 二元数组 string[][]
     * @param {string} fileName: 输出的文件名
     */
    public static printSaleData(options:any,data:any,fileName:string) {
        const csvExporter = new ExportToCsv(options);

        const csvData = csvExporter.generateCsv(data, true);

        fs.writeFileSync(path.join(__dirname, "../../csvData/sale/" +fileName), csvData, {
            flag: 'a',
            encoding: 'utf8'
        });
        // fs.writeFileSync('data.csv',csvData,{flag:'a',encoding:'utf8'});
        // fs.writeFileSync('/data/'+new Date().toLocaleDateString()+"-"+Tools.guid()+'.csv',csvData,{flag:'a',encoding:'utf8'});
    }
    public static printRefundData(options:any,refundData:any,fileName:string) {
        const csvExporter = new ExportToCsv(options);
        const csvData = csvExporter.generateCsv(refundData, true);
        let path1='../../csvData/refund/'+new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+'-'+Date.now()+'-'+fileName+'.csv';
        fs.writeFileSync(path.join(__dirname, path1), csvData, {
            flag: 'a',
            encoding: 'utf8'
        });
        // fs.writeFileSync('data.csv',csvData,{flag:'a',encoding:'utf8'});
        // fs.writeFileSync('/data/'+new Date().toLocaleDateString()+"-"+Tools.guid()+'.csv',csvData,{flag:'a',encoding:'utf8'});
    }

    public static printTestData(options:any) {
        const csvExporter = new ExportToCsv(options);
        const csvData = csvExporter.generateCsv(GlobalUtil.testData, true);
        let path1='../../csvData/refund/'+new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDay()+'-'+Tools.guid()+'.csv';
        fs.writeFileSync(path.join(__dirname, path1), csvData, {
            flag: 'a',
            encoding: 'utf8'
        });
        // fs.writeFileSync('data.csv',csvData,{flag:'a',encoding:'utf8'});
        // fs.writeFileSync('/data/'+new Date().toLocaleDateString()+"-"+Tools.guid()+'.csv',csvData,{flag:'a',encoding:'utf8'});
    }





}
