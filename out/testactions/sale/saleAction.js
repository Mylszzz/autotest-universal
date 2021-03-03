"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleAction_Elo = exports.SaleAction_A8 = void 0;
const deviceActions_1 = require("../deviceActions");
const exceptions_1 = require("../../utils/exceptions");
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
const touchMethod_1 = require("../../utils/touchMethod");
const inputCoordinates_1 = require("../../static/inputCoordinates");
const payMethods_1 = require("./payMethods");
const MAX_SCROLL_TIMES_A8 = 1; // TODO: Make it global
const PAYMETHODS_COUNT_PER_PAGE = 6;
/**
 * 销售脚本的抽象类，用于单条销售测试用例的脚本执行
 * 添加新设备是继承此类

 * 实现了ISaleData接口，用于规范单次销售需要的数据
 */
class SaleAction {
    constructor(saleData, client, csvGenerator) {
        this.supportedPayMethods = [];
        this.saleTime = 'unknown';
        this.saleOrderNo = 'unknown';
        this.priceForCsv = 'unknown';
        this.client = client;
        this.seqNum = saleData.seqNum;
        this.paymentInfoMap = saleData.paymentInfoMap;
        this.saleOptionsInfoMap = saleData.saleOptionsInfoMap;
        this.price = saleData.price;
        this.priceForCsv = saleData.price.toString();
        this.csvGenerator = csvGenerator;
    }
    /**
     * 销售脚本,先登录vip
     * 无论成功与否应调用后面的销售脚本 saleActionStep2()
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
            logUtils_1.LogUtils.saleLog.info("********开始执行支付脚本********");
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
            this.supportedPayMethods = await payMethods_1.PayMethods_A8.getSupportedPayMethods(this.client);
            await this.payMethodLoop();
            // 打印订单
            await this.client.pause(8000);
            let confirm2 = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm2.click();
            // 打印订单
            await this.client.pause(8000);
            //获取订单号
            let orderNoText = await this.client.$('//android.view.View[@content-desc="订单号"]/following-sibling::android.view.View');
            this.saleOrderNo = await orderNoText.getAttribute('content-desc');
            //完成
            let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
            await complete.click();
            this.saleTime = new Date().toLocaleDateString();
            /*
            销售完成，打印csv
             */
            logUtils_1.LogUtils.saleLog.info('******销售完成，打印输出到csv文件******');
            logUtils_1.LogUtils.saleLog.info('**********************************');
            this.generateCsv();
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
        // [支付方式名字, 金额]
        for (let [key, value] of this.paymentInfoMap) {
            let index = this.supportedPayMethods.indexOf(key); // 需要使用的支付方式在支付列表的第几个
            let payMethodBtn;
            let scroll_times = 0;
            try {
                if (index == -1) {
                    throw new exceptions_1.AutoTestException('A9999', '该支付方式不存在');
                }
                else if (index + 1 <= PAYMETHODS_COUNT_PER_PAGE) {
                    payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' + key + '"]');
                }
                else {
                    scroll_times = Math.floor((index + 1) / PAYMETHODS_COUNT_PER_PAGE);
                    await this.scrollDown(scroll_times);
                    payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' +
                        this.supportedPayMethods[(index % PAYMETHODS_COUNT_PER_PAGE)] + '"]');
                }
                logUtils_1.LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");
                await this.clickOnPayMethod(payMethodBtn, value);
                await this.client.pause(1000);
                await this.scrollUp(scroll_times); // 滑回去
            }
            catch (e) {
                logUtils_1.LogUtils.saleLog.error(e.toString());
            }
        }
    }
    /**
     * 点击支付方式, 若支付方式不在当前页则调用滑动方法找到该支付方式
     * @param payMethodBtn: 该支付方式按键的实例
     * @param {string} amount: 该支付方式的金额
     * @returns {Promise<void>}
     */
    async clickOnPayMethod(payMethodBtn, amount) {
        try {
            await payMethodBtn.click();
            await this.client.pause(1000);
            /*
            如果可以点击确定键，则需要输入金额并点击
             */
            let touchMethod = touchMethod_1.TouchMethod.getTouchMethod();
            await touchMethod(this.client, amount, inputCoordinates_1.InputCoordinates.getCoordMap());
            await this.clickOnConfirm();
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            logUtils_1.LogUtils.saleLog.warn('支付失败');
        }
    }
    /**
     * 向下滑动
     * @returns {Promise<void>}
     */
    async scrollDown(times) {
        for (let i = 0; i < times; i++) {
            await this.client.touchAction([
                { action: 'press', x: 354, y: 900 },
                { action: 'moveTo', x: 354, y: 687 },
                { action: 'release' }
            ]);
            await this.client.touchAction([
                { action: 'press', x: 354, y: 900 },
                { action: 'moveTo', x: 354, y: 687 },
                { action: 'release' }
            ]);
            await this.client.pause(500);
        }
    }
    /**
     * 向上滑动
     * @returns {Promise<void>}
     */
    async scrollUp(times) {
        for (let i = 0; i < times; i++) {
            await this.client.touchAction([
                { action: 'press', x: 354, y: 687 },
                { action: 'moveTo', x: 354, y: 900 },
                { action: 'release' }
            ]);
            await this.client.touchAction([
                { action: 'press', x: 354, y: 687 },
                { action: 'moveTo', x: 354, y: 900 },
                { action: 'release' }
            ]);
            await this.client.pause(500);
        }
    }
    generateCsv() {
        let saleDate = {
            saleTime: this.saleTime,
            saleOrderNo: this.saleOrderNo,
            priceForCsv: this.priceForCsv
        };
        this.csvGenerator.printCsv(saleDate, this.seqNum);
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
        let sale = await this.client.$('//android.widget.Button[@content-desc="去销售"]');
        await sale.click();
        this.client.pause(1000);
        //缓冲
        await this.client.$('//android.widget.Button[@content-desc="search"]');
        this.client.pause(1000);
        // 调用触摸方法输入价格
        let touchFun = touchMethod_1.TouchMethod.getTouchMethod();
        // Elo输入价格时使用Elo通用坐标Map
        await touchFun(this.client, this.price.toString(), inputCoordinates_1.InputCoordinates.getCoordMap());
        await this.clickOnConfirm();
        //去结算
        let settlement = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
        await settlement.click();
        this.supportedPayMethods = await payMethods_1.PayMethods_Elo.getSupportedPayMethods(this.client);
        await this.payMethodLoop();
        // 打印订单
    }
    /**
     * 所有支付方式的循环
     * @returns {Promise<void>}
     */
    async payMethodLoop() {
    }
    async clickOnPayMethod(payMethodBtn, scrollTimes, amount) {
    }
    /**
     * 向下滑动
     * @returns {Promise<void>}
     */
    async scrollDown() {
        logUtils_1.LogUtils.saleLog.info('向下滑动一次！');
    }
    generateCsv() {
        let saleDate = {
            saleTime: this.saleTime,
            saleOrderNo: this.saleOrderNo,
            priceForCsv: this.priceForCsv
        };
        this.csvGenerator.printCsv(saleDate, this.seqNum);
    }
}
exports.SaleAction_Elo = SaleAction_Elo;
