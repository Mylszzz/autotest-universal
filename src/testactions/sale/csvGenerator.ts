import {ExportCsv} from "../../utils/exportCsv";
import {SaleData} from "../../entity/saleData";
import {CsvOptions} from "../../utils/csvOptions";

/**
 * csv输出文件生成器
 * 用于整个销售测试用例开始之前实例化
 * 每单销售测试用例是时调用printCsv()用于输出csv
 */
export class CsvGenerator {
    private header: string[];
    private fileName: string;

    /**
     *
     * @param {string} header
     * @param {string} fileName
     */
    public constructor(header: string[], fileName: string) {
        this.header = header;
        this.fileName = fileName;
    }

    /**
     * 打印销售记录到csv文件
     * @param {SaleData[]} data: TODO
     * @param {number} seqNum: 销售测试用例序号
     */
    public printCsv(data: string[][], seqNum: number) {
        ExportCsv.printSaleData(CsvOptions.configurationOption(seqNum, this.header), data, this.fileName);
    }
}