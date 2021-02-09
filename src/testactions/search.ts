import {TouchAction} from "./touchAction";
import {LogUtils} from "../utils/logUtils";



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
            //查询订单号
            if(num.length>15){
            let codeNo = await client.$('//android.view.View[@content-desc='+num+']');
            await codeNo.click();
            await client.pause(1000);
            }
            //查询会员号
            else {

            }
            LogUtils.log.info("=====" + num +"查询符合预期==");
            LogUtils.log.info("=====查询结束====");

        }catch (e) {
            LogUtils.log.info("=====" + num +"查询无结果==");
            LogUtils.log.info("=====查询结束====");

        }
    }

    //扫码查询订单
    static async searchOrder(client:any){
          //手动扫码
         let qr = await client.$('//android.widget.Button[@content-desc="qr scanner"]');
         await qr.click();
         await client.pause(10000);
         try{
             let theTopOrder = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[3]/android.view.View[5]/following-sibling::android.view.View');
             await theTopOrder.click();
             await client.pause(1000);
            LogUtils.log.info("=====查询符合预期==");
            LogUtils.log.info("=====查询结束====");

         }catch (e) {
            LogUtils.log.info("=====查询无结果==");
            LogUtils.log.info("=====查询结束====");

         }
    }

}

export class Search_a8 extends Search {}
export class Search_elo extends Search {
    static async search(client: any) {
        let menu = await client.$('//android.widget.Button[@content-desc="menu"]');
        await menu.click();
        await client.pause(1000);
        let search_back = await client.$('//android.widget.Button[@content-desc="查询/退货"]');
        await search_back.click();
        await client.pause(1000);
    }
}
