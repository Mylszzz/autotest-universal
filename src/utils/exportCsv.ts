import fs from "fs";
import {ExportToCsv} from "ts-export-to-csv";
import * as path from "path";


/**
 * 打印CSV的工具类
 */
export class ExportCsv {

    /**
     * 打印销售文档
     * @param options: 输出csv的配置，在csvOptions.ts中配置
     * @param data: 二元数组 string[][]
     * @param {string} fileName: 输出的文件名
     */
    public static printSaleData(options: any, data: string[][], fileName: string) {
        const csvExporter = new ExportToCsv(options);

        const csvData = csvExporter.generateCsv(data, true);

        fs.writeFileSync(path.join(__dirname, "../../csvData/sale/" + fileName), csvData, {
            flag: 'a',
            encoding: 'utf8'
        });
    }

    /**
     * 打印退货文档
     * @param options
     * @param refundData
     * @param {string} fileName
     */
    public static printRefundData(options: any, refundData: any, fileName: string) {
        const csvExporter = new ExportToCsv(options);
        const csvData = csvExporter.generateCsv(refundData, true);
        let path1 = '../../csvData/refund/' + new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + '-' + Date.now() + '-' + fileName + '.csv';
        fs.writeFileSync(path.join(__dirname, path1), csvData, {
            flag: 'a',
            encoding: 'utf8'
        });
    }
}
