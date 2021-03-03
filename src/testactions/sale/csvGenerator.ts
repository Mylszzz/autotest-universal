import {ExportCsv} from "../../utils/exportCsv";
import {CsvOptions} from "../../utils/csvOptions";
import {LogUtils} from "../../utils/logUtils";

/**
 * csv输出文件生成器
 * 用于整个销售测试用例开始之前实例化
 * 每单销售测试用例是时调用printCsv()用于输出csv
 */
export class CsvGenerator implements ISaleForCsv{
    private header: string[];
    private fileName: string;
    private rows: string[];  // 读取到销售数据测试用例的每行组成的数组

    saleTime: string = 'unknown';
    saleOrderNo: string = 'unknown';
    priceForCsv: string = 'unknown';
    saleContent: string[] = [];

    /**
     *
     * @param {string[]} header
     * @param {string} fileName
     * @param {string[]} rows
     */
    public constructor(header: string[], fileName: string, rows: string[]) {
        this.header = header;
        this.fileName = fileName;
        this.rows =rows;
    }

    /**
     * 打印销售记录到csv文件
     * @param {string[][]} data: 要打印的数据
     * @param {number} seqNum: 销售测试用例序号
     */
    public printCsv(data: ISaleForCsv, seqNum: number) {
        this.saleTime = data.saleTime;
        this.saleOrderNo = data.saleOrderNo;
        this.priceForCsv = data.priceForCsv;
        this.saleContent = this.rows[seqNum].split(',');
        let tempData: string[] = [this.saleTime, "'" + this.saleOrderNo, this.priceForCsv];
        tempData = tempData.concat(this.saleContent);

        LogUtils.saleLog.warn(tempData);
        let dataToPrint: string[][] = [tempData];

        ExportCsv.printSaleData(CsvOptions.configurationOption(seqNum, this.header), dataToPrint, this.fileName);
    }
}

export interface ISaleForCsv {
    saleTime: string;
    saleOrderNo: string;
    priceForCsv: string;
}