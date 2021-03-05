import {SingleDriver} from "./driver";
import {LoginAction, RefreshAction, UploadLogAction} from "./testactions/deviceActions";
import {GlobalUtil} from "./utils/globalUtil";
import {LogUtils} from "./utils/logUtils";
import {DeviceName} from "./static/deviceName";
import {SaleMainLoop} from "./testactions/sale/saleMainLoop";
import {RefundAction} from "./testactions/refund/refundAction";
import {generalSettings} from "./static/settings";


class Main {
    private static client: any;

    public static async runScript(deviceName: string) {
        DeviceName.setDeviceName(deviceName);

        /*
        读取机器配置到configMap中
         */
        GlobalUtil.init();

        /*
        创建对应机器的webdriverio.BrowserObject对象
         */
        LogUtils.log.info("开始创建client");
        this.client = await SingleDriver.createClient();
        LogUtils.log.info("成功创建[" + deviceName + "]client");

        /*
        登录模块
         */
        if (generalSettings.enableLoginModule) {
            await LoginAction.login(this.client);
        }

        /*
        销售模块
         */
        if (generalSettings.enableSaleModule) {
            LogUtils.log.info("开始进行销售测试");
            await SaleMainLoop.salePreparation(this.client);
            await SaleMainLoop.saleMainLoop();
            LogUtils.log.info("销售测试完成")
        }

        /*
        上传日志
         */
        if (generalSettings.enableUploadLogModule) {
            await UploadLogAction.uploadTodayLogAction(this.client);
        }

        /*
        刷新店铺
         */
        if (generalSettings.enableRefreshModule) {
            await RefreshAction.refreshAction(this.client);
        }

    }
}

async function salesSettlement() {

    // await LogoutAction.accountLogout(client);
    //  await CancelReturns.cancelReturns(client);

    /*
     For Test Only
     测试打印屏幕上显示的销售信息
      */
    // await client.pause(30000);
    // console.log('------------测试：打印销售信息------------');
    // try {
    //     await ValidateOrderInfo.saveOrderInfoToCsv(client);
    // } catch (e) {
    //     console.log(e);
    // }


    /*
    退款
     */
    let refundAction = new RefundAction(client);
     await refundAction.refundProcess();
}


Main.runScript('a8');  // a8 或者 elo
