"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelReturns_ELO = exports.CancelReturns_A8 = exports.CancelReturns = void 0;
const screen_1 = require("./screen");
const search_1 = require("./search");
const OrderXpath_1 = require("../static/OrderXpath");
const commonXpath_1 = require("../static/commonXpath");
class CancelReturns {
    constructor(client, backBtnXPath) {
        this.backBtnXPath = OrderXpath_1.OrderXpath_a8.back; //
        this.client = client;
        if (backBtnXPath != undefined) { //
            this.backBtnXPath = backBtnXPath;
        }
    }
    async cancelReturns() {
        await new search_1.Search(this.client).search();
        const orderType = ['一般销售单'];
        const orderState = ['已完成', '已部分退'];
        await new screen_1.Screen(this.client).screenNo(new Date().toLocaleDateString(), orderType, orderState);
        await this.client.pause(3000);
        let close = await this.client.$(commonXpath_1.CommonXpath.close);
        await close.click();
        let sel = await this.client.$(commonXpath_1.CommonXpath.order);
        await sel.click();
        let returns = await this.client.$(commonXpath_1.CommonXpath.returns);
        await returns.click();
        let cancel = await this.client.$(commonXpath_1.CommonXpath.cancel);
        await cancel.click();
        let back = await this.client.$(this.backBtnXPath);
        await back.click();
    }
}
exports.CancelReturns = CancelReturns;
class CancelReturns_A8 extends CancelReturns {
}
exports.CancelReturns_A8 = CancelReturns_A8;
const backBtnXPath_ELO = OrderXpath_1.OrderXpath_elo.back;
class CancelReturns_ELO extends CancelReturns {
    constructor(client, backBtnXPath = backBtnXPath_ELO) {
        super(client, backBtnXPath);
    }
}
exports.CancelReturns_ELO = CancelReturns_ELO;
