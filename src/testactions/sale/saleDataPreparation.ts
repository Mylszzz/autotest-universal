import {LogUtils} from "../../utils/logUtils";
import {ReadCSV} from "../../utils/readCSV";
import fs from "fs";
import iconv from 'iconv-lite'
import {GlobalUtil} from "../../utils/globalUtil";
import {ISaleData} from "./saleAction";
import NP from 'number-precision';

const csvFixedHeader:string[] = ['saleTime','orderNo','price'];  // 输出csv的固定字段部分
/**
 * 全部条销售测试用例的数据准备
 * 单例模式
 */
export class SaleDataPreparation {
    private rows:string[] = [];  // 从销售测试用例csv文件中读取到的每一行数据的数组
    private title:string[] = [];  // csv文件的首行是销售测试用例的字段
    private static instance:SaleDataPreparation;

    private constructor() {

    }

    /**
     * 获取SaleDataPreparation实例
     * @returns {SaleDataPreparation}
     */
    public static getInstance():SaleDataPreparation {
        if (!this.instance) {
            this.instance = new SaleDataPreparation();
        }
        return this.instance;
    }

    /**
     * 用于读取销售流程的测试用例
     * @returns {Map}
     */
    public readFile() {
        let data = fs.readFileSync(GlobalUtil.getConfigMap().get('csv'));
        let buffer = iconv.decode(data, "gbk");  // 文件的编码格式是GBK
        let string = buffer.toString();
        //读取每一行的数据
        this.rows = string.split('\r\n');

        LogUtils.saleLog.info("**************读取销售csv**************");
        LogUtils.saleLog.info(this.rows);
        LogUtils.saleLog.info("**************************************");

        this.title = this.rows[0].split(',');
    }

    public getTitle():string[] {
        return this.title;
    }

    public getRows():string[] {
        return this.rows;
    }

    /**
     * @returns {string[]} 输出csv方法需要的参数：header
     */
    public getCsvHeader():string[] {
        return csvFixedHeader.concat(this.title);
    }
}


/**
 * 单条销售记录的数据准备
 */
export class SingleSaleDataPreparation implements ISaleData{
    seqNum:number;
    paymentInfoMap:Map<string, string> = new Map<string, string>();
    saleOptionsInfoMap:Map<string, string> = new Map<string, string>();
    price:number = 0;

    private title:string[];  // 介绍见构造方法注释
    private testCase:string;

    /**
     * 构造方法,并进行数据处理dataProcess()
     * @param {number} seqNum: 序号，即该条销售测试用例是第几条
     * @param {string[]} title: 销售测试用例的标题（字段），如: 备用聚合支付渠道,现金,其他,猫酷电子券,春风里礼券,翼支付,退货,取消交易
     * @param {string} testCase: 该条销售测试用例，如: '0,2,0,0,1,0,N,N'
     */
    public constructor(seqNum:number, title:string[], testCase:string) {
        this.seqNum = seqNum;
        this.title = title;
        this.testCase = testCase;

        this.dataProcess();
    }

    /**
     * 处理读取到的销售信息，得到实际使用了的支付方式和是否退货和取消交易
     * 并更新到paymentInfoMap和saleOptionsInfoMap
     */
    private dataProcess() {
        try {
            let testCaseList:string[] = this.testCase.split(',');
            for (let i = 0; i < this.title.length-2; i++) {
                if (testCaseList[i] != '0') {
                    this.paymentInfoMap.set(this.title[i], testCaseList[i]);
                    this.price += Number(testCaseList[i]);
                    this.price= NP.strip(this.price);
                }
            }
            for (let i = this.title.length-2; i < this.title.length; i++) {
                this.saleOptionsInfoMap.set(this.title[i], testCaseList[i])
            }
        } catch (e) {
            // TODO
        }
    }

    public getSaleData():ISaleData {
        return {
            seqNum: this.seqNum,
            paymentInfoMap: this.paymentInfoMap,
            saleOptionsInfoMap: this.saleOptionsInfoMap,
            price: this.price
        };
    }

}