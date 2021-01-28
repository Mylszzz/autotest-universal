"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screen = void 0;
const Search_1 = require("./Search");
class Screen {
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
        let dateView = await client.$('//android.view.View[@content-desc="' + dat[3] + '"]');
        await dateView.click();
        let okView = await client.$('//android.view.View[@content-desc="确定"]');
        await okView.click();
        //选择条件
        let typeView = await client.$('//android.view.View[@content-desc="一般销售单"]');
        await typeView.click();
        //完成
        let ok = await client.$('////android.widget.Button[@content-desc="完成"]');
        await ok.click();
    }
}
exports.Screen = Screen;
