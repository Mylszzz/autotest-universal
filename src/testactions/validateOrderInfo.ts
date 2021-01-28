import {DeviceName} from "../static/deviceName";

export class ValidateOrderInfo {
    public deviceName:string = DeviceName.getDeviceName();
    public infoMap:any = new Map();  // 用于保存订单信息

}