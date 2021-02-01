"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screen = void 0;
const Search_1 = require("./Search");
/*
* 选择筛选条件
* */
class Screen {
    //筛选条件
    static async screenNo(client, date) {
        await Search_1.Search.search(client);
        //点击筛选
        let ccBtn = await client.$('//android.widget.Button[@content-desc="funnel"]');
        await ccBtn.click();
        //选择日期
        let calBtn = await client.$('//android.widget.Button[@content-desc="calendar"]');
        await calBtn.click();
        let dat = date.split('-');
        let nowDate = new Date();
        let dat1 = nowDate.getMonth() + 1; //当前月份
        //判断测试月份是否小于当前月份，如果是，则去到上一月份日历直至到测试月份日历
        while (dat1 - Number.parseInt(dat[1]) > 0) {
            let backBtn = await client.$('//android.widget.Button[@content-desc="arrow back"]');
            await backBtn.click();
            dat1--;
        }
        //日期大于20时，选择第二个日期
        if (Number.parseInt(dat[2]) > 20) {
            let dateView = await client.$('(//android.view.View[@content-desc="' + dat[2] + '"])[2]');
            await dateView.click();
        }
        else {
            let dateView = await client.$('(//android.view.View[@content-desc="' + dat[2] + '"])[1]');
            await dateView.click();
        }
        let okView = await client.$('//android.view.View[@content-desc="确定"]');
        await okView.click();
        //选择条件
        let typeView1 = await client.$('//android.view.View[@content-desc="取消退货单"]');
        await typeView1.click();
        let typeView2 = await client.$('//android.view.View[@content-desc="已取消"]');
        await typeView2.click();
    }
    //点击完成筛选条件
    static async okScreen(client) {
        //完成
        let ok = await client.$('//android.widget.Button[@content-desc="完成"]');
        await ok.click();
    }
    static async refScreen(client) {
        //重置
        let ok = await client.$('//android.widget.Button[@content-desc="重置"]');
        await ok.click();
    }
}
exports.Screen = Screen;
