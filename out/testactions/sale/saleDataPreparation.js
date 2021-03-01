"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleSaleDataPreparation = exports.SaleDataPreparation = void 0;
const logUtils_1 = require("../../utils/logUtils");
const fs_1 = __importDefault(require("fs"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const globalUtil_1 = require("../../utils/globalUtil");
const number_precision_1 = __importDefault(require("number-precision"));
const csvFixedHeader = ['saleTime', 'orderNo', 'price']; // 输出csv的固定字段部分
/**
 * 全部条销售测试用例的数据准备
 * 单例模式
 */
class SaleDataPreparation {
    constructor() {
        this.rows = []; // 从销售测试用例csv文件中读取到的每一行数据的数组
        this.title = []; // csv文件的首行是销售测试用例的字段
    }
    /**
     * 获取SaleDataPreparation实例
     * @returns {SaleDataPreparation}
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new SaleDataPreparation();
        }
        return this.instance;
    }
    /**
     * 用于读取销售流程的测试用例
     * @returns {Map}
     */
    readFile() {
        let data = fs_1.default.readFileSync(globalUtil_1.GlobalUtil.getConfigMap().get('csv'));
        let buffer = iconv_lite_1.default.decode(data, "gbk"); // 文件的编码格式是GBK
        let string = buffer.toString();
        //读取每一行的数据
        this.rows = string.split('\r\n');
        logUtils_1.LogUtils.saleLog.info("**************读取销售csv**************");
        logUtils_1.LogUtils.saleLog.info(this.rows);
        logUtils_1.LogUtils.saleLog.info("**************************************");
        this.title = this.rows[0].split(',');
    }
    getTitle() {
        return this.title;
    }
    getRows() {
        return this.rows;
    }
    /**
     * @returns {string[]} 输出csv方法需要的参数：header
     */
    getCsvHeader() {
        return csvFixedHeader.concat(this.title);
    }
}
exports.SaleDataPreparation = SaleDataPreparation;
/**
 * 单条销售记录的数据准备
 */
class SingleSaleDataPreparation {
    /**
     * 构造方法,并进行数据处理dataProcess()
     * @param {number} seqNum: 序号，即该条销售测试用例是第几条
     * @param {string[]} title: 销售测试用例的标题（字段），如: 备用聚合支付渠道,现金,其他,猫酷电子券,春风里礼券,翼支付,退货,取消交易
     * @param {string} testCase: 该条销售测试用例，如: '0,2,0,0,1,0,N,N'
     */
    constructor(seqNum, title, testCase) {
        this.paymentInfoMap = new Map();
        this.saleOptionsInfoMap = new Map();
        this.price = 0;
        this.seqNum = seqNum;
        this.title = title;
        this.testCase = testCase;
        this.dataProcess();
    }
    /**
     * 处理读取到的销售信息，得到实际使用了的支付方式和是否退货和取消交易
     * 并更新到paymentInfoMap和saleOptionsInfoMap
     */
    dataProcess() {
        try {
            let testCaseList = this.testCase.split(',');
            for (let i = 0; i < this.title.length - 2; i++) {
                if (testCaseList[i] != '0') {
                    this.paymentInfoMap.set(this.title[i], testCaseList[i]);
                    this.price += Number(testCaseList[i]);
                    this.price = number_precision_1.default.strip(this.price);
                }
            }
            for (let i = this.title.length - 2; i < this.title.length; i++) {
                this.saleOptionsInfoMap.set(this.title[i], testCaseList[i]);
            }
        }
        catch (e) {
            // TODO
        }
    }
    getSaleData() {
        return {
            seqNum: this.seqNum,
            paymentInfoMap: this.paymentInfoMap,
            saleOptionsInfoMap: this.saleOptionsInfoMap,
            price: this.price
        };
    }
}
exports.SingleSaleDataPreparation = SingleSaleDataPreparation;
