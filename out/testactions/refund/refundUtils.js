"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundOnce = exports.RefundPreparation = void 0;
const readUtils_1 = require("../../utils/readUtils");
const exceptions_1 = require("../../utils/exceptions");
class RefundPreparation {
    /**
     * 构造函数，并调用初始化退款数据的方法
     */
    constructor() {
        this.rows = []; //
        this.titleList = []; // 标题分类为各自一列
        this.refundDataMaps = []; // 所有退款数据
        this.init();
    }
    /**
     * 初始化退款数据
     */
    init() {
        //读取售卖记录
        let s = readUtils_1.ReadUtils.readForRefund();
        //console.log(s);
        this.rows = s.split('\r\n');
        //获取第一行的标题
        let title = this.rows[0];
        //console.log(title);
        this.titleList = title.split(','); // 标题分类为各自一列
        // 遍历每一行需要退款的记录
        for (let i = 1; i < this.rows.length - 1; i++) {
            let tempDataMap = new Map();
            let values = this.rows[i].split(',');
            for (let j = 0; j < this.titleList.length; j++) {
                tempDataMap.set(this.titleList[j], values[j]); // 退款字段, 值
            }
            this.refundDataMaps.push(tempDataMap);
        }
        console.log(this.refundDataMaps);
    }
    getRefundDataMaps() {
        return this.refundDataMaps;
    }
}
exports.RefundPreparation = RefundPreparation;
/**
 *
 */
class RefundOnce {
    /**
     * 构造方法，并调用dataProcess() 进行数据处理, 再调用isRefundable()判断是否需要退货，最后调用isBeforeToday()判断是当日/往日单
     * @param {Map<string, string>} refundDataMap: 储存单挑退款信息的Map
     */
    constructor(refundDataMap) {
        this.refundable = false; // 该退款条目就是否需要退款
        this.saleTime = ''; // 销售时间: 格式如 2021/2/4
        this.orderNo = ''; // 订单号
        this.price = ''; // 总价
        this.refund = false; // 是否退货
        this.cancel = false; // 是否取消交易
        this.isSuccess = ''; //是否退货成功
        this.payMethods = []; // 支付中使用的（金额不为0的支付方式）
        this.beforeToday = false; // 需要退款的订单是否为非本日订单
        this.refundDataMap = refundDataMap;
        this.dataProcess(this.refundDataMap);
        this.isRefundable();
        this.isBeforeToday(this.saleTime);
    }
    /**
     * 从输入的退款信息中解析退款需要用的字段
     * @param {Map<string,string>} refundDataMap
     */
    dataProcess(refundDataMap) {
        for (let [key, value] of refundDataMap) {
            try {
                switch (key) {
                    case 'orderNo':
                        this.orderNo = value;
                        break;
                    case 'price':
                        this.price = value;
                        break;
                    case '退货':
                        this.refund = value.toUpperCase() == 'Y';
                        break;
                    case '取消交易':
                        this.cancel = value.toUpperCase() == 'Y';
                        break;
                    case '是否退货成功':
                        this.isSuccess = value;
                        break;
                    case 'saleTime':
                        this.saleTime = value;
                        break;
                    default: // 其他字段是支付方式，这里只保存使用了的支付方式
                        if (value != '0') {
                            this.payMethods.push(key);
                        }
                        break;
                }
            }
            catch (e) {
                throw new exceptions_1.AutoTestException('A0002', '退款输入数据异常');
            }
        }
    }
    /**
     * @returns {string[]} 支付方式
     */
    getPayMethods() {
        return this.payMethods;
    }
    /**
     * @returns {boolean} 是否需要退货
     */
    getIsRefundable() {
        return this.refundable;
    }
    getOrderNo() {
        return this.orderNo;
    }
    getBeforeToday() {
        return this.beforeToday;
    }
    getPrice() {
        return this.price;
    }
    /**
     * 如果取消为N, 退货为Y, 则此单需要退货，设定this.refundable为true
     */
    isRefundable() {
        this.refundable = ((!this.cancel) && this.refund);
    }
    /**
     * 判断是否为往日订单（非本日）
     * @param {string} saleDate 从csv中读取到的销售日期
     * @returns {boolean}  true=非本日; false=本日
     */
    isBeforeToday(saleDate) {
        saleDate = saleDate.replace("/", "").replace("/", "");
        let todayDate = new Date().toLocaleDateString().replace("-", "")
            .replace("-", "");
        if (Number.parseInt(saleDate) != Number.parseInt(todayDate)) {
            this.beforeToday = true;
        }
        return this.beforeToday;
    }
}
exports.RefundOnce = RefundOnce;
