import {DeviceName} from "../../static/deviceName";

const attribute_arr_a8:string[] = ["总数量", "总金额", "优惠金额", "应付", "找零", "订单号", "创建时间", "状态"];  //TODO:需要全包变量中读取
const attribute_arr_elo:string[] = ["总数量", "总金额", "优惠金额", "应收金额", "实收金额", "订单号", "创建时间", "状态"];


/**
 * 创建一个Map用来储存交易完成后终端上显示的订单信息
 * key: 信息名称，例如：总数量
 * value: 信息值，例如：1
 * get方法，返回创建好的Map
 */
export class OrderInfoMap{
    private static orderInoMap = new Map();

    payMethod:string;
    constructor(payMethod:string){
        this.payMethod = payMethod;
    }

    static createInfoMap():void {
        let i:string;  // 用于遍历数组
        if (DeviceName.getDeviceName()=='a8') {
            for (i in attribute_arr_a8) {
                this.orderInoMap.set(attribute_arr_a8[i],'');
            }
        } else if (DeviceName.getDeviceName()=='elo') {
            for (i in attribute_arr_elo) {
                this.orderInoMap.set(attribute_arr_elo[i],'');
            }
        }
    }

    static getInfoMap():any {
        this.createInfoMap();
        return this.orderInoMap;
    }

}
