"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelReturns = void 0;
const deviceName_1 = require("../static/deviceName");
const Screen_1 = require("./Screen");
const Search_1 = require("./Search");
const deviceName = deviceName_1.DeviceName.getDeviceName();
class CancelReturns {
    static async cancelReturns(client) {
        await Search_1.Search.search(client);
        const orderType = ['一般销售单'];
        const orderState = ['已完成', '已部分退'];
        await Screen_1.Screen.screenNo(client, new Date().toLocaleDateString(), orderType, orderState);
        client.pause(3000);
        let close = await client.$('//android.widget.Button[@content-desc="关闭"]');
        await close.click();
        let sel = await client.$('(//android.widget.Image[@content-desc="clipboard"])[1]');
        await sel.click();
        let returns = await client.$('//android.widget.Button[@content-desc="申请退货"]');
        await returns.click();
        let cancel = await client.$('//android.widget.Button[@content-desc="取消"]');
        await cancel.click();
        let back = await client.$('//android.widget.Button[@content-desc="arrow back "]');
        await back.click();
        //android.widget.Button[@content-desc="funnel 筛选"]
        //android.widget.CheckBox[@content-desc="一般销售单"]
        //android.widget.CheckBox[@content-desc="已完成"]
        //android.widget.Button[@content-desc="完成"]
        //android.widget.Button[@content-desc="calendar"]
        //android.widget.Button[@content-desc="关闭"]
        // (//android.widget.Image[@content-desc="clipboard"])[1]
        //android.widget.Button[@content-desc="return left 返回"]
    }
}
exports.CancelReturns = CancelReturns;
