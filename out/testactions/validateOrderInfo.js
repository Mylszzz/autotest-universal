"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateOrderInfo = void 0;
const deviceName_1 = require("../static/deviceName");
const initOrderInfoMap_1 = require("../utils/initOrderInfoMap");
const LogUtils_1 = require("../utils/LogUtils");
const CsvOptions_1 = require("../utils/CsvOptions");
const ExportCsv_1 = require("../utils/ExportCsv");
class ValidateOrderInfo {
    constructor() {
        this.deviceName = deviceName_1.DeviceName.getDeviceName();
    }
    // private infoMap:any;  // 用于保存订单信息
    // private client:wdio.BrowserObject;
    // 获取储存了订单信息的Map
    static async getOrderInfo(client) {
        let infoMap = await initOrderInfoMap_1.OrderInfoMap.getInfoMap();
        for (let key of infoMap.keys()) { // 迭代infoMap，获取订单信息中需要检查的项目名称
            try {
                // 获取订单信息中的需要检查的项目名称的下一个控件名称即为需要的值，如：总数量：1
                let tempValueObject = await client.$('//android.view.View[@content-desc=' + key +
                    ']/following-sibling::android.view.View');
                let tempValue = await tempValueObject.getAttribute('content-desc');
                await infoMap.set(key, tempValue); // 更新信息储存map
            }
            catch (e) {
                LogUtils_1.LogUtils.log.info(e);
            }
        }
        LogUtils_1.LogUtils.log.info('订单信息获取成功！');
        return infoMap;
    }
    /**
     * 将订单信息保存在csv中
     * 之后可以对比预计输出的csv以判断是否符合预期
     * 其中的订单号可以用来退货
     */
    static saveOrderInfoToCsv(client) {
        let infoMap = this.getOrderInfo(client);
        let headers = [];
        for (let key of infoMap.keys()) {
            headers.push(key);
        }
        let frequency = 1; // TODO
        let fileName = 'saveOrderInfoTest.csv';
        let data = "";
        let option = CsvOptions_1.CsvOptions.configurationOption(frequency, headers);
        ExportCsv_1.ExportCsv.printSaleData(option, data, fileName);
    }
}
exports.ValidateOrderInfo = ValidateOrderInfo;
