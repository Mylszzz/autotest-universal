import {DeviceName} from "../static/deviceName";

const attribute_arr_a8:string[] = ["总数量", "总金额", "优惠金额", "应付", "找零", "订单号", "创建时间", "状态"];  //TODO:需要全包变量中读取
const attribute_arr_elo:string[] = [];

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
                this.orderInoMap.set(attribute_arr_a8[i]);
            }
        } else if (DeviceName.getDeviceName()=='elo') {
            for (i in attribute_arr_elo) {
                this.orderInoMap.set(attribute_arr_elo[i]);
            }
        }
    }

    static getInfoMap():any {
        this.createInfoMap();
        return this.orderInoMap;
    }

}
