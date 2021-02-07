import {logger, LogUtils} from "../utils/LogUtils";
import {Search_a8} from "./Search";
import {Search_elo} from "./Search";
import {TouchAction} from "./TouchAction";
import {GlobalUtil} from "../utils/GlobalUtil";
import {ScreenShotUtil} from "../utils/ScreenShotUtil";
import {RefundBut_a8} from "../entity/refundButton";
import {RefundBut_elo} from "../entity/refundButton";
import {DeviceName} from "../static/deviceName";

const deviceName:string = DeviceName.getDeviceName();
const refBtn_a8 = new RefundBut_a8();
const refBtn_elo = new RefundBut_elo();

export class RefundOrder {

    public static isFind:boolean = false;
    //输入密码前的操作
    public static async refundFirst(client:any,orderNo:string,confirm:string){
        //    点击申请退货
        let apply = await client.$('//android.widget.Button[@content-desc="申请退货"]');
        await apply.click();
        await client.pause(1000);
        //    点击确认退货
        let reConfirm = await client.$(confirm);
        await reConfirm.click();
        await client.pause(1000);
    }
    //输入密码后的操作
    public static async refundThen(client:any,confirm:string,determine:string) {

        let confirm1 = await client.$(confirm);
        confirm1.click();
        await client.pause(1000);
        //    最后一次提示是否确认退货
        let lastConfirm = await client.$(determine);
        lastConfirm.click();
        await client.pause(1000);
    }
    //输入密码
    public static async refundPass(client:any,determine:string,number:string){
        await client.pause(1000);
        //输入密码
        if (deviceName == 'a8'){
            await TouchAction.touchPasswordAction(client, number,);
        }
        else {
            await TouchAction.touchPasswordAction1(client, number,);
        }
        LogUtils.log.info("====授权码填写结束=====");
        //密码确定
        let confirmTip = await client.$(determine);
        await confirmTip.click();
        await client.pause(1000);
    }


   //完成退货后的操作
    public static async refundOk(client:any,menu:string,home:string){
        let finish = await client.$('//android.widget.Button[@content-desc="完成"]');
        await client.pause(500);
        await finish.click();
        await client.setImplicitTimeout(1000);
        await client.pause(1000);
        //点击菜单栏
        let menu2 = await client.$(menu);
        await menu2.click();
        await client.pause(1000);
        //返回到主页
        let chooseSale = await client.$(home);
        await chooseSale.click();
        await client.pause(1000);
    }


    /**
     * 当日订单退款
     * @author Daniel_Li
     * @param client
     * @param orderNo
     */
    public static async refundOrderToday(client:any,orderNo:string){
        LogUtils.log.info("====对订单"+orderNo+"进行当日整单退款操作(今日)=====");
        //查询订单,并判断是否成功
        //await Search_a8.searchNo(client,orderNo);
        await Search_a8.searchOrder(client);
        try{
            await RefundOrder.refundFirst(client, orderNo,refBtn_a8.confirm);
            // 输入退货的固定密码
            LogUtils.log.info("请输入授权码");
            let number: string = await GlobalUtil.map.get('backGoods');
            await RefundOrder.refundPass(client,refBtn_a8.determine,number);
            //提示确定
            let confirmTip1 = await client.$(refBtn_a8.determine);
            await confirmTip1.click();
            await client.pause(1000);
            await RefundOrder.refundThen(client,refBtn_a8.confirm,refBtn_a8.determine);
            //  打印订单耗时
            let tip = await client.$('//android.widget.Button[@content-desc="确定"]');
            await client.pause(1000);
            tip.click();
            await client.pause(5000);
             //    点击返回
            let back = await client.$('//android.widget.Button[@content-desc="返回"]');
            await client.pause(1000);
            await back.click();
            await client.pause(1000);
            await RefundOrder.refundOk(client,refBtn_a8.menu,refBtn_a8.home);
            return true;
        }catch (e){
            logger.error("----------控件元素未找到--退货程序执行失败--重新启动"+"----------")
            return false;
        }
    }

    /**
     * 订单隔日整单退款
     * @author Daniel_Li
     * @param client
     * @param orderNo
     */
    // @ts-ignore
    public static async refundBeforeOrder(client: WebdriverIOAsync.BrowserObject,orderNo:string){
        LogUtils.log.info("====对订单"+orderNo+"进行当日整单退款操作（隔日）=====");
        //查询订单,并判断是否成功
        // await Search.searchNo(client,orderNo);
        await Search_a8.searchOrder(client);
        // 查询成功，执行退款操作
        try{
            await RefundOrder.refundFirst(client, orderNo,refBtn_a8.confirm);
            await RefundOrder.refundThen(client,refBtn_a8.confirm,refBtn_a8.determine);
            //  打印订单耗时
            let tip = await client.$('//android.widget.Button[@content-desc="确定"]');
            await client.pause(1000);
            tip.click();
            await client.pause(5000);
            //    点击返回
            let back = await client.$('//android.widget.Button[@content-desc="返回"]');
            await client.pause(1000);
            await back.click();
            await client.pause(1000);
            await RefundOrder.refundOk(client,refBtn_a8.menu,refBtn_a8.home);
            LogUtils.log.info("====订单"+orderNo+"隔日整单退款成功");
            return true;
        }catch (e) {
            LogUtils.log.info("====该笔订单预查询失败或退款失败,执行截屏操作===");
            await ScreenShotUtil.takeScreenShot(client,orderNo);
            try {
                LogUtils.log.info("监测是否为不支持供应商错误");
                if (
                    await client.isElementDisplayed((await client.$('//android.view.View[@content-desc="退货信息预查询失败，订单支付行包含指定支付供应商, 不支持退货"]')).elementId)) {
                    // let tip = await client.$('//android.view.View[@content-desc="退货信息预查询失败，订单支付行包含指定支付供应商, 不支持退货"]');
                    let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
                    await confirm.click();
                    await client.pause(500);
                    let back = await client.$('//android.widget.Button[@content-desc="arrow back "]');
                    await back.click();
                    RefundOrder.isFind = true;
                    LogUtils.log.info('-----------------订单支付行包含指定支付供应商, 不支持退货-------------');
                }
            }
            catch (e) {
            }
            return false;
        }
        }

}

export class  RefundOrder_a8 extends RefundOrder{

}

export class RefundOrder_elo extends RefundOrder{

    public static async refundOrderToday(client:any,orderNo:string){
        LogUtils.log.info("====对订单"+orderNo+"进行当日整单退款操作(今日)=====");
        //查询订单,并判断是否成功
        await Search_elo.searchNo(client,orderNo);
        try{
            await RefundOrder.refundFirst(client, orderNo,refBtn_elo.determine2);
            // 输入退货的固定密码
            let fixedpwd=await client.$('//android.view.View[@content-desc="固定密码"] ');
            await fixedpwd.click();
            let number: string = await GlobalUtil.map.get('backGoods');
            await RefundOrder.refundPass(client,refBtn_elo.determine,number);
            //提示确定
            let confirmTip1 = await client.$(refBtn_elo.determine2);
            await confirmTip1.click();
            await client.pause(1000);
            await RefundOrder.refundThen(client,refBtn_elo.confirm,refBtn_elo.determine2);
            //  打印订单耗时
            await client.pause(10000);
            await RefundOrder.refundOk(client,refBtn_elo.menu,refBtn_elo.home);
            return true;
        }catch (e){
            logger.error("----------控件元素未找到--退货程序执行失败--重新启动"+"----------")
            let pwd:string=GlobalUtil.map.get('backGoods2');
            await RefundOrder.refundPass(client,refBtn_elo.determine,pwd);
            //  打印订单耗时
            await client.pause(10000);
            await RefundOrder.refundOk(client,refBtn_elo.menu,refBtn_elo.home);
            return false;
        }
    }

    // @ts-ignore
    public static async refundBeforeOrder(client: WebdriverIOAsync.BrowserObject,orderNo:string){
        LogUtils.log.info("====对订单"+orderNo+"进行当日整单退款操作（隔日）=====");
        //查询订单,并判断是否成功
        // await Search.searchNo(client,orderNo);
        await Search_a8.searchOrder(client);
        // 查询成功，执行退款操作
        try{
            await RefundOrder.refundFirst(client, orderNo,refBtn_elo.confirm);
            await RefundOrder.refundThen(client,refBtn_elo.confirm,refBtn_elo.determine2);
            let number: string = await GlobalUtil.map.get('backGoods2');
            await RefundOrder.refundPass(client,refBtn_elo.determine,number);
            await client.pause(10000);
            LogUtils.log.info("====订单"+orderNo+"隔日整单退款成功");
            await RefundOrder.refundOk(client,refBtn_elo.menu,refBtn_elo.home);
            return true;
        }catch (e) {
            LogUtils.log.info("====该笔订单预查询失败或退款失败,执行截屏操作===");
            await ScreenShotUtil.takeScreenShot(client,orderNo);
            try {
                LogUtils.log.info("监测是否为不支持供应商错误");
                if (
                    await client.isElementDisplayed((await client.$('//android.view.View[@content-desc="退货信息预查询失败，订单支付行包含指定支付供应商, 不支持退货"]')).elementId)) {
                    // let tip = await client.$('//android.view.View[@content-desc="退货信息预查询失败，订单支付行包含指定支付供应商, 不支持退货"]');
                    let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
                    await confirm.click();
                    await client.pause(500);
                    let back = await client.$('//android.widget.Button[@content-desc="arrow back "]');
                    await back.click();
                    RefundOrder.isFind = true;
                    LogUtils.log.info('-----------------订单支付行包含指定支付供应商, 不支持退货-------------');
                }
            }
            catch (e) {
            }
            return false;
        }
    }
}
