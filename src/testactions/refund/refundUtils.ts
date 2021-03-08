import {ReadUtils} from "../../utils/readUtils";
import {AutoTestException} from "../../utils/exceptions";
import {SaleMainLoop} from "../sale/saleMainLoop";
import {LogUtils} from "../../utils/logUtils";


/**
 * 退货需要信息的接口
 * 用于单次退货是实现
 */
interface IRefundInfo {
    orderNo:string;
    price:string;
    refund:boolean;
    cancel:boolean;
    isSuccess:string;
    saleTime:string
}


/**
 * 退货的准备工作
 */
export class RefundPreparation {
    rows:string[] = [];  //
    titleList:string[] = [];  // 标题分类为各自一列
    refundDataMaps:Map<string,string>[] = [];  // 所有退款数据

    /**
     * 构造函数，并调用初始化退款数据的方法
     */
    constructor() {
        this.init();
    }

    /**
     * 初始化退款数据
     */
    private init() {
        //读取售卖记录
        let s: string = ReadUtils.readForRefund(SaleMainLoop.getFileName());
        //SaleMainLoop.getFileName());
        //console.log(s);
        this.rows = s.split('\r\n');
        //获取第一行的标题
        let title = this.rows[0];
        //console.log(title);
        this.titleList = title.split(',');// 标题分类为各自一列

        // 遍历每一行需要退款的记录
        for (let i = 1; i < this.rows.length-1; i++) {
            let tempDataMap:Map<string, string> = new Map<string, string>();
            let values:string[] =  this.rows[i].split(',');
            for (let j = 0; j < this.titleList.length; j++) {
                tempDataMap.set(this.titleList[j], values[j]);  // 退款字段, 值
            }
            this.refundDataMaps.push(tempDataMap);
        }
        console.log(this.refundDataMaps);
    }

    public getRefundDataMaps():Map<string,string>[] {
        return this.refundDataMaps;
    }
}


/**
 * 单次退货
 */
export class RefundOnce implements IRefundInfo{
    private refundable:boolean = false;  // 该退款条目就是否需要退款

    saleTime:string = '';  // 销售时间: 格式如 2021/2/4
    orderNo:string = '';  // 订单号
    price:string = '';  // 总价
    refund:boolean = false;  // 是否退货
    cancel:boolean = false;  // 是否取消交易
    isSuccess:string = '';//是否退货成功

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
            try {
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
                    case '是否退货成功':
                        this.isSuccess = value;
                        break;
                    case 'saleTime':
                        this.saleTime = value;
                        break;
                    default:  // 其他字段是支付方式，这里只保存使用了的支付方式
                        if (value != '0') {
                            this.payMethods.push(key);
                        }
                        break;
                }
            } catch (e) {
                throw new AutoTestException('A0002', '退款输入数据异常').toString();
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

    public getOrderNo():string {
        return this.orderNo;
    }


    public getBeforeToday():boolean {
        return this.beforeToday;
    }

    public getPrice():string {
        return this.price;
    }

    /**
     * 如果取消为N, 退货为Y, 则此单需要退货，设定this.refundable为true
     */
    private isRefundable():void {
        this.refundable = ((!this.cancel) && this.refund);
    }

    /**
     * 判断是否为往日订单（非本日）
     * @param {string} saleDate 从csv中读取到的销售日期
     * @returns {boolean}  true=非本日; false=本日
     */
    public isBeforeToday(saleDate:string):boolean {
        saleDate = saleDate.replace("-", "").replace("-", "");
        let todayDate:string = new Date().toLocaleDateString().replace("-", "")
            .replace("-", "");
        if (Number.parseInt(saleDate) != Number.parseInt(todayDate)) {
            this.beforeToday = true;
        }
        return this.beforeToday;
    }
}
