"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundData = void 0;
class RefundData {
    constructor() {
        //退货时间
        this.refundTime = '';
        //退货的订单号
        this.refundOrderNo = '';
        //退款金额
        this.refundPrice = '';
        //退货是否成功
        this.isSuccess = false;
        this.refundRemark = '';
    }
}
exports.RefundData = RefundData;
