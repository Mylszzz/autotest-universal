"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search_elo = exports.Search_a8 = exports.Search = void 0;
const phoneNum_1 = require("../phoneNum");
const logUtils_1 = require("../../utils/logUtils");
const commonXpath_1 = require("../../static/commonXpath");
const buttonXPaths_1 = require("../../static/buttonXPaths");
const settings_1 = require("../../static/settings");
const deviceName_1 = require("../../static/deviceName");
/**
 * 查询操作的基类
 */
class Search {
    constructor(client, menuBtnXPath, searchBtnXPath) {
        this.menuBtnXPath = buttonXPaths_1.ButtonXPaths_A8.MENU; //
        this.searchBtnXPath = buttonXPaths_1.ButtonXPaths_A8.SEARCH;
        this.client = client;
        if (menuBtnXPath != undefined) { //
            this.menuBtnXPath = menuBtnXPath;
        }
        if (searchBtnXPath != undefined) {
            this.searchBtnXPath = searchBtnXPath;
        }
    }
    /**
     * 进入查询/退货页面
     */
    async search() {
        let menu = await this.client.$(this.menuBtnXPath);
        await menu.click();
        await this.client.pause(2000);
        //  点击查询
        let chooseBackGood = await this.client.$(this.searchBtnXPath);
        await chooseBackGood.click();
        // await this.client.pause(2000);
    }
    /**
     * 查询具体的订单
     * @param {string} num: 订单号
     * @returns {Promise<void>}
     */
    async searchNum(num) {
        //  查询订单号
        await this.client.pause(1000);
        let codeNoText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.widget.EditText');
        await codeNoText.click();
        await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
        if (deviceName_1.DeviceName.getDeviceName() == 'a8') {
            await phoneNum_1.PhoneNum.phoneNum(this.client, num); //A8不能直接赋值，会显示查找无此编号的订单
        }
        else {
            codeNoText.setValue(num); //ELO直接赋值，因为点击控件有bug，会卡住
        }
        await this.client.pause(1000);
        try {
            let ok = await this.client.$(commonXpath_1.CommonXpath.DETERMINE);
            await ok.click();
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            let codeNo = await this.client.$('//android.view.View[@content-desc=' + num + ']');
            await codeNo.click();
            await this.client.pause(1000);
            logUtils_1.LogUtils.search.info("=====" + num + "查询符合预期==");
            logUtils_1.LogUtils.search.info("=====查询结束====");
        }
        catch (e) {
            logUtils_1.LogUtils.search.info("=====" + num + "查询无结果==");
            logUtils_1.LogUtils.search.info("=====查询结束====");
        }
    }
    /**
     * 扫码查询订单
     */
    async searchOrder() {
        //手动扫码
        let qr = await this.client.$(commonXpath_1.CommonXpath.QR);
        await qr.click();
        await this.client.pause(10000);
        try {
            let theTopOrder = await this.client.$(commonXpath_1.CommonXpath.ORDER);
            await theTopOrder.click();
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            logUtils_1.LogUtils.search.info("=====查询符合预期==");
            logUtils_1.LogUtils.search.info("=====查询结束====");
        }
        catch (e) {
            logUtils_1.LogUtils.search.info("=====查询无结果==");
            logUtils_1.LogUtils.search.info("=====查询结束====");
        }
    }
}
exports.Search = Search;
/**
 * a8
 */
class Search_a8 extends Search {
}
exports.Search_a8 = Search_a8;
/**
 * elo
 */
class Search_elo extends Search {
    constructor(client, menuBtnXPath = buttonXPaths_1.ButtonXPaths_Elo.MENU, searchBtnXPath = buttonXPaths_1.ButtonXPaths_Elo.SEARCH) {
        super(client, menuBtnXPath, searchBtnXPath);
    }
}
exports.Search_elo = Search_elo;
