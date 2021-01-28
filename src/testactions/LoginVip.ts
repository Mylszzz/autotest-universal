import {TouchAction} from "./TouchAction";
import {GlobalUtil} from "../utils/GlobalUtil";

/*
* 登录会员
* */
export class LoginVip {
    public static async loginVip(client: any) {
        //点击登录会员
        let vip= await client.$('//android.view.View[@content-desc="请点击登录会员号码"]');
        await vip.click();
        //输入会员号码
        await TouchAction.phoneNum(client, GlobalUtil.map.get('vipPhone'));
        //点击确定
        let ok = await client.$('//android.widget.Button[@content-desc="确定"]');
        await ok.click();
    }
}
