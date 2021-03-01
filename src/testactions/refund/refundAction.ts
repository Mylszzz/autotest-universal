import {DeviceName} from "../../static/deviceName";
import {CsvOptions} from "../../utils/csvOptions";
import {RefundPreparation, RefundOnce} from "./refundUtils";
import {LogUtils} from "../../utils/logUtils";
import {RefundData} from "../../entity/refundData";
import {ScreenShotUtil} from "../../utils/screenShotUtil";
import {Search_elo, Search_a8} from "../search";
import {RefundOrder, RefundOrder_a8, RefundOrder_elo} from "./refundOrder";
import {ExportCsv} from "../../utils/exportCsv";
import {Tools} from "../../utils/tools";
import {GlobalUtil} from "../../utils/globalUtil";


export class RefundAction {
    client:any;
    refundDataMaps:Map<string,string>[] = [];  //
    deviceName:string;

    /**
     * 构造方法
     * @param client
     */
    public constructor(client:any) {
        this.client = client;
        this.deviceName = DeviceName.getDeviceName();
    }

    /**
     * 调用退货的执行脚本
     * @returns {Promise<void>}
     */
    public async refundProcess() {
        let refundPreparation = new RefundPreparation();
        this.refundDataMaps = refundPreparation.getRefundDataMaps();

        let refundDataList:RefundData[] = [];

        for (let i=0; i<this.refundDataMaps.length; i++) {
            let refundOnce = new RefundOnce(this.refundDataMaps[i]);  // 一次退货
            let orderNo:string = refundOnce.getOrderNo();
            if (refundOnce.getIsRefundable()) {
                LogUtils.refundLog.info('===对订单:'+orderNo+'执行退货===');
                // 退款
              let beforeToday= refundOnce.getBeforeToday();
                let refundData = new RefundData();
                try {
                    if (this.deviceName == 'a8') {
                        let search_a8 = new Search_a8(this.client);
                        await search_a8.search();
                        await search_a8.searchNum(orderNo);
                        if (beforeToday) {
                            refundData.isSuccess = await RefundOrder_a8.refundBeforeOrder(this.client, orderNo);
                        } else {
                            //进行今日订单退货，并判断是否成功
                            LogUtils.refundLog.info("nn");
                            refundData.isSuccess = await RefundOrder_a8.refundOrderToday(this.client, orderNo);
                        }
                    } else {
                        let search_elo = new Search_elo(this.client);
                        await search_elo.search();
                        await search_elo.searchNum(orderNo);
                 //       await search_elo.search();
                        if (beforeToday) {
                            //进行隔日订单退货，并判断是否成功
                            refundData.isSuccess = await RefundOrder_elo.refundBeforeOrder(this.client, orderNo);
                        }
                        else {
                            refundData.isSuccess = await RefundOrder_elo.refundOrderToday(this.client, orderNo);
                        }

                    }

                } catch (e) {
                    LogUtils.log.info("===退货出错，执行截屏操作===");
                    await ScreenShotUtil.takeScreenShot(this.client, orderNo);
                }

                // //退货数据的赋值，用于输出退货测试数据
                 refundData.refundPrice = refundOnce.getPrice();
                 refundData.refundOrderNo = "'" + orderNo;
                 refundData.refundTime = new Date().toLocaleDateString();
                 refundDataList.push(refundData);
                 ExportCsv.printRefundData(CsvOptions.refundOptions, refundDataList, Tools.guid());

            }
        }
    }

}

