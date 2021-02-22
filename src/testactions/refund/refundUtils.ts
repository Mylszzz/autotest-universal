import {ReadUtils} from "../../utils/readUtils";
import {LogUtils} from "../../utils/logUtils";
import {RefundOrder, RefundOrder_elo} from "./refundOrder";
import {RefundData} from "../../entity/refundData";
import {ExportCsv} from "../../utils/exportCsv";
import {ScreenShotUtil} from "../../utils/screenShotUtil";
import {Tools} from "../../utils/tools";
import {Search, Search_elo} from "../search";
import {DeviceName} from "../../static/deviceName";
import {CsvOptions} from "../../utils/csvOptions";

const deviceName: string = DeviceName.getDeviceName();

interface IRefundInfo {
    orderNo:string;
    price:string;
    refund:boolean;
    cancel:boolean;
    saleTime:string
}

export class RefundPreparation {
    client:any;
    filename:string = '';
    rows:string[] = [];  //
    titleList:string[] = [];  // 标题分类为各自一列
    refundDataMaps:Map<string,string>[] = [];  //

    /**
     * 构造函数，并调用初始化退款数据的方法
     * @param client
     */
    constructor(client:any) {
        this.client = client;
        this.init();
    }

    /**
     * 初始化退款数据
     */
    private init() {
        this.filename = Tools.guid();
        //读取售卖记录
        let s: string = ReadUtils.readForRefund();
        //console.log(s);
        this.rows = s.split('\r\n');
        //获取第一行的标题
        let title = this.rows[0];
        //console.log(title);
        this.titleList = title.split(',');// 标题分类为各自一列

        // 遍历每一行需要退款的记录
        for (let i = 1; i < this.rows.length; i++) {
            let tempDataMap:Map<string, string> = new Map<string, string>();
            let values:string[] =  this.rows[i].split(',');
            for (let j = 0; j < this.titleList.length; j++) {
                tempDataMap.set(this.titleList[j], values[j]);  // 退款字段, 值
            }
            this.refundDataMaps.push(tempDataMap);
        }
        console.log(this.refundDataMaps);
    }

    public static async Refund(client: any) {
        // let filename = Tools.guid();
        // //读取售卖记录
        // let s: string = ReadUtils.readForRefund();
        // //console.log(s);
        // let strings = s.split('\r\n');
        // //获取第一行的标题
        // let title = strings[0];
        // //console.log(title);
        // let titleList = title.split(',');//标题分类为各自一列
        // // 遍历每一行数据，获取标题对应的值



        // for (let i = 1; i < strings.length; i++) {
        //     let datas: string = strings[i];
        //     let data = datas.split(',');
        //     let orderNo = '';
        //     let money = "";
        //     let pays = null;
        //     let isRefund: boolean = false;
        //     let cancelDeal: boolean = false;
        //     let isbefore: boolean = false;
        //     let options = CsvOptions.refundOptions;
        //     if (datas != "") {
        //         let refundDatas: RefundData[] = [];
        //         for (let j = 0; j < titleList.length; j++) {
        //             //console.log(titleList[j] + '===>' + data[j]);
        //             //进行退货操作
        //             //打印每一行的测试数据
        //             LogUtils.log.info(titleList[j] + '===>' + data[j]);
        //             if (titleList[j].includes('saleTime')) {
        //                 //判断测试数据日期是否不等于当前日期
        //                 data[j] = data[j].replace("/", "").replace("/", "");
        //                 let date: string = new Date().toLocaleDateString().replace("-", "").replace("-", "");
        //                 if (Number.parseInt(data[j]) == Number.parseInt(date)) {
        //                     LogUtils.log.info(data[j], date);
        //                     isbefore = true;
        //                 }
        //             }
        //             //每一组具体数据
        //             if (titleList[j].includes('orderNo')) {
        //                 orderNo = data[j].replace("\"\'", "").replace("\"", "").replace("'", "");
        //             }
        //             if (titleList[j].includes('price')) {
        //                 money = data[j];
        //             }
        //             if (titleList[j].includes('payMethods')) {
        //                 pays = data[j];
        //             }
        //             if (titleList[j].includes('退货')) {
        //                 if (data[j] == 'Y' || data[j] == 'y') {
        //                     isRefund = true;
        //                 }
        //             }
        //             if (titleList[j].includes('取消交易')) {
        //                 if (data[j] == 'Y' || data[j] == 'y') {
        //                     cancelDeal = true;
        //                 }
        //             }
        //         }
        //         console.log("是否退货：" + isRefund);
        //         console.log("是否取消交易" + cancelDeal);
                //执行退货操作
                let refunddata = new RefundData();
                if (!cancelDeal && isRefund) {
                    try {
                        //点击进入查询/退货页面
                        await Search_elo.search(client);

                        LogUtils.log.info(isbefore);
                        if (isbefore) {
                            if (deviceName == 'a8') {
                                refunddata.isSuccess = await RefundOrder.refundBeforeOrder(client, orderNo);
                            } else {
                                //进行隔日订单退货，并判断是否成功
                                refunddata.isSuccess = await RefundOrder_elo.refundBeforeOrder(client, orderNo);
                            }
                        } else {
                            if (deviceName == 'a8') {
                                //进行今日订单退货，并判断是否成功
                                refunddata.isSuccess = await RefundOrder.refundOrderToday(client, orderNo);
                            }
                            else {
                                refunddata.isSuccess = await RefundOrder_elo.refundOrderToday(client, orderNo);
                            }

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

            //     }
            // }


        }

        //ExportCsv.printRefundData();
        LogUtils.log.info("=====输出完成退货操作的csv文件===");

    }
}

/**
 *
 */
class RefundOnce implements IRefundInfo{
    private refundable:boolean = false;  // 该退款条目就是否需要退款

    saleTime:string = '';  // 销售时间: 格式如 2021/2/4
    orderNo:string = '';  // 订单号
    price:string = '';  // 总价
    refund:boolean = false;  // 是否退货
    cancel:boolean = false;  // 是否取消交易


    payMethods:string[] = [];  // 支付中使用的（金额不为0的支付方式）

    refundDataMap:Map<string,string>;
    beforeToday:boolean = false;  // 需要退款的订单是否为非本日订单

    /**
     * 构造方法，并调用dataProcess() 进行数据处理, 再调用isRefundable()判断是否需要退货，最后调用isBeforeToday()判断是当日/往日单
     * @param {Map<string, string>} refundDataMap: 储存单挑退款信息的Map
     */
    public constructor(refundDataMap:Map<string,string>) {
        this.refundDataMap = refundDataMap;

        this.dataProcess(this.refundDataMap);
        this.isRefundable();
        this.isBeforeToday(this.saleTime);
    }

    /**
     * 从输入的退款信息中解析退款需要用的字段
     * @param {Map<string,string>} refundDataMap
     */
    private dataProcess(refundDataMap:Map<string,string>) {
        for (let [key, value] of refundDataMap) {
            switch (key) {
                case 'orderNo':
                    this.orderNo = value;
                    break;
                case 'price':
                    this.price = value;
                    break;
                case '退货':
                    this.refund = value.toUpperCase() == 'Y';
                    break;
                case '取消交易':
                    this.cancel = value.toUpperCase() == 'Y';
                    break;
                case 'saleTime':
                    this.saleTime = value;
                    break;
                default:  // 其他字段是支付方式，这里只保存使用了的支付方式
                    if (value != 0) {
                        this.payMethods.push(key);
                    }
                    break;
            }
        }
    }

    /**
     * @returns {string[]} 支付方式
     */
    public getPayMethods():string[] {
        return this.payMethods;
    }

    /**
     * @returns {boolean} 是否需要退货
     */
    public getIsRefundable():boolean {
        return this.refundable;
    }

    /**
     * 如果取消为N, 退货为Y, 则此单需要退货，设定this.refundable为true
     */
    public isRefundable():void {
        this.refundable = ((!this.cancel) && this.refund);
    }

    /**
     * 判断是否为往日订单（非本日）
     * @param {string} saleDate 从csv中读取到的销售日期
     * @returns {boolean}  true=非本日; false=本日
     */
    private isBeforeToday(saleDate:string):boolean {
        saleDate = saleDate.replace("/", "").replace("/", "");
        let todayDate:string = new Date().toLocaleDateString().replace("-", "")
            .replace("-", "");
        if (Number.parseInt(saleDate) = Number.parseInt(todayDate)) {
            this.beforeToday = true;
        }
        return this.beforeToday;
    }
}
