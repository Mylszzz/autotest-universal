import {LogUtils} from "../../utils/logUtils";
import {GlobalUtil} from "../../utils/globalUtil";
import {DeviceName} from "../../static/deviceName";
import {TouchMethod} from "../../utils/touchMethod";
import {InputCoordinates} from "../../static/inputCoordinates";
import * as wdio from "webdriverio";
import {ButtonXPaths_A8, ButtonXPaths_Elo} from "../../static/buttonXPaths";
import {ViewXpaths_ELO, ViewXPaths_A8} from "../../static/viewXpaths";

const deviceName: string = DeviceName.getDeviceName();


/**
 * 进行订单退货流程
 */
export class RefundOrder {

    public static isFind: boolean = false;

    /**
     * 输入密码前的操作
     * @param client
     * @param confirm 确认按钮
     */
    public static async refundFirst(client: any, orderText: string, confirm: string) {
        //    点击申请退货
        await client.pause(2000)
        let apply = await client.$(orderText);
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
    public static async refundThen(client: any, confirm: string, determine: string) {
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
     * @param determine 确定按钮
     * @param number    密码
     */
    public static async refundPass(client: any, determine: string, number: string) {
        await client.pause(1000);
        //输入密码
        if (deviceName == 'a8') {
            let touchFun = TouchMethod.getTouchMethod();
            await touchFun(client, number, InputCoordinates.getCoordMap());  // A8退款使用A8通用坐标Map

        } else if (deviceName == 'elo') {
            let touchFun = TouchMethod.getTouchMethod();
            await touchFun(client, number, InputCoordinates.getCoordMapForRedundPwd());  // Elo退款坐标
        }
        LogUtils.log.info("******授权码填写结束******");
        //密码确定
        let confirmTip = await client.$(determine);
        await confirmTip.click();
        await client.pause(1000);
    }


    /**
     * 完成退货后的操作
     * @param client
     * @param menu  菜单栏
     * @param home    销售主页
     */
    public static async refundOk(client: any, menu: string, home: string) {
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
     * @author lina
     * @param client
     * @param orderNo   订单号
     */
    public static async refundOrderToday(client: any, orderNo: string) {
        LogUtils.log.info("******对订单" + orderNo + "进行当日整单退款操作(今日)******");
        await client.pause(1000);
        await RefundOrder.refundFirst(client, ButtonXPaths_A8.ORDERTEXT, ButtonXPaths_A8.CONFIRM);
        // 输入退货的固定密码
        LogUtils.log.info("请输入授权码");
        let number: string = <string>await GlobalUtil.getConfigMap().get('backGoods');
        await this.refundPass(client, ButtonXPaths_A8.DETERMINE, number);
        try {
            let element = await client.findElements("xpath", ViewXPaths_A8.MESSAGE);
            if (element.length != 0 && typeof element == "object") {
                let determine1 = await client.$(ButtonXPaths_A8.DETERMINE);
                await determine1.click();
                await client.pause(500);
                let back1 = await client.$(ButtonXPaths_A8.BACK);
                await back1.click();
                LogUtils.log.info('********订单支付行包含指定支付供应商, 不支持退货********');
                return false;
            } else {
                LogUtils.log.info('********订单支付行支持退货********');
                let confirmTip1 = await client.$(ButtonXPaths_A8.DETERMINE);
                await confirmTip1.click();
                await client.pause(1000);
                await this.refundThen(client, ButtonXPaths_A8.CONFIRM, ButtonXPaths_A8.DETERMINE);
                //  打印订单耗时
                let tip = await client.$(ButtonXPaths_A8.DETERMINE);
                await client.pause(1000);
                await tip.click();
                await client.pause(6000);
                LogUtils.refundLog.info('更改退货成功');
                //    点击返回
                let back = await client.$(ButtonXPaths_A8.RETURN);
                await client.pause(1000);
                await back.click();
                await client.pause(1000);
                await this.refundOk(client, ButtonXPaths_A8.MENU, ButtonXPaths_A8.HOME);
                return true;
            }
        } catch (e) {
            //   this.refundException(client, ButtonXPaths_A8.DETERMINE, ButtonXPaths_A8.BACK, ViewXPaths_A8.MESSAGE);
            return false;
        }
    }

    /**
     * 订单隔日整单退款
     * @author Lina
     * @param client
     * @param orderNo 订单号
     */

    public static async refundBeforeOrder(client: any, orderNo: string) {
        LogUtils.log.info("******对订单" + orderNo + "进行当日整单退款操作（隔日）******");
        // 查询成功，执行退款操作
        await client.pause(1000);
        await this.refundFirst(client, ButtonXPaths_A8.ORDERTEXT, ButtonXPaths_A8.CONFIRM);
        try {
            let element = await client.findElements("xpath", ViewXPaths_A8.MESSAGE);
            if (element.length != 0 && typeof element == "object") {
                let determine1 = await client.$(ButtonXPaths_A8.DETERMINE);
                await determine1.click();
                await client.pause(500);
                let back1 = await client.$(ButtonXPaths_A8.BACK);
                await back1.click();
                LogUtils.log.info('********订单支付行包含指定支付供应商, 不支持退货********');
                return false;
            } else {
                LogUtils.log.info('********订单支付行支持退货********');
                await this.refundThen(client, ButtonXPaths_A8.CONFIRM, ButtonXPaths_A8.DETERMINE);
                //  打印订单耗时
                let tip = await client.$(ButtonXPaths_A8.DETERMINE);
                await client.pause(1000);
                tip.click();
                await client.pause(6000);
                //  return true;
                LogUtils.refundLog.info('订单退货成功');
                //    点击返回
                let back = await client.$(ButtonXPaths_A8.RETURN);
                await client.pause(1000);
                await back.click();
                await client.pause(1000);
                await this.refundOk(client, ButtonXPaths_A8.MENU, ButtonXPaths_A8.HOME);
                LogUtils.refundLog.info("====订单" + orderNo + "隔日整单退款成功");
                return true;
            }
        } catch (e) {

        }

    }
}

/**
 * A8直接继承
 */
export class RefundOrder_a8 extends RefundOrder {

}

/**
 * ELO因为方法操作的流程不一样，需要重写一部分。
 */
export class RefundOrder_elo extends RefundOrder {

    /**
     * 当日订单退款
     * @author lina
     * @param client
     * @param orderNo   订单号
     */
    public static async refundOrderToday(client: any, orderNo: string) {
        LogUtils.log.info("******对订单" + orderNo + "进行当日整单退款操作(今日)******");
        try {
            await this.refundFirst(client, ButtonXPaths_Elo.ORDERTEXT, ViewXpaths_ELO.DETERMINE);
            // 输入退货的固定密码
            let fixedpwd = await client.$('//android.view.View[@content-desc="固定密码"] ');
            await fixedpwd.click();
            let number: string = <string>await GlobalUtil.getConfigMap().get('backGoods');
            await this.refundPass(client, ButtonXPaths_Elo.DETERMINE, number);
            //提示确定
            let confirmTip1 = await client.$(ViewXpaths_ELO.DETERMINE);
            await confirmTip1.click();
            await client.pause(1000);
            await this.refundThen(client, ButtonXPaths_Elo.CONFIRM, ViewXpaths_ELO.DETERMINE);
            //  打印订单耗时
            await client.pause(10000);
            await this.refundOk(client, ButtonXPaths_Elo.MENU, ButtonXPaths_Elo.HOME);
            return true;
        } catch (e) {

            return false;
        }
    }

    /**
     * 订单隔日整单退款
     * @author Lina
     * @param client
     * @param orderNo 订单号
     */
    public static async refundBeforeOrder(client: any, orderNo: string) {
        LogUtils.log.info("******对订单" + orderNo + "进行当日整单退款操作（隔日）******");
        try {
            await this.refundFirst(client, ButtonXPaths_Elo.ORDERTEXT, ButtonXPaths_Elo.CONFIRM);
            await this.refundThen(client, ButtonXPaths_Elo.CONFIRM, ViewXpaths_ELO.DETERMINE);
            let number: string = <string>await GlobalUtil.getConfigMap().get('backGoods2');
            await this.refundPass(client, ButtonXPaths_Elo.DETERMINE, number);
            await client.pause(10000);
            LogUtils.log.info("******订单" + orderNo + "隔日整单退款成功******");
            await this.refundOk(client, ButtonXPaths_Elo.MENU, ButtonXPaths_Elo.HOME);
            return true;
        } catch (e) {

            return false;
        }
    }
}
