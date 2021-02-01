import {logger, LogUtils} from "../utils/LogUtils";
import {Search} from "./Search";
import {TouchAction} from "./TouchAction";
import {GlobalUtil} from "../utils/GlobalUtil";
import {ScreenShotUtil} from "../utils/ScreenShotUtil";

export class RefundOrder {

    public static isFind:boolean = false;

    public static async refundfirst(client:any,orderNo:string){
        //  点击第一项
        let codeNo = await client.$('//android.view.View[@content-desc='+orderNo+']');
        await client.pause(500);
        await codeNo.click();
        await client.pause(1000);
        //    点击申请退货
        let apply = await client.$('//android.widget.Button[@content-desc="申请退货"]');
        await client.pause(500);
        await apply.click();
        await client.pause(1000);

        //    点击确认退货
        let reConfirm = await client.$('//android.widget.Button[@content-desc="确认"]');
        await client.pause(500);
        await reConfirm.click();
        await client.pause(1000);
    }

    public static async refundlast(client:any){

        //    确认
        let confirm = await client.$('//android.widget.Button[@content-desc="确认"]');
        confirm.click();
        await client.pause(1000);

        //    最后一次提示是否确认退货
        let lastConfirm = await client.$('//android.widget.Button[@content-desc="确定"]');
        lastConfirm.click();
        await client.pause(1000);

        //  打印订单耗时
        await client.pause(2000);
        //    确认提示
        let tip = await client.$('//android.widget.Button[@content-desc="确定"]');
        await client.pause(500);
        tip.click();
        //    第二次打印
        // client.setImplicitTimeout(5000);
        await client.pause(2000);
        //    点击返回
        let back = await client.$('//android.widget.Button[@content-desc="返回"]');
        await client.pause(500);
        await back.click();
        await client.pause(1000);
        let finish = await client.$('//android.widget.Button[@content-desc="完成"]');
        await client.pause(500);
        await finish.click();

        await client.setImplicitTimeout(1000);

        await client.pause(1000);
        let menu2 = await client.$('//android.widget.Button[@content-desc="menu "]');
        await menu2.click();
        await client.pause(1000);

        let chooseSale = await client.$('//android.widget.Button[@content-desc="home 销售作业"]');
        await chooseSale.click();
        await client.pause(1000);
    }

    public static async inputOneToE(orderNo:string,client:any) {

            let number: string = GlobalUtil.map.get('backGoods');
            for (let n = 0; n < number.length; n++) {
                let i = number.charAt(n);
                if (i === '1') {
                    let one = await client.$('(//android.view.View[@content-desc="1"])[3]');
                    if (await client.isElementDisplayed(one.elementId)) {
                        await client.pause(500);
                        one.click();
                        await client.pause(1000);
                    } else {
                        logger.error('没找到元素');
                    }

                } else {
                    let it = await client.$('//android.view.View[@content-desc=' + i + ']');
                    if (await client.isElementDisplayed(it.elementId)) {
                        await client.pause(500);
                        it.click();
                        await client.pause(500);
                    } else {
                        logger.error('没找到元素');
                    }
                }
            }
        }


    /**
     * 当日订单退款
     * @author Daniel_Li
     * @param client
     * @param orderNo
     */
    // @ts-ignore
    public static async refundOrderToday(client:any,orderNo:string){
        LogUtils.log.info("====对订单"+orderNo+"进行当日整单退款操作=====");
        //查询订单,并判断是否成功
        await Search.searchNo(client,orderNo);
        try{

            await RefundOrder.refundfirst(client, orderNo);
            //判断授权码
                //    请输入授权码
                try {
                    logger.info('输入授权码');
                    await client.pause(1000);
                    await RefundOrder.inputOneToE(orderNo, client);
                }catch (e){
                    logger.error('-----------------输入授权码出错2------------');
                }
            logger.info("授权码填写结束-----------")

            if (!RefundOrder.isFind){
                let confirmTip = await client.$('//android.widget.Button[@content-desc="确定"]');
                confirmTip.click();
                await client.pause(1000);
             await RefundOrder.refundlast(client);
            }
        }catch (e){
            logger.error("----------控件元素未找到--退货程序执行失败--重新启动"+"----------")

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
        LogUtils.log.info("====对订单"+orderNo+"进行当日整单退款操作=====");
        //查询订单,并判断是否成功
        await Search.searchNo(client,orderNo);

            // 查询成功，执行退款操作
            try{
                await RefundOrder.refundfirst(client, orderNo);
                await RefundOrder.refundlast(client);
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



    /**
     * 隔日订单部分退款
     * @param client
     * @param orderNo
     */
    // @ts-ignore
    public static async refundBeforeOrderPart(client: WebdriverIOAsync.BrowserObject,orderNo:string){
        LogUtils.log.info("====对订单"+orderNo+"进行隔日部分退款操作=====");
        //查询订单
       await Search.searchNo(client,orderNo);

            try{
                let re=await client.$('//android.widget.Button[@content-desc="申请退货"]');
                await re.click();
                let ok1=await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
                await ok1.click();
                // 输入瑞华的固定密码
                let fixedpwd=await client.$('//android.view.View[@content-desc="固定密码"] ');
                await fixedpwd.click();
                LogUtils.log.info("====输入固定密码====");
                let pwd:string=GlobalUtil.map.get('returnGoodPassword');
                let pwdok=await client.$('//android.view.View[@content-desc="确定"]');
                LogUtils.log.info("====配置文件中的退款固定密码为："+pwd);
                await TouchAction.touchPasswordAction(client,pwd);
                await pwdok.click();

                let ok2=await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
                await ok2.click();
                //输入要退款的金额
                let canrefundMoney=await  client.findElements('xpath','//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[19]/android.widget.EditText[1]');



                let ok3=await client.$('//android.widget.Button[@content-desc="确认"]');
                await ok3.click();
                let ok4=await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
                await ok4.click();
                //退积分中
                try {
                    let  refund= await client.$('//android.view.View[@content-desc="退积分..."]');
                    while (true){
                        await client.isElementDisplayed(refund.elementId);
                    }
                }catch (e) {
                }
                LogUtils.log.info("====订单"+orderNo+"隔日部分退款成功");
                return true;
            }catch (e) {
                LogUtils.log.info("====该笔订单查询失败或退款失败");
                await ScreenShotUtil.takeScreenShot(client,orderNo);
                return false;
            }
        }



}
