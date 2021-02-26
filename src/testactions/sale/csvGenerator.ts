import {ExportCsv} from "../../utils/exportCsv";
import {SaleData} from "../../entity/saleData";
import {CsvOptions} from "../../utils/csvOptions";

export class CsvGenerator{
    private header:string[];
    private fileName:string;

    /**
     *
     * @param {string} header
     * @param {string} fileName
     */
    public constructor (header:string[], fileName:string){
        this.header = header;
        this.fileName = fileName;
    }

    /**
     * 打印销售记录到csv文件
     * @param {SaleData[]} data: TODO
     * @param {number} seqNum: 销售测试用例序号
     */
    public printCsv(data:SaleData[], seqNum:number) {
        ExportCsv.printSaleData(CsvOptions.configurationOption(seqNum, this.header),data,this.fileName);
    }
}