"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvGenerator = void 0;
const exportCsv_1 = require("../../utils/exportCsv");
const csvOptions_1 = require("../../utils/csvOptions");
class CsvGenerator {
    constructor(header, fileName) {
        this.header = header;
        this.fileName = fileName;
    }
    /**
     * 打印销售记录到csv文件
     * @param {SaleData[]} data: TODO
     * @param {number} seqNum: 销售测试用例序号
     */
    printCsv(data, seqNum) {
        exportCsv_1.ExportCsv.printSaleData(csvOptions_1.CsvOptions.configurationOption(seqNum, this.header), data, this.fileName);
    }
}
exports.CsvGenerator = CsvGenerator;
