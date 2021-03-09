"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleAction_Elo = exports.SaleAction_A8 = void 0;
const deviceActions_1 = require("../deviceActions");
const exceptions_1 = require("../../utils/exceptions");
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
const touchMethod_1 = require("../../utils/touchMethod");
const inputCoordinates_1 = require("../../static/inputCoordinates");
const settings_1 = require("../../static/settings");
const settings_2 = require("../../static/settings");
const validateOrderInfo_1 = require("../orderInfo/validateOrderInfo");
const PAYMETHODS_COUNT_PER_PAGE = 6;
/**
 * 销售脚本的抽象类，用于单条销售测试用例的脚本执行
 * 添加新设备请继承此类
 * 实现了ISaleData接口，用于规范单次销售需要的数据
 * 实现了ISaleForCsv接口，用于输出csv文件需要的数据
 */
class SaleAction {
    constructor(saleData, client, csvGenerator) {
        this.supportedPayMethods = []; // 该机器支持的支付方式的合集
        this.cancelable = false; // 是否取消交易
        this.saleTime = 'unknown';
        this.saleOrderNo = 'unknown';
        this.priceForCsv = 'unknown';
        this.refundable = false; // 是否需要退货
        this.orderNoForRefund = 'unknown'; // 订单号
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
            if (settings_1.generalSettings.enableVipLoginModule) {
                await deviceActions_1.VipLoginAction.vipLogin(this.client);
            }
        }
        catch (e) {
            let err = new exceptions_1.AutoTestException('L0002', '登录vip失败');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
        }
        finally {
            await this.saleMainScript();
        }
    }
    /**
     * 点击“确定”按键并等待响应
     * @returns {Promise<void>}
     */
    async clickOnConfirm() {
        let confirm = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await confirm.click();
        await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
    }
    /**
     * 记录销售信息到csv文档
     */
    generateCsv() {
        let saleDate = {
            saleTime: this.saleTime,
            saleOrderNo: this.saleOrderNo,
            priceForCsv: this.priceForCsv
        };
        this.csvGenerator.printCsv(saleDate, this.seqNum);
    }
    /**
     * 判断是否需要退货，并更新到成员变量: isRefundable
     */
    processIsRefundable() {
        try {
            // @ts-ignore
            this.refundable = (this.saleOptionsInfoMap.get('退货').toUpperCase() == 'Y' && (this.saleOptionsInfoMap.get('取消交易').toUpperCase() == 'N'));
        }
        catch (e) {
            let err = new exceptions_1.SaleException('S0004', '测试用例输入退货/取消交易字段有误');
            logUtils_1.LogUtils.saleLog.error(err.toString()); // 按照无需退款且无需退货处理，无需其他额外操作
        }
    }
    /**
     * 判断是否需要取消交易，并更新到成员变量: isCancelable
     */
    processIsCancelable() {
        try {
            // @ts-ignore
            this.cancelable = (this.saleOptionsInfoMap.get('取消交易').toUpperCase() == 'Y');
        }
        catch (e) {
            let err = new exceptions_1.SaleException('S0004', '测试用例输入退货/取消交易字段有误');
            logUtils_1.LogUtils.saleLog.error(err.toString()); // 按照无需退款且无需退货处理
        }
    }
    /**
     * 从POS机界面中获取订单号，保存在成员变量saleOrderNo和orderNoForRefund中
     * 二者是相同变量，来自不同数据接口
     * @returns {Promise<void>}
     */
    async obtainOrderNo() {
        let orderNoText = await this.client.$('//android.view.View[@content-desc="订单号"]/following-sibling::android.view.View');
        this.saleOrderNo = await orderNoText.getAttribute('content-desc');
        this.orderNoForRefund = this.saleOrderNo;
    }
    getRefundable() {
        return this.refundable;
    }
    getOrderNo() {
        return this.orderNoForRefund;
    }
}
/**
 * A8
 */
class SaleAction_A8 extends SaleAction {
    constructor(saleData, client, csvGenerator) {
        super(saleData, client, csvGenerator);
        this.processIsRefundable(); // 判断是否需要退货
        this.processIsCancelable(); // 判断是否需要取消
    }
    /**
     * 登录VIP后开始执行销售流程脚本
     * @returns {Promise<void>}
     */
    async saleMainScript() {
        try {
            logUtils_1.LogUtils.saleLog.info("***********开始执行支付脚本***********");
            let configMap = globalUtil_1.GlobalUtil.getConfigMap();
            let toSale = await this.client.$('//android.view.View[@content-desc="货号:' +
                configMap.get('storeNumber') + '"]');
            await toSale.click();
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            /*
            调用触摸方法输入价格A8输入价格时使用A8通用坐标Map
             */
            let touchFun = touchMethod_1.TouchMethod.getTouchMethod();
            await touchFun(this.client, this.price.toString(), inputCoordinates_1.InputCoordinates.getCoordMap());
            await this.clickOnConfirm();
            //去结算
            let pay = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
            await pay.click();
            await this.client.pause(2000);
            //获取订单号
            await this.obtainOrderNo();
            // 获取支持的支付方式到supportedPayMethods
            await this.processPayMethods();
            let paymentSeq = 1;
            // [支付方式名字, 金额]
            for (let [key, value] of this.paymentInfoMap) {
                await this.payMethodLoop(key, value, paymentSeq == this.paymentInfoMap.size);
                if (this.cancelable) {
                    break;
                }
                paymentSeq++;
            }
            this.saleTime = new Date().toLocaleDateString();
            /*
            销售完成，打印csv
             */
            logUtils_1.LogUtils.saleLog.info('******销售完成，打印输出到csv文件******');
            this.generateCsv();
            await this.client.pause(2000);
            logUtils_1.LogUtils.saleLog.info('**********************************');
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e);
            let err = new exceptions_1.SaleException('S0005', '销售主脚本异常！');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
        }
    }
    /**
     * 所有使用了的支付方式的循环
     * 需要判断支付方式是否在当前页面上
     * @returns {Promise<void>}
     */
    async payMethodLoop(key, value, isLast) {
        let index = this.supportedPayMethods.indexOf(key); // 需要使用的支付方式在支付列表的第几个
        let payMethodBtn;
        let scroll_times = 0;
        try {
            if (index == -1) {
                throw new exceptions_1.SaleException('S0003', '该支付方式不存在');
            }
            else if (index + 1 <= PAYMETHODS_COUNT_PER_PAGE) {
                payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' + key + '"]');
            }
            else {
                scroll_times = Math.floor(index / PAYMETHODS_COUNT_PER_PAGE);
                await this.scrollDown(scroll_times);
                payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' +
                    this.supportedPayMethods[(index % PAYMETHODS_COUNT_PER_PAGE)] + '"]');
            }
            logUtils_1.LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");
            await this.clickOnPayMethod(payMethodBtn, value);
            /*
            可以处理扫码支付
             */
            await this.client.$('//android.view.View[@content-desc="订单号"]');
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            await this.scrollUp(scroll_times); // 滑回去
            // TODO: 只做了在第一种支付方式完成后取消
            if (this.cancelable) {
                await this.cancelSale();
            }
            else if (isLast) {
                /*
                最后一单应该打印销售信息csv
                 */
                logUtils_1.LogUtils.saleLog.info('*******打印POS机显示的销售信息********');
                await validateOrderInfo_1.ValidateOrderInfo.saveOrderInfoToCsv(this.client);
                logUtils_1.LogUtils.saleLog.info('********打印POS机销售信息完成*********');
                await this.client.pause(settings_2.runTimeSettings.longPauseTime); // 打印订单
                await this.clickOnConfirm();
                await this.client.pause(settings_2.runTimeSettings.longPauseTime); // 打印订单
                //完成
                let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
                await complete.click();
            }
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            let err = new exceptions_1.SaleException('S0007', '销售方式循环异常！');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
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
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            /*
            如果可以点击确定键，则需要输入金额并点击
             */
            let touchMethod = touchMethod_1.TouchMethod.getTouchMethod();
            await touchMethod(this.client, amount, inputCoordinates_1.InputCoordinates.getCoordMap());
            await this.clickOnConfirm();
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            let err = new exceptions_1.SaleException('S0003', '使用当前支付方式失败');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
        }
    }
    /**
     * 获得支持的支付方式的名字
     */
    async processPayMethods() {
        let num = 0;
        let tabName = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=1]');
        let firstName = await tabName.getAttribute('content-desc');
        let name = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=last()]');
        let lastName = await name.getAttribute('content-desc');
        while (firstName !== lastName) {
            num++;
            let tabName = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=' + num + ']');
            firstName = await tabName.getAttribute("content-desc");
            this.supportedPayMethods.push(firstName);
        }
    }
    /**
     * 向下滑动
     * TODO: 坐标要保存在静态库中
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
            await this.client.pause(settings_2.runTimeSettings.shortPauseTime);
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
            await this.client.pause(settings_2.runTimeSettings.shortPauseTime);
        }
    }
    /**
     * 取消交易的脚本
     * @returns {Promise<void>}
     */
    async cancelSale() {
        try {
            let cancel = await this.client.$('//android.widget.Button[@content-desc="取消交易"]');
            await cancel.click();
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            let confirm = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm.click();
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            let confirm2 = await this.client.$('//android.widget.Button[@content-desc="确认"]');
            await confirm2.click();
            await this.client.pause(settings_2.runTimeSettings.longPauseTime);
            logUtils_1.LogUtils.saleLog.info('**************已取消交易**************');
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            let err = new exceptions_1.SaleException('S0006', '取消交易失败');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
        }
    }
}
exports.SaleAction_A8 = SaleAction_A8;
/**
 * Elo
 */
class SaleAction_Elo extends SaleAction {
    constructor(saleData, client, csvGenerator) {
        super(saleData, client, csvGenerator);
        this.processIsRefundable(); // 判断是否需要退货
        this.processIsCancelable(); // 判断是否需要取消
    }
    /**
     * 登录VIP后开始执行销售流程脚本
     * @returns {Promise<void>}
     */
    async saleMainScript() {
        try {
            logUtils_1.LogUtils.saleLog.info("***********开始执行支付脚本***********");
            let sale = await this.client.$('//android.widget.Button[@content-desc="去销售"]');
            await sale.click();
            // await this.client.pause(runTimeSettings.generalPauseTime);
            // 缓冲
            await this.client.$('//android.widget.Button[@content-desc="search"]');
            /*
            调用触摸方法输入价格,Elo输入价格时使用Elo通用坐标Map
             */
            let touchFun = touchMethod_1.TouchMethod.getTouchMethod();
            await touchFun(this.client, this.price.toString(), inputCoordinates_1.InputCoordinates.getCoordMap());
            // 确定
            await this.clickOnConfirm();
            // 去结算
            let settlement = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
            await settlement.click();
            // 获取支持的支付方式到supportedPayMethods
            await this.processPayMethods();
            let paymentSeq = 1;
            // [支付方式名字, 金额]
            for (let [key, value] of this.paymentInfoMap) {
                await this.payMethodLoop(key, value, paymentSeq == this.paymentInfoMap.size);
                if (this.cancelable) {
                    break;
                }
                paymentSeq++;
            }
            this.saleTime = new Date().toLocaleDateString();
            /*
            销售完成，打印csv
             */
            logUtils_1.LogUtils.saleLog.info('******销售完成，打印输出到csv文件******');
            this.generateCsv();
            logUtils_1.LogUtils.saleLog.info('**********************************');
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            let err = new exceptions_1.SaleException('S0005', '销售主脚本异常！');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
        }
    }
    /**
     * 所有使用了的支付方式的循环
     * 需要判断支付方式是否在当前页面上
     * @returns {Promise<void>}
     */
    async payMethodLoop(key, value, isLast) {
        let index = this.supportedPayMethods.indexOf(key); // 需要使用的支付方式在支付列表的第几个
        let payMethodBtn;
        let scroll_times = 0;
        let editTextTempList = await this.client.$$('//android.view.View[@resource-id="scrollMe2"]/android.widget.EditText');
        try {
            if (index == -1) {
                throw new exceptions_1.AutoTestException('A9999', '该支付方式不存在');
            }
            else if (index + 1 <= PAYMETHODS_COUNT_PER_PAGE) {
                payMethodBtn = editTextTempList[index];
            }
            else {
                scroll_times = Math.floor(index / PAYMETHODS_COUNT_PER_PAGE);
                await this.scrollDown(scroll_times);
                payMethodBtn = editTextTempList[index]; //% PAYMETHODS_COUNT_PER_PAGE
            }
            logUtils_1.LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");
            let editText0 = editTextTempList[0];
            await editText0.click();
            await this.client.pause(2000);
            await this.clickOnPayMethod(payMethodBtn, value);
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            await this.scrollUp(scroll_times); // 滑回去
            if (this.cancelable) {
                await this.cancelSale();
            }
            else if (isLast) {
                /*
                最后一单应该打印销售信息csv TODO
                 */
                // LogUtils.saleLog.info('*******打印POS机显示的销售信息********');
                // await ValidateOrderInfo.saveOrderInfoToCsv(this.client);
                // LogUtils.saleLog.info('********打印POS机销售信息完成*********');
                // 获取订单号
                await this.obtainOrderNo();
                // 打印订单
                try {
                    let printing = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.app.Dialog/android.view.View[1]/android.widget.Image[12]');
                    let isDisplayed = true;
                    while (isDisplayed) {
                        isDisplayed = await this.client.isElementDisplayed(printing.elementId);
                    }
                }
                catch (e) {
                }
                //完成
                let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
                await complete.click();
            }
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            let err = new exceptions_1.SaleException('S0007', '销售方式循环异常！');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
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
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            /*
            如果可以点击确定键，则需要输入金额并点击
             */
            let touchMethod = touchMethod_1.TouchMethod.getTouchMethod();
            await touchMethod(this.client, amount, inputCoordinates_1.InputCoordinates.getCoordMap());
            await this.clickOnConfirm();
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            let err = new exceptions_1.SaleException('S0003', '使用当前支付方式异常');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
        }
    }
    async processPayMethods() {
        let tempViewList = await this.client.$$('//android.view.View[@resource-id="scrollMe2"]/android.view.View');
        for (let i = 0; i < tempViewList.length; i++) {
            this.supportedPayMethods.push(await tempViewList[i].getAttribute('content-desc'));
        }
    }
    /**
     * 向下滑动
     * TODO: 坐标要保存在静态库中
     * @returns {Promise<void>}
     */
    async scrollDown(times) {
        for (let i = 0; i < times; i++) {
            let downArrow = await this.client.$('//android.widget.Button[@content-desc="arrow dropdown"]');
            await downArrow.click();
            await this.client.pause(1000);
        }
    }
    /**
     * 向上滑动
     * @returns {Promise<void>}
     */
    async scrollUp(times) {
        for (let i = 0; i < times; i++) {
            let downUp = await this.client.$('//android.widget.Button[@content-desc="arrow dropup"]');
            await downUp.click();
            await this.client.pause(1000);
        }
    }
    /**
     * 取消交易的脚本
     * @returns {Promise<void>}
     */
    async cancelSale() {
        try {
            let cancel = await this.client.$('//android.widget.Button[@content-desc="取消交易"]');
            await cancel.click();
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            let confirm = await this.client.$('(//android.widget.Button[@content-desc="确定"])[2]');
            await confirm.click();
            await this.client.pause(settings_2.runTimeSettings.generalPauseTime);
            let confirm2 = await this.client.$('//android.widget.Button[@content-desc="确认"]');
            await confirm2.click();
            await this.client.pause(settings_2.runTimeSettings.longPauseTime);
            await confirm.click();
            logUtils_1.LogUtils.saleLog.info('**************已取消交易**************');
        }
        catch (e) {
            logUtils_1.LogUtils.saleLog.error(e.toString());
            let err = new exceptions_1.SaleException('S0006', '取消交易失败');
            logUtils_1.LogUtils.saleLog.error(err.toString());
            throw err;
        }
    }
}
exports.SaleAction_Elo = SaleAction_Elo;
