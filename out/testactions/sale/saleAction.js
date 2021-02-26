"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleAction_Elo = exports.SaleAction_A8 = void 0;
const exceptions_1 = require("../../utils/exceptions");
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
const touchMethod_1 = require("../../utils/touchMethod");
const inputCoordinates_1 = require("../../static/inputCoordinates");
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
     * @returns {Promise<void>}
     */
    async saleAction() {
        logUtils_1.LogUtils.saleLog.info('****开始测试第【' + this.seqNum.toString() + '】单销售测试用例****');
        try {
            //  await VipLoginAction.vipLogin(this.client);
        }
        catch (e) {
            console.error(e);
            throw new exceptions_1.BasicException('A9999', '登录vip失败').toString();
        }
        finally {
            await this.saleActionStep2();
        }
    }
}
/**
 * A8
 */
class SaleAction_A8 extends SaleAction {
    constructor(saleData, client, csvGenerator) {
        super(saleData, client, csvGenerator);
    }
    async saleActionStep2() {
        try {
            let configMap = globalUtil_1.GlobalUtil.getConfigMap();
            let toSale = await this.client.$('//android.view.View[@content-desc="货号:' +
                configMap.get('storeNumber') + '"]');
            await toSale.click();
            await this.client.pause(1000);
            // 调用触摸方法输入价格
            let touchFun = touchMethod_1.TouchMethod.getTouchMethod();
            // A8输入价格时使用A8通用坐标Map
            await touchFun(this.client, this.price.toString(), inputCoordinates_1.InputCoordinates.getCoordMap());
            await this.client.pause(2000);
            //去结算
            let pay = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
            await pay.click();
            await this.client.pause(2000);
            //选择现金支付
            let cash = await this.client.$('//android.widget.Button[@content-desc="现金"]');
            await cash.click();
            await this.client.pause(1000);
            //确定
            let confirm2 = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await this.client.pause(1000);
            await confirm2.click();
            //打印订单
            await this.client.pause(10000);
            //完成
            let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
            await complete.click();
        }
        catch (e) {
        }
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
    generateCsv() {
        // this.csvGenerator.printCsv(, this.seqNum);
    }
}
exports.SaleAction_Elo = SaleAction_Elo;
