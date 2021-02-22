"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refund = void 0;
const readUtils_1 = require("../utils/readUtils");
const logUtils_1 = require("../utils/logUtils");
const refundOrder_1 = require("./refundOrder");
const refundData_1 = require("../entity/refundData");
const exportCsv_1 = require("../utils/exportCsv");
const screenShotUtil_1 = require("../utils/screenShotUtil");
const tools_1 = require("../utils/tools");
const search_1 = require("./search");
const deviceName_1 = require("../static/deviceName");
const deviceName = deviceName_1.DeviceName.getDeviceName();
class Refund {
    static async Refund(client) {
        let filename = tools_1.Tools.guid();
        //读取售卖记录
        let s = readUtils_1.ReadUtils.readForRefund();
        //console.log(s);
        let strings = s.split('\r\n');
        //获取第一行的标题
        let title = strings[0];
        //console.log(title);
        let titleList = title.split(','); //标题分类为各自一列
        // 遍历每一行数据，获取标题对应的值
        for (let i = 1; i < strings.length; i++) {
            let datas = strings[i];
            let data = datas.split(',');
            let orderNo = '';
            let money = "";
            let pays = null;
            let isRefund = false;
            let cancelDeal = false;
            let isbefore = false;
            let options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                useTextFile: false,
                useBom: true,
                useKeysAsHeaders: false
            };
            if (datas != "") {
                let refundDatas = [];
                for (let j = 0; j < titleList.length; j++) {
                    //console.log(titleList[j] + '===>' + data[j]);
                    //进行退货操作
                    //打印每一行的测试数据
                    logUtils_1.LogUtils.log.info(titleList[j] + '===>' + data[j]);
                    if (titleList[j].includes('saleTime')) {
                        //判断测试数据日期是否不等于当前日期
                        data[j] = data[j].replace("/", "").replace("/", "");
                        let date = new Date().toLocaleDateString().replace("-", "").replace("-", "");
                        if (Number.parseInt(data[j]) != Number.parseInt(date)) {
                            logUtils_1.LogUtils.log.info(data[j], date);
                            isbefore = true;
                        }
                    }
                    //每一组具体数据
                    if (titleList[j].includes('orderNo')) {
                        orderNo = data[j].replace("\"\'", "").replace("\"", "").replace("'", "");
                    }
                    if (titleList[j].includes('price')) {
                        money = data[j];
                    }
                    if (titleList[j].includes('payMethods')) {
                        pays = data[j];
                    }
                    if (titleList[j].includes('退货')) {
                        if (data[j] == 'Y' || data[j] == 'y') {
                            isRefund = true;
                        }
                    }
                    if (titleList[j].includes('取消交易')) {
                        if (data[j] == 'Y' || data[j] == 'y') {
                            cancelDeal = true;
                        }
                    }
                }
                console.log("是否退货：" + isRefund);
                console.log("是否取消交易" + cancelDeal);
                //执行退货操作
                //
                let refunddata = new refundData_1.RefundData();
                if (!cancelDeal && isRefund) {
                    try {
                        //点击进入查询/退货页面
                        await new search_1.Search_a8(client).search();
                        logUtils_1.LogUtils.log.info(isbefore);
                        //进行隔日订单退货，并判断是否成功
                        if (isbefore && deviceName == 'a8') {
                            refunddata.isSuccess = await refundOrder_1.RefundOrder.refundBeforeOrder(client, orderNo);
                        }
                        if (isbefore && deviceName != 'a8') {
                            refunddata.isSuccess = await refundOrder_1.RefundOrder_elo.refundBeforeOrder(client, orderNo);
                        }
                        //进行今日订单退货，并判断是否成功
                        if (!isbefore && deviceName == 'a8') {
                            refunddata.isSuccess = await refundOrder_1.RefundOrder.refundOrderToday(client, orderNo);
                        }
                        if (!isbefore && deviceName != 'a8') {
                            refunddata.isSuccess = await refundOrder_1.RefundOrder_elo.refundOrderToday(client, orderNo);
                        }
                    }
                    catch (e) {
                        logUtils_1.LogUtils.log.info("===退货出错，执行截屏操作===");
                        await screenShotUtil_1.ScreenShotUtil.takeScreenShot(client, orderNo);
                    }
                    //退货数据的赋值，用于输出退货测试数据
                    refunddata.refundPrice = money;
                    refunddata.refundOrderNo = "'" + orderNo;
                    refunddata.refundTime = new Date().toLocaleDateString();
                    refundDatas.push(refunddata);
                    exportCsv_1.ExportCsv.printRefundData(options, refundDatas, filename);
                }
            }
        }
        //ExportCsv.printRefundData();
        logUtils_1.LogUtils.log.info("=====输出完成退货操作的csv文件===");
    }
}
exports.Refund = Refund;
