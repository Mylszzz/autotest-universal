"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleAction_Elo = exports.SaleAction_A8 = void 0;
const deviceActions_1 = require("../deviceActions");
const exceptions_1 = require("../../utils/exceptions");
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
const touchMethod_1 = require("../../utils/touchMethod");
const inputCoordinates_1 = require("../../static/inputCoordinates");
const MAX_SCROLL_TIMES_A8 = 1; // TODO: Make it global
class SaleAction {
    constructor(saleData, client, csvGenerator) {
        this.client = client;
        this.seqNum = saleData.seqNum;
        this.paymentInfoMap = saleData.paymentInfoMap;
        this.saleOptionsInfoMap = saleData.saleOptionsInfoMap;
        this.price = saleData.price;
        this.csvGenerator = csvGenerator;
    }
    /**
     * 销售脚本,先登录vip
     * 无论成功与否应调用后面的销售脚本
     * TODO：如果号码未注册
     * @returns {Promise<void>}
     */
    async saleAction() {
        try {
            await deviceActions_1.VipLoginAction.vipLogin(this.client);
        }
        catch (e) {
            console.error(e);
            throw new exceptions_1.AutoTestException('A9999', '登录vip失败').toString();
        }
        finally {
            await this.saleActionStep2();
        }
    }
    /**
     * 点击“确定”按键并等待响应
     * @returns {Promise<void>}
     */
    async clickOnConfirm() {
        let confirm = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await confirm.click();
        await this.client.pause(1000);
    }
}
/**
 * A8
 */
class SaleAction_A8 extends SaleAction {
    constructor(saleData, client, csvGenerator) {
        super(saleData, client, csvGenerator);
    }
    /**
     * 登录VIP后开始执行销售流程脚本
     * @returns {Promise<void>}
     */
    async saleActionStep2() {
        try {
            logUtils_1.LogUtils.saleLog.info("******开始执行脚本******");
            let configMap = globalUtil_1.GlobalUtil.getConfigMap();
            let toSale = await this.client.$('//android.view.View[@content-desc="货号:' +
                configMap.get('storeNumber') + '"]');
            await toSale.click();
            await this.client.pause(1000);
            // 调用触摸方法输入价格
            let touchFun = touchMethod_1.TouchMethod.getTouchMethod();
            // A8输入价格时使用A8通用坐标Map
            await touchFun(this.client, this.price.toString(), inputCoordinates_1.InputCoordinates.getCoordMap());
            await this.clickOnConfirm();
            //去结算
            let pay = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
            await pay.click();
            await this.client.pause(2000);
            await this.payMethodLoop();
            // 打印订单
            await this.client.pause(8000);
            let confirm2 = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm2.click();
            // 打印订单
            await this.client.pause(8000);
            //完成
            let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
            await complete.click();
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e); // TODO
        }
    }
    /**
     * 所有支付方式的循环
     * @returns {Promise<void>}
     */
    async payMethodLoop() {
        let scrollTimes = 0; // 已经滑动的次数
        // [支付方式名字, 金额]
        for (let [key, value] of this.paymentInfoMap) {
            let payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' + key + '"]');
            logUtils_1.LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");
            await this.clickOnPayMethod(payMethodBtn, scrollTimes, value);
            await this.client.pause(1000);
            scrollTimes = 0;
        }
    }
    /**
     * 点击支付方式, 若支付方式不在当前页则调用滑动方法找到该支付方式
     * @param payMethodBtn: 该支付方式按键的实例
     * @param {number} scrollTimes: 当前已经滑动的次数
     * @param {string} amount: 该支付方式的金额
     * @returns {Promise<void>}
     */
    async clickOnPayMethod(payMethodBtn, scrollTimes, amount) {
        try {
            await payMethodBtn.click();
            await this.client.pause(1000);
            /*
            如果可以点击确定键，则需要输入金额并点击
             */
            if (await this.payMethodDisplayed()) {
                let touchMethod = touchMethod_1.TouchMethod.getTouchMethod();
                await touchMethod(this.client, amount, inputCoordinates_1.InputCoordinates.getCoordMap());
                await this.clickOnConfirm();
            }
            else if (scrollTimes < MAX_SCROLL_TIMES_A8) {
                logUtils_1.LogUtils.saleLog.info('支付方式不在本页');
                await this.scrollDown();
                scrollTimes++;
                await this.clickOnPayMethod(payMethodBtn, scrollTimes, amount);
            }
            else {
                throw new exceptions_1.AutoTestException('A9999'); // TODO
            }
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            logUtils_1.LogUtils.saleLog.warn('未找到支付方式');
        }
    }
    /**
     * 通过判断点击后是否出现'确定'按钮
     * 判断该支付方式是否在页面上显示
     * @returns {boolean}
     */
    async payMethodDisplayed() {
        this.client.setImplicitTimeout(500);
        let confirmBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        let isDisplayed = await confirmBtn.isDisplayed();
        this.client.setImplicitTimeout(10000);
        return isDisplayed;
    }
    /**
     * 向下滑动
     * @returns {Promise<void>}
     */
    async scrollDown() {
        logUtils_1.LogUtils.saleLog.info('向下滑动一次！');
        await this.client.touchAction([
            { action: 'press', x: 354, y: 900 },
            { action: 'moveTo', x: 354, y: 572 },
            { action: 'release' }
        ]);
        //await this.client.swipe(354, 900, 354, 572, 1000);
        await this.client.pause(1000);
    }
    generateCsv() {
        // this.csvGenerator.printCsv(, this.seqNum);
    }
}
exports.SaleAction_A8 = SaleAction_A8;
/**
 * Elo
 */
class SaleAction_Elo extends SaleAction {
    constructor(saleData, client, csvGenerator) {
        super(saleData, client, csvGenerator);
    }
    async saleActionStep2() {
    }
    /**
     * 所有支付方式的循环
     * @returns {Promise<void>}
     */
    async payMethodLoop() {
        let scrollTimes = 0; // 已经滑动的次数
        // [支付方式名字, 金额]
        for (let [key, value] of this.paymentInfoMap) {
            let payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' + key + '"]');
            logUtils_1.LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");
            await this.clickOnPayMethod(payMethodBtn, scrollTimes, value);
            await this.client.pause(1000);
            scrollTimes = 0;
        }
    }
    async clickOnPayMethod(payMethodBtn, scrollTimes, amount) {
        try {
            await payMethodBtn.click();
            await this.client.pause(1000);
            /*
            如果可以点击确定键，则需要输入金额并点击
             */
            if (await this.payMethodDisplayed()) {
                let touchMethod = touchMethod_1.TouchMethod.getTouchMethod();
                await touchMethod(this.client, amount, inputCoordinates_1.InputCoordinates.getCoordMap());
                await this.clickOnConfirm();
            }
            else if (scrollTimes < MAX_SCROLL_TIMES_A8) {
                logUtils_1.LogUtils.saleLog.info('支付方式不在本页');
                await this.scrollDown();
                scrollTimes++;
                await this.clickOnPayMethod(payMethodBtn, scrollTimes, amount);
            }
            else {
                throw new exceptions_1.AutoTestException('A9999'); // TODO
            }
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            logUtils_1.LogUtils.saleLog.warn('未找到支付方式');
        }
    }
    /**
     * 通过判断点击后是否出现'确定'按钮
     * 判断该支付方式是否在页面上显示
     * @returns {boolean}
     */
    async payMethodDisplayed() {
        this.client.setImplicitTimeout(500);
        let confirmBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        let isDisplayed = await confirmBtn.isDisplayed();
        this.client.setImplicitTimeout(10000);
        return isDisplayed;
    }
    /**
     * 向下滑动
     * @returns {Promise<void>}
     */
    async scrollDown() {
        logUtils_1.LogUtils.saleLog.info('向下滑动一次！');
    }
    generateCsv() {
        // this.csvGenerator.printCsv(, this.seqNum);
    }
}
exports.SaleAction_Elo = SaleAction_Elo;
