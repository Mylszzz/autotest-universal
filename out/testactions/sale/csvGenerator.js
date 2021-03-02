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
     *
     * @param {string} header
     * @param {string} fileName
     */
    constructor(header, fileName) {
        this.header = header;
        this.fileName = fileName;
    }
    /**
     * 打印销售记录到csv文件
     * @param {string[][]} data: 要打印的数据
     * @param {number} seqNum: 销售测试用例序号
     */
    printCsv(data, seqNum) {
        exportCsv_1.ExportCsv.printSaleData(csvOptions_1.CsvOptions.configurationOption(seqNum, this.header), data, this.fileName);
    }
}
exports.CsvGenerator = CsvGenerator;
