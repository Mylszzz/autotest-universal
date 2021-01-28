import {Search} from "./Search";
import {TouchAction} from "./TouchAction";

export class Screen {
    public static async screenNo(client: any,date:string,) {
        await Search.search(client);
        //点击筛选
        let ccBtn = await client.$('//android.widget.Button[@content-desc="funnel"]');
        await ccBtn.click();
        //选择日期
        let calBtn = await client.$('//android.widget.Button[@content-desc="calendar"]');
        await calBtn.click();
        let dat =date.split('-');
        let nowDate: Date = new Date();
        let dateView = await client.$('//android.view.View[@content-desc="'+dat[3]+'"]');
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
