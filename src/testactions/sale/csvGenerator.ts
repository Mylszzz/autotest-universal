import {ExportCsv} from "../../utils/exportCsv";
import {CsvOptions} from "../../utils/csvOptions";
import {LogUtils} from "../../utils/logUtils";

/**
 * csv输出文件生成器
 * 用于整个销售测试用例开始之前实例化
 * 每单销售测试用例是时调用printCsv()用于输出csv
 */
export class CsvGenerator implements ISaleCsv{
    private header: string[];
    private fileName: string;
    private rows: string[] = [];  // 读取到销售数据测试用例的每行组成的数组

    saleTime: string = 'unknown';
    saleOrderNo: string = 'unknown';
    priceForCsv: string = 'unknown';
    saleContent: string[] = [];  // 销售内容: 单笔销售中每个支付方式的金额

    /**
     * 构造方法
     * @param {string[]} header
     * @param {string} fileName
     * @param {string[]} rows
     */
    public constructor(header: string[], fileName: string, rows?: string[]) {
        this.header = header;
        this.fileName = fileName;
        if (rows != undefined) {
            this.rows =rows;
        }
    }

    /**
     * 打印销售记录到csv文件
     * @param {string[][]} data: 要打印的数据
     * @param {number} seqNum: 销售测试用例序号
     * @param {string[]} otherContent: 可选参数，其他要打印的内容，备注等
     */
    public printCsv(data: ISaleCsv, seqNum: number, otherContent?: string[]) {
        this.saleTime = data.saleTime;
        this.saleOrderNo = data.saleOrderNo;
        this.priceForCsv = data.priceForCsv;
        let tempData: string[] = [this.saleTime, "'" + this.saleOrderNo, this.priceForCsv];
        if (this.rows.length != 0) {
            this.saleContent = this.rows[seqNum].split(',');
            tempData = tempData.concat(this.saleContent); 
        }
        if (otherContent != undefined) {
            tempData = tempData.concat(otherContent);
        }

        LogUtils.saleLog.warn(tempData);  // TODO 这个没有用
        let dataToPrint: string[][] = [tempData];

        ExportCsv.printSaleData(CsvOptions.configurationOption(seqNum, this.header), dataToPrint, this.fileName);
    }
}

export interface ISaleCsv {
    saleTime: string;  // 销售时间
    saleOrderNo: string;  // 订单号
    priceForCsv: string;  // 价格
}