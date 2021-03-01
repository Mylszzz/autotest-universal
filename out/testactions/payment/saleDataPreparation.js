"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleDataPreparation = void 0;
const logUtils_1 = require("../../utils/logUtils");
const readCSV_1 = require("../../utils/readCSV");
const fs_1 = __importDefault(require("fs"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const globalUtil_1 = require("../../utils/globalUtil");
class SaleDataPreparation {
    /**
     * 用于读取销售流程的测试用例
     * @returns {Map}
     */
    readFile() {
        let data = fs_1.default.readFileSync(globalUtil_1.GlobalUtil.getConfigMap().get('csv'));
        let buffer = iconv_lite_1.default.decode(data, "gbk"); // 文件的编码格式是GBK
        let string = buffer.toString();
        //读取每一行的数据
        let line_list = string.split('\r\n');
        this.saleMap.set("saleContent", line_list);
    }
    /**
     * 处理读取到的销售信息，得到实际使用了的支付方式和是否退货和取消交易
     * 并更新到saleMap
     */
    dataProcess(line_list) {
        //获取首行
        let name = line_list[0].split(',');
        for (let i = 1; i < line_list.length; i++) {
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
    /**
     *
     */
    saleDataPreparation() {
        this.saleMap = readCSV_1.ReadCSV.readFile();
        let saleContent = this.saleMap.get('saleContent');
        logUtils_1.LogUtils.log.info("-------map--------------");
        logUtils_1.LogUtils.log.info(saleContent);
        let headers = ["saleTime", "orderNo", "price"];
        headers.push(saleContent[0].split(','));
        for (let i = 1; i <= this.saleMap.size - 1; i++) {
            let mode = this.saleMap.get(i);
            if (mode !== undefined) {
                let payTree = mode.payTree;
                console.log("payTree[" + i + "]:" + payTree.get('data'));
                console.log(payTree.get("data")[0] + " " + payTree.get("data")[1]);
                let otherTree = mode.otherTree;
                console.log("otherTree[" + i + "]:" + otherTree.get('data'));
                console.log(otherTree.get("data")[0] + " " + otherTree.get("data")[1]);
                //   await VipMixedPayment.test(client, payTree, otherTree,i,headers,saleContent[i].split(','),fileName);
            }
            else {
            }
        }
    }
}
exports.SaleDataPreparation = SaleDataPreparation;
