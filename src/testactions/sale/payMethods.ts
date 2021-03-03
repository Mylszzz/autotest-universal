import {LogUtils} from "../../utils/logUtils";

/**
 * 获得支持的支付方式的名字
 * 单例模式
 */
export class PayMethods {
    private static payMethodsList: string[] = [];
    private static instance: PayMethods;

    private constructor() {

    }

    /**
     *
     * @param client
     * @returns {Promise<string[]>}
     */
    public static async getSupportedPayMethods(client:any) {
        if (null == this.instance) {
            this.instance = new PayMethods();
        }
        try {
            if (this.payMethodsList.length == 0) {
                await this.instance.processPayMethods(client);
            }
        } catch (e) {
            LogUtils.saleLog.error(e.toString());
        }
        return this.payMethodsList;
    }

    /**
     * 获得支持的支付方式的名字
     * @param client
     */
    private async processPayMethods(client:any) {

        let num:number = 0;
        let tabName = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=1]');
        let firstName = await tabName.getAttribute('content-desc');
        let name = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=last()]');
        let lastName = await name.getAttribute('content-desc');
        while (firstName !== lastName){
            num++;
            let tabName = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()='+num+']');
            firstName = await tabName.getAttribute("content-desc");
            PayMethods.payMethodsList.push(firstName);
        }
    }

}