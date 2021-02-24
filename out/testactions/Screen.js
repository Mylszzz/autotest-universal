"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search_elo = exports.Screen_A8 = exports.Screen = void 0;
const search_1 = require("./search");
const dateUtil_1 = require("../utils/dateUtil");
const logUtils_1 = require("../utils/logUtils");
const buttonXPaths_1 = require("../static/buttonXPaths");
const commonXpath_1 = require("../static/commonXpath");
/**
* 选择筛选条件
*/
class Screen {
    constructor(client, funnelBtnXPath) {
        this.funnelBtnXPath = buttonXPaths_1.ButtonXPaths_A8.FUNNEL; //
        this.client = client;
        if (funnelBtnXPath != undefined) { //
            this.funnelBtnXPath = funnelBtnXPath;
        }
    }
    //筛选条件
    async screenNo(date, orderType, orderState) {
        await new search_1.Search(this.client).search();
        //点击筛选
        let ccBtn = await this.client.$(this.funnelBtnXPath);
        await ccBtn.click();
        //选择日期
        await dateUtil_1.DateUtil.selectDate(this.client, date);
        //选择条件
        // 清空默认的订单类型
        let chooseAll_1 = await this.client.$(commonXpath_1.CommonXpath.CHECKBOX1);
        await chooseAll_1.click();
        await chooseAll_1.click();
        // 清空默认的订单状态
        let chooseAll_2 = await this.client.$(commonXpath_1.CommonXpath.CHECKBOX2);
        await chooseAll_2.click();
        await chooseAll_2.click();
        // 点击选择订单类型
        for (let i = 0; i < orderType.length; i++) {
            let oneOfOrderType = await this.client.$('//android.widget.CheckBox[@content-desc="' + orderType[i] + '"]');
            await oneOfOrderType.click();
        }
        // 点击选择订单状态
        for (let i = 0; i < orderState.length; i++) {
            let oneOfOrderState = await this.client.$('//android.widget.CheckBox[@content-desc="' + orderState[i] + '"]');
            await oneOfOrderState.click();
        }
        //完成
        let ok = await this.client.$(commonXpath_1.CommonXpath.OK);
        await ok.click();
    }
    async refScreen() {
        await new search_1.Search(this.client).search();
        //点击筛选
        let ccBtn = await this.client.$(this.funnelBtnXPath);
        await ccBtn.click();
        //重置
        let ok = await this.client.$(commonXpath_1.CommonXpath.RESETTING);
        await ok.click();
        //重置后的条件判断，是否符合条件
        let generalSalesOrderCheck = await this.client.$('//android.widget.CheckBox[@content-desc="一般销售单"]');
        let isGeneralSalesOrderCheck = await generalSalesOrderCheck.getAttribute('checked');
        if (isGeneralSalesOrderCheck) {
            let completed = await this.client.$('//android.widget.CheckBox[@content-desc="已完成"]');
            let isCompleted = await completed.getAttribute('checked');
            if (isCompleted) {
                let complete = await this.client.$(commonXpath_1.CommonXpath.OK);
                await complete.click();
                logUtils_1.LogUtils.search.info("=====订单查询--》重置筛选条件符合预期==");
            }
            else {
                logUtils_1.LogUtils.search.info("=====订单查询--》重置筛选条件不符预期==");
            }
        }
        else {
            logUtils_1.LogUtils.search.info("=====订单查询--》重置筛选条件不符预期==");
        }
    }
}
exports.Screen = Screen;
class Screen_A8 extends Screen {
}
exports.Screen_A8 = Screen_A8;
class Search_elo extends search_1.Search {
    constructor(client, funnelBtnXPath = buttonXPaths_1.ButtonXPaths_Elo.FUNNEL) {
        super(client, funnelBtnXPath);
    }
}
exports.Search_elo = Search_elo;
