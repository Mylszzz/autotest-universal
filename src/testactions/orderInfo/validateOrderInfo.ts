import {OrderInfoMap} from "./initOrderInfoMap";
import {LogUtils} from "../../utils/logUtils";
import * as wdio from "webdriverio";
import {CsvOptions} from "../../utils/csvOptions";
import {ExportCsv} from "../../utils/exportCsv";

export class ValidateOrderInfo {

    /**
     * 获取储存了订单信息的Map
     * @param {WebdriverIO.BrowserObject} client
     * @returns {Promise<any>}
     */
    static async getOrderInfo(client:wdio.BrowserObject) {
        let infoMap = await OrderInfoMap.getInfoMap();
        for (let key of infoMap.keys()) {  // 迭代infoMap，获取订单信息中需要检查的项目名称
            try {
                // 获取订单信息中的需要检查的项目名称的下一个控件名称即为需要的值，如：总数量：1
                let tempValueObject = await client.$('//android.view.View[@content-desc="'+key+
                    '"]/following-sibling::android.view.View');
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
     */
    static async saveOrderInfoToCsv(client:wdio.BrowserObject) {
        let infoMap = await this.getOrderInfo(client);
        let headers:string[] = [];  // 表头
        let values:string[] = [];  // 信息
        let fileName = 'saveOrderInfoTest.csv';  // 输出文件名
        console.log(infoMap);
        for (let [key, value] of infoMap) {
            headers.push(key);
            values.push(value);
        }
        let data: string[][] = [];  // 储存需要打印信息的二元数组
        // 输出csv配置，需要打印的内容出去header只有1行
        let option = CsvOptions.configurationOption(1, headers);
        data.push(values);

        ExportCsv.printSaleData(option, data, fileName);
    }


}