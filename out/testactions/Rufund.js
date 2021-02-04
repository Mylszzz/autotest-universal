"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refund = void 0;
const readUtils_1 = require("../utils/readUtils");
const LogUtils_1 = require("../utils/LogUtils");
const RefundOrder_1 = require("./RefundOrder");
const refundData_1 = require("../entity/refundData");
const ExportCsv_1 = require("../utils/ExportCsv");
const ScreenShotUtil_1 = require("../utils/ScreenShotUtil");
const Tools_1 = require("../utils/Tools");
const Search_1 = require("./Search");
class Refund {
    static async Refund(client) {
        let filename = Tools_1.Tools.guid();
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
                    LogUtils_1.LogUtils.log.info(titleList[j] + '===>' + data[j]);
                    if (titleList[j].includes('saleTime')) {
                        //判断测试数据日期是否等于当前日期
                        if (data[j] != new Date().toLocaleDateString()) {
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
                let refunddata = new refundData_1.RefundData();
                if (!cancelDeal && isRefund) {
                    try {
                        //点击查询订单
                        await Search_1.Search.search(client);
                        if (isbefore) {
                            //进行隔日订单退货，并判断是否成功
                            refunddata.isSuccess = await RefundOrder_1.RefundOrder.refundBeforeOrder(client, orderNo);
                        }
                        else {
                            //进行今日订单退货，并判断是否成功
                            refunddata.isSuccess = await RefundOrder_1.RefundOrder.refundOrderToday(client, orderNo);
                        }
                    }
                    catch (e) {
                        LogUtils_1.LogUtils.log.info("===退货出错，执行截屏操作===");
                        await ScreenShotUtil_1.ScreenShotUtil.takeScreenShot(client, orderNo);
                    }
                    //退货数据的赋值，用于输出退货测试数据
                    refunddata.refundPrice = money;
                    refunddata.refundOrderNo = "'" + orderNo;
                    refunddata.refundTime = new Date().toLocaleDateString();
                    refundDatas.push(refunddata);
                    ExportCsv_1.ExportCsv.printRefundData(options, refundDatas, filename);
                }
            }
        }
        //ExportCsv.printRefundData();
        LogUtils_1.LogUtils.log.info("=====输出完成退货操作的csv文件===");
    }
}
exports.Refund = Refund;
// (function (){
//     var s = new Date().toLocaleDateString();
//     let time : String = "2021/1/22"
//     console.log(s)
//     console.log(time)
//     console.log(s==time);
//
// }())
// bug 退货操作的时间判断
