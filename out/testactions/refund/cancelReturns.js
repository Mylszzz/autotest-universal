"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelReturns_ELO = exports.CancelReturns_A8 = exports.CancelReturns = void 0;
const sift_1 = require("../basicActions/sift");
const searchAction_1 = require("../basicActions/searchAction");
const buttonXPaths_1 = require("../../static/buttonXPaths");
const commonXpath_1 = require("../../static/commonXpath");
const logUtils_1 = require("../../utils/logUtils");
/**
 * 取消退货
 */
class CancelReturns {
    constructor(client, backBtnXPath) {
        this.backBtnXPath = buttonXPaths_1.ButtonXPaths_A8.BACK; //
        this.client = client;
        if (backBtnXPath != undefined) { //
            this.backBtnXPath = backBtnXPath;
        }
    }
    /**
     * orderType:any ：选择订单类型
     * orderState:any ：选择订单状态
     */
    async cancelReturns() {
        logUtils_1.LogUtils.refundLog.info('执行取消退货');
        await new searchAction_1.SearchAction(this.client).search();
        const orderType = ['一般销售单'];
        const orderState = ['已完成', '已部分退'];
        await new sift_1.Sift(this.client).siftType(new Date().toLocaleDateString(), orderType, orderState);
        await this.client.pause(3000);
        let close = await this.client.$(commonXpath_1.CommonXpath.CLOSE);
        await close.click();
        let sel = await this.client.$(commonXpath_1.CommonXpath.ORDER);
        await sel.click();
        let returns = await this.client.$(commonXpath_1.CommonXpath.RETURNS);
        await returns.click();
        let cancel = await this.client.$(commonXpath_1.CommonXpath.CANCEL);
        await cancel.click();
        let back = await this.client.$(this.backBtnXPath);
        await back.click();
        logUtils_1.LogUtils.refundLog.info('取消退货完成');
    }
}
exports.CancelReturns = CancelReturns;
/**
 * a8 直接继承
 */
class CancelReturns_A8 extends CancelReturns {
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new CancelReturns_A8(client);
        }
        return this.instance;
    }
}
exports.CancelReturns_A8 = CancelReturns_A8;
/**
 * elo 需要更改xpath控件
 */
class CancelReturns_ELO extends CancelReturns {
    constructor(client, backBtnXPath = buttonXPaths_1.ButtonXPaths_Elo.BACK) {
        super(client, backBtnXPath);
    }
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new CancelReturns_ELO(client);
        }
        return this.instance;
    }
}
exports.CancelReturns_ELO = CancelReturns_ELO;
