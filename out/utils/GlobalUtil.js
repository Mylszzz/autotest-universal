"use strict";
// import {ReadUtils} from "./readUtils";
// import {SaleData} from "../entity/saleData";
// import {RefundData} from "../entity/refundData";
// import {Title} from "../entity/title";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalUtil = void 0;
const ReadUtils_1 = require("./ReadUtils");
class GlobalUtil {
    //初始化，获取配置信息
    static init() {
        ReadUtils_1.ReadUtils.readTest(this.map);
    }
}
exports.GlobalUtil = GlobalUtil;
GlobalUtil.saleOrderData = [];
GlobalUtil.refundData = [];
GlobalUtil.testData = [];
GlobalUtil.map = new Map();
