"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
/**
 * 提供选择日历上的时间的方法
 */
class DateUtil {
    static async selectDate(client, date) {
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
        if (Number.parseInt(dat[2]) < 15) {
            let dateView = await client.$('(//android.view.View[@content-desc="' + dat[2] + '"])[1]');
            await dateView.click();
        }
        let okView = await client.$('//android.view.View[@content-desc="确定"]');
        await okView.click();
    }
}
exports.DateUtil = DateUtil;
