import {TouchAction} from "./TouchAction";
import NP from 'number-precision'
import {GlobalUtil} from "../utils/GlobalUtil";
import {SaleData} from "../entity/saleData";
import {LogUtils} from "../utils/LogUtils";

export class Search{
    public static async search(client: any) {
        let menu = await client.$('//android.widget.Button[@content-desc="menu "]');
        await menu.click();
        await client.pause(1000);
        //  点击查询
        let chooseBackGood = await client.$('//android.widget.Button[@content-desc="list box 查询/退货"]');
        await chooseBackGood.click();
        await client.pause(2000);
    }

    public static async searchNo(client: any,num:string) {
        //  查询订单号或会员号
        let codeNoText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.widget.EditText');
        await codeNoText.click();
        await TouchAction.phoneNum(client, num);
        let ok = await client.$('//android.widget.Button[@content-desc="确定"]');
        await ok.click();
    }

}
