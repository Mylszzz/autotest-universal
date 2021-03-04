"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvGenerator = void 0;
const exportCsv_1 = require("../../utils/exportCsv");
const csvOptions_1 = require("../../utils/csvOptions");
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
        this.rows = []; // 读取到销售数据测试用例的每行组成的数组
        this.saleTime = 'unknown';
        this.saleOrderNo = 'unknown';
        this.priceForCsv = 'unknown';
        this.saleContent = []; // 销售内容: 单笔销售中每个支付方式的金额
        this.header = header;
        this.fileName = fileName;
        if (rows != undefined) {
            this.rows = rows;
        }
    }
    /**
     * 打印销售记录到csv文件
     * @param {string[][]} data: 要打印的数据
     * @param {number} seqNum: 销售测试用例序号
     * @param {string[]} additionalContent: 可选参数，其他要打印的内容，备注等
     */
    printCsv(data, seqNum, additionalContent) {
        this.saleTime = data.saleTime;
        this.saleOrderNo = data.saleOrderNo;
        this.priceForCsv = data.priceForCsv;
        let tempData = [this.saleTime, "'" + this.saleOrderNo, this.priceForCsv];
        if (this.rows.length != 0) {
            this.saleContent = this.rows[seqNum].split(',');
            tempData = tempData.concat(this.saleContent);
        }
        if (additionalContent != undefined) {
            tempData = tempData.concat(additionalContent);
        }
        let dataToPrint = [tempData];
        exportCsv_1.ExportCsv.printSaleData(csvOptions_1.CsvOptions.configurationOption(seqNum, this.header), dataToPrint, this.fileName);
    }
}
exports.CsvGenerator = CsvGenerator;
