import {SingleDriver} from "./driver";
import {LoginAction, LogoutAction, RefreshAction, UploadLogAction} from "./testactions/deviceActions";
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
        退货模块
         */

        if(generalSettings.enableRefundModule){
            LogUtils.log.info("开始进行退货测试");
            let refundAction = new RefundAction(this.client);
            await refundAction.refundProcess();
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

        /*
        退出登录
         */
        if (generalSettings.enableLogoutModule) {
            await LogoutAction.accountLogout(this.client);
        }
    }
}



Main.runScript('elo');  // a8 或者 elo
