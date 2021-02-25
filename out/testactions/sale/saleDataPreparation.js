"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleSaleDataPreparation = exports.SaleDataPreparation = void 0;
const fs_1 = __importDefault(require("fs"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const globalUtil_1 = require("../../utils/globalUtil");
/**
 * 全部条销售测试用例的数据准备
 */
class SaleDataPreparation {
    constructor() {
        this.saleMap = new Map(); // TODO: useless
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
        this.title = this.rows[0].split(',');
    }
}
exports.SaleDataPreparation = SaleDataPreparation;
/**
 * 单条销售记录的数据准备
 */
class SingleSaleDataPreparation {
    constructor(seqNum) {
        this.seqNum = seqNum;
    }
    /**
     * 处理读取到的销售信息，得到实际使用了的支付方式和是否退货和取消交易
     * 并更新到saleMap
     */
    dataProcess() {
        //获取首行
        let title = this.rows[0].split(','); // 首行是销售测试用例的字段
        for (let i = 1; i < this.rows.length; i++) {
            let paymentInfoMap = new Map();
            let saleOptionsInfoMap = new Map();
            let payTree = new Map();
            let otherTree = new Map();
            // 支付方式
            let pay = [];
            //支付价格
            let price = [];
            // 其他（是否退货、是否取消交易）
            let key = [];
            // key 的值
            let val = [];
            if (line_list[i].length != 0) {
                let item_list = line_list[i].split(',');
                let n = 0;
                let m = 0;
                for (let j = 0; j < item_list.length - 2; j++) {
                    if (item_list[j] != '0') {
                        pay[n] = name[j];
                        price[n] = +item_list[j];
                        n++;
                    }
                }
                payTree.set("data", [pay, price]);
                for (let k = item_list.length - 1; k > item_list.length - 3; k--) {
                    key[m] = name[k];
                    val[m] = item_list[k];
                    m++;
                }
                otherTree.set("data", [key, val]);
                this.saleMap.set(i, { 'payTree': payTree, 'otherTree': otherTree });
            }
        }
    }
}
exports.SingleSaleDataPreparation = SingleSaleDataPreparation;
