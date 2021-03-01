import {logger, LogUtils} from "../../utils/logUtils";
import {Search_a8} from "../search";
import {Search_elo} from "../search";
import {TouchAction} from "../touchAction";
import {GlobalUtil} from "../../utils/globalUtil";
import {ScreenShotUtil} from "../../utils/screenShotUtil";
import {RefundBut_a8} from "../../static/refundButton";
import {RefundBut_elo} from "../../static/refundButton";
import {DeviceName} from "../../static/deviceName";
import {TouchMethod} from "../../utils/touchMethod";
import {InputCoordinates} from "../../static/inputCoordinates";

const deviceName:string = DeviceName.getDeviceName();
const refBtn_a8 = new RefundBut_a8();
const refBtn_elo = new RefundBut_elo();

/**
 * 进行订单退货流程
 */
export class RefundOrder {

    public static isFind:boolean = false;

    /**
     * 输入密码前的操作
     * @param client
     * @param confirm 确认按钮
     */
    public static async refundFirst(client:any,confirm:string){
        //    点击申请退货
        let apply = await client.$('//android.widget.Button[@content-desc="申请退货"]');
        await apply.click();
        await client.pause(1000);
        //    点击确认退货
        let reConfirm = await client.$(confirm);
        await reConfirm.click();
        await client.pause(1000);
    }

    /**
     * 输入密码后的操作
     * @param client
     * @param confirm 确认按钮
     * @param determine 确定按钮
     */
    public static async refundThen(client:any,confirm:string,determine:string) {
        let confirm1 = await client.$(confirm);
        await confirm1.click();
        await client.pause(1000);
        //    最后一次提示是否确认退货
        let lastConfirm = await client.$(determine);
        await lastConfirm.click();
        await client.pause(1000);
    }

    /**
     * 输入密码
     * @param client
     * @param determine
     * @param number
     */
    public static async refundPass(client:any,determine:string,number:string){
        await client.pause(1000);
        //输入密码
        console.log('以下是新的触摸方法的测试');
        if (deviceName == 'a8'){
            // TODO: 以下是新的触摸方法的测试
            let touchFun = TouchMethod.getTouchMethod();
            await touchFun(client, number, InputCoordinates.getCoordMap());  // A8退款使用A8通用坐标Map
            // await TouchAction.touchPasswordAction(client, number);

        }
        else if (deviceName == 'elo'){
            let touchFun = TouchMethod.getTouchMethod();
            await touchFun(client, number, InputCoordinates.getCoordMapForRedundPwd());  // Elo退款坐标
            // await TouchAction.touchPasswordAction1(client, number);
        }
        LogUtils.log.info("====授权码填写结束=====");
        //密码确定
        let confirmTip = await client.$(determine);
        await confirmTip.click();
        await client.pause(1000);
    }


    /**
     * 完成退货后的操作
     * @param client
     * @param menu
     * @param home
     */
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
        try{
            await RefundOrder.refundFirst(client,refBtn_a8.confirm);
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
            await tip.click();
            await client.pause(6000);
            LogUtils.refundLog.info('更改退货成功');
             //    点击返回
            let back = await client.$('//android.widget.Button[@content-desc="返回"]');
            await client.pause(1000);
            await back.click();
            await client.pause(1000);
            await RefundOrder.refundOk(client,refBtn_a8.menu,refBtn_a8.home);
            return true;
        }catch (e){
            this.refundException(client);
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
        // 查询成功，执行退款操作
        try{
            await RefundOrder.refundFirst(client,refBtn_a8.confirm);
            await RefundOrder.refundThen(client,refBtn_a8.confirm,refBtn_a8.determine);
            //  打印订单耗时
            let tip = await client.$('//android.widget.Button[@content-desc="确定"]');
            await client.pause(1000);
            tip.click();
            await client.pause(6000);
          //  return true;
            LogUtils.refundLog.info('mm');
            //    点击返回
            let back = await client.$('//android.widget.Button[@content-desc="返回"]');
            await client.pause(1000);
            await back.click();
            await client.pause(1000);
            await RefundOrder.refundOk(client,refBtn_a8.menu,refBtn_a8.home);
            LogUtils.log.info("====订单"+orderNo+"隔日整单退款成功");
            return true;
        }catch (e) {
            this.refundException(client);
            return false;
        }

        }

    /**
     * 供应商不支持退货异常的操作
     * @param client
     */
    public static async refundException(client:any){
            LogUtils.log.info("====该笔订单预查询失败或退款失败===");
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
        }

}


export class  RefundOrder_a8 extends RefundOrder{

}

export class RefundOrder_elo extends RefundOrder{

    public static async refundOrderToday(client:any,orderNo:string){
        LogUtils.log.info("====对订单"+orderNo+"进行当日整单退款操作(今日)=====");
        try{
            await RefundOrder.refundFirst(client,refBtn_elo.determine2);
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
            this.refundException(client);
            return false;
        }
    }

    // @ts-ignore
    public static async refundBeforeOrder(client: WebdriverIOAsync.BrowserObject,orderNo:string){
        LogUtils.log.info("====对订单"+orderNo+"进行当日整单退款操作（隔日）=====");
        try{
            await RefundOrder.refundFirst(client,refBtn_elo.confirm);
            await RefundOrder.refundThen(client,refBtn_elo.confirm,refBtn_elo.determine2);
            let number: string = await GlobalUtil.map.get('backGoods2');
            await RefundOrder.refundPass(client,refBtn_elo.determine,number);
            await client.pause(10000);
            LogUtils.log.info("====订单"+orderNo+"隔日整单退款成功");
            await RefundOrder.refundOk(client,refBtn_elo.menu,refBtn_elo.home);
            return true;
        }catch (e) {
            this.refundException(client);
            return false;
        }
    }
}
