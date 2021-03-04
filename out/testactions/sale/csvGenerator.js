"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvGenerator = void 0;
const exportCsv_1 = require("../../utils/exportCsv");
const csvOptions_1 = require("../../utils/csvOptions");
const logUtils_1 = require("../../utils/logUtils");
/**
 * csv输出文件生成器
 * 用于整个销售测试用例开始之前实例化
 * 每单销售测试用例是时调用printCsv()用于输出csv
 */
class CsvGenerator {
    /**
     * 构造方法
     * @param {string[]} header
     * @param {string} fileName
     * @param {string[]} rows
     */
    constructor(header, fileName, rows) {
        this.saleTime = 'unknown';
        this.saleOrderNo = 'unknown';
        this.priceForCsv = 'unknown';
        this.saleContent = [];
        this.header = header;
        this.fileName = fileName;
        this.rows = rows;
    }
    /**
     * 打印销售记录到csv文件
     * @param {string[][]} data: 要打印的数据
     * @param {number} seqNum: 销售测试用例序号
     */
    printCsv(data, seqNum) {
        this.saleTime = data.saleTime;
        this.saleOrderNo = data.saleOrderNo;
        this.priceForCsv = data.priceForCsv;
        this.saleContent = this.rows[seqNum].split(',');
        let tempData = [this.saleTime, "'" + this.saleOrderNo, this.priceForCsv];
        tempData = tempData.concat(this.saleContent);
        logUtils_1.LogUtils.saleLog.warn(tempData);
        let dataToPrint = [tempData];
        exportCsv_1.ExportCsv.printSaleData(csvOptions_1.CsvOptions.configurationOption(seqNum, this.header), dataToPrint, this.fileName);
    }
}
exports.CsvGenerator = CsvGenerator;
