"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInfoMap = void 0;
const deviceName_1 = require("../static/deviceName");
const attribute_arr_a8 = ["总数量", "总金额", "优惠金额", "应付", "找零", "订单号", "创建时间", "状态"]; //TODO:需要全包变量中读取
const attribute_arr_elo = [];
class OrderInfoMap {
    constructor(payMethod) {
        this.payMethod = payMethod;
    }
    static createInfoMap() {
        let i; // 用于遍历数组
        if (deviceName_1.DeviceName.getDeviceName() == 'a8') {
            for (i in attribute_arr_a8) {
                this.orderInoMap.set(attribute_arr_a8[i], '');
            }
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo') {
            for (i in attribute_arr_elo) {
                this.orderInoMap.set(attribute_arr_elo[i], '');
            }
        }
    }
    static getInfoMap() {
        this.createInfoMap();
        return this.orderInoMap;
    }
}
exports.OrderInfoMap = OrderInfoMap;
OrderInfoMap.orderInoMap = new Map();
