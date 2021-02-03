"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalUtil = void 0;
const readUtils_1 = require("./readUtils");
class GlobalUtil {
    // 初始化，获取配置信息
    static init() {
        readUtils_1.ReadUtils.readTest(this.map);
    }
}
exports.GlobalUtil = GlobalUtil;
GlobalUtil.saleOrderData = [];
GlobalUtil.refundData = [];
GlobalUtil.testData = []; // 没用的可以删掉了
GlobalUtil.map = new Map();
