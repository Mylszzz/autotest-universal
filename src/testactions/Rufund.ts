import {SingleDriver} from "../driver";
import {GlobalUtil} from "../utils/GlobalUtil";
import {LoginAction} from "./loginAction";
import {ReadUtils} from "../utils/readUtils";
import {LogUtils} from "../utils/LogUtils";
import {RefundOrder} from "./RefundOrder";
import {RefundData} from "../entity/refundData";
import {ExportCsv} from "../utils/ExportCsv";
import {Title} from "../entity/title";
import {ScreenShotUtil} from "../utils/ScreenShotUtil";
import {Tools} from "../utils/Tools";
import {Search} from "./Search";

export class Refund {
    public static async Refund(client:any) {
        let filename = Tools.guid();
        let s: string = ReadUtils.readForRefund();
        //console.log(s);
        let strings = s.split('\r\n');
        //获取第一行的标题
        let title = strings[0];
        //console.log(title);
        let titleList = title.split(',');//标题分类为各自一列
        // 遍历每一行数据，获取标题对应的值
        for (let i = 1; i < strings.length; i++) {
            let datas: string = strings[i];
            let data = datas.split(',');
            let orderNo = '';
            let money = "";
            let pays = null;
            let isRefund: boolean = false;
            let cancelDeal: boolean = false;
            let isbefore: boolean = false;
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
                let refundDatas: RefundData[] = [];
                for (let j = 0; j < titleList.length; j++) {
                    //console.log(titleList[j] + '===>' + data[j]);
                    //进行退货操作
                    //打印每一行的测试数据
                    LogUtils.log.info(titleList[j] + '===>' + data[j]);
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
                let refunddata = new RefundData();
                if (!cancelDeal && isRefund) {
                    try {
                        //点击查询订单
                        await Search.search(client);
                        if (isbefore) {
                          //进行隔日订单退货，并判断是否成功
                            refunddata.isSuccess = await RefundOrder.refundBeforeOrder(client, orderNo);
                        } else {
                            // @ts-ignore
                           //进行今日订单退货，并判断是否成功
                            refunddata.isSuccess = await RefundOrder.refundOrderToday(client, orderNo);
                        }

                    } catch (e) {
                        LogUtils.log.info("===退货出错，执行截屏操作===");
                        await ScreenShotUtil.takeScreenShot(client, orderNo);
                    }
                    //退货数据的赋值，用于输出退货测试数据
                    refunddata.refundPrice = money;
                    refunddata.refundOrderNo = "'" + orderNo;
                    refunddata.refundTime = new Date().toLocaleDateString();
                    refundDatas.push(refunddata);
                    ExportCsv.printRefundData(options, refundDatas, filename);

                }
            }


        }

        //ExportCsv.printRefundData();
        LogUtils.log.info("=====输出完成退货操作的csv文件===");

    }
}
// (function (){
//     var s = new Date().toLocaleDateString();
//     let time : String = "2021/1/22"
//     console.log(s)
//     console.log(time)
//     console.log(s==time);
//
// }())
// bug 退货操作的时间判断
