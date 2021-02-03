import {TouchAction} from "./TouchAction";
import {LogUtils} from "../utils/LogUtils";

//进入查询/退货页面
export class Search{
      static async search(client: any) {
        let menu = await client.$('//android.widget.Button[@content-desc="menu "]');
        await menu.click();
        await client.pause(1000);
        //  点击查询
        let chooseBackGood = await client.$('//android.widget.Button[@content-desc="list box 查询/退货"]');
        await chooseBackGood.click();
        await client.pause(2000);
    }

    //查询具体的订单
     static async searchNo(client: any,num:string) {
        //  查询订单号或会员号
        let codeNoText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.widget.EditText');
        await codeNoText.click();
        await client.pause(1000);
        await TouchAction.phoneNum(client, num);
        await client.pause(10000);
        try{
            let ok = await client.$('//android.widget.Button[@content-desc="确定"]');
            await ok.click();
            await client.pause(1000);
            LogUtils.log.info("=====" + num +"查询符合预期==");
            LogUtils.log.info("=====查询结束====");

        }catch (e) {
            LogUtils.log.info("=====" + num +"查询无结果==");
            LogUtils.log.info("=====查询结束====");

        }
    }

}
