"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayMethods_Elo = exports.PayMethods_A8 = void 0;
const logUtils_1 = require("../../utils/logUtils");
/**
 * 获得支持的支付方式的名字
 * 单例模式
 */
class PayMethods_A8 {
    constructor() {
        this.payMethodsList = [];
    }
    /**
     *
     * @param client
     * @returns {Promise<string[]>}
     */
    static async getSupportedPayMethods(client) {
        if (null == this.instance) {
            this.instance = new PayMethods_A8();
        }
        try {
            if (this.instance.payMethodsList.length == 0) {
                await this.instance.processPayMethods(client);
            }
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
        }
        return this.instance.payMethodsList;
    }
    /**
     * 获得支持的支付方式的名字
     * @param client
     */
    async processPayMethods(client) {
        let num = 0;
        let tabName = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=1]');
        let firstName = await tabName.getAttribute('content-desc');
        let name = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=last()]');
        let lastName = await name.getAttribute('content-desc');
        while (firstName !== lastName) {
            num++;
            let tabName = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=' + num + ']');
            firstName = await tabName.getAttribute("content-desc");
            this.payMethodsList.push(firstName);
        }
    }
}
exports.PayMethods_A8 = PayMethods_A8;
class PayMethods_Elo {
    constructor() {
        this.payMethodsList = [];
    }
    /**
     *
     * @param client
     * @returns {Promise<string[]>}
     */
    static async getSupportedPayMethods(client) {
        if (null == this.instance) {
            this.instance = new PayMethods_Elo();
        }
        try {
            if (this.instance.payMethodsList.length == 0) {
                await this.instance.processPayMethods(client);
            }
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
        }
        return this.instance.payMethodsList;
    }
    /**
     * 获得支持的支付方式的名字
     * @param client
     */
    async processPayMethods(client) {
    }
}
exports.PayMethods_Elo = PayMethods_Elo;
