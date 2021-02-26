"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundAction = void 0;
const deviceName_1 = require("../../static/deviceName");
const refundUtils_1 = require("./refundUtils");
const logUtils_1 = require("../../utils/logUtils");
const refundData_1 = require("../../entity/refundData");
const screenShotUtil_1 = require("../../utils/screenShotUtil");
const search_1 = require("../search");
const refundOrder_1 = require("./refundOrder");
class RefundAction {
    /**
     * 构造方法
     * @param client
     */
    constructor(client) {
        this.refundDataMaps = []; //
        this.client = client;
        this.deviceName = deviceName_1.DeviceName.getDeviceName();
    }
    /**
     * 调用退货的执行脚本
     * 退货方法的主循环
     * @returns {Promise<void>}
     */
    async refundProcess() {
        //let search_a8 = new Search_a8(this.client);
        let search_elo = new search_1.Search_elo(this.client);
        let refundPreparation = new refundUtils_1.RefundPreparation();
        this.refundDataMaps = refundPreparation.getRefundDataMaps();
        let refundDataList = [];
        for (let i = 0; i < this.refundDataMaps.length; i++) {
            let refundOnce = new refundUtils_1.RefundOnce(this.refundDataMaps[i]); // 一次退货
            let orderNo = refundOnce.getOrderNo();
            if (refundOnce.getIsRefundable()) {
                logUtils_1.LogUtils.refundLog.info('===对订单:' + orderNo + '执行退货===');
                // 退款
                let beforeToday = refundOnce.getBeforeToday();
                let refundData = new refundData_1.RefundData();
                try {
                    let search_a8 = new search_1.Search_a8(this.client);
                    await search_a8.search();
                    await search_a8.searchNum(orderNo);
                    if (this.deviceName == 'a8') {
                        if (beforeToday) {
                            refundData.isSuccess = await refundOrder_1.RefundOrder_a8.refundBeforeOrder(this.client, orderNo);
                        }
                        else {
                            //进行今日订单退货，并判断是否成功
                            logUtils_1.LogUtils.refundLog.info("nn");
                            refundData.isSuccess = await refundOrder_1.RefundOrder_a8.refundOrderToday(this.client, orderNo);
                        }
                    }
                    else {
                        //       await search_elo.search();
                        if (beforeToday) {
                            //进行隔日订单退货，并判断是否成功
                            refundData.isSuccess = await refundOrder_1.RefundOrder_elo.refundBeforeOrder(this.client, orderNo);
                        }
                        else {
                            refundData.isSuccess = await refundOrder_1.RefundOrder_elo.refundOrderToday(this.client, orderNo);
                        }
                    }
                    if (refundData.isSuccess) {
                        refundOnce.setIsSuccess('Y');
                    }
                }
                catch (e) {
                    logUtils_1.LogUtils.log.info("===退货出错，执行截屏操作===");
                    await screenShotUtil_1.ScreenShotUtil.takeScreenShot(this.client, orderNo);
                }
                // //退货数据的赋值，用于输出退货测试数据
                // refundData.refundPrice = refundOnce.getPrice();
                // refundData.refundOrderNo = "'" + orderNo;
                // refundData.refundTime = new Date().toLocaleDateString();
                // refundDataList.push(refundData);
                // ExportCsv.printRefundData(CsvOptions.refundOptions, refundDataList, Tools.guid());
            }
        }
    }
}
exports.RefundAction = RefundAction;
