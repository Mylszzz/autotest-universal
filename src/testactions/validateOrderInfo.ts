import {DeviceName} from "../static/deviceName";
import {OrderInfoMap} from "../utils/initOrderInfoMap";
import {LogUtils} from "../utils/LogUtils";
import * as wdio from "webdriverio";
import {CsvOptions} from "../utils/CsvOptions";
import {ExportCsv} from "../utils/ExportCsv";

export class ValidateOrderInfo {
    private deviceName:string = DeviceName.getDeviceName();
    // private infoMap:any;  // 用于保存订单信息
    // private client:wdio.BrowserObject;



    // 获取储存了订单信息的Map
    static async getOrderInfo(client:wdio.BrowserObject) {
        let infoMap = await OrderInfoMap.getInfoMap();
        for (let key of infoMap.keys()) {  // 迭代infoMap，获取订单信息中需要检查的项目名称
            try {
                // 获取订单信息中的需要检查的项目名称的下一个控件名称即为需要的值，如：总数量：1
                let tempValueObject = await client.$('//android.view.View[@content-desc='+key+
                    ']/following-sibling::android.view.View');
                let tempValue:string = await tempValueObject.getAttribute('content-desc');
                await infoMap.set(key, tempValue);  // 更新信息储存map
            } catch (e) {
                LogUtils.log.info(e);
            }
        }
        LogUtils.log.info('订单信息获取成功！');
        return infoMap;
    }

    /**
     * 将订单信息保存在csv中
     * 之后可以对比预计输出的csv以判断是否符合预期
     * 其中的订单号可以用来退货
     */
    static saveOrderInfoToCsv(client:wdio.BrowserObject) {
        let infoMap = this.getOrderInfo(client);
        let headers: string[] = [];
        for (let key of infoMap.keys()){
            headers.push(key)
        }
        let frequency = 1;  // TODO
        let fileName = 'saveOrderInfoTest.csv';
        let data = "";

        let option = CsvOptions.configurationOption(frequency, headers);

        ExportCsv.printSaleData(option, data, fileName);

    }


}