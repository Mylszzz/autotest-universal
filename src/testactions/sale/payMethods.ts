import {LogUtils} from "../../utils/logUtils";


interface IPayMethods {
    payMethodsList: string[];

    processPayMethods(client:any):any;
}

/**
 * 获得支持的支付方式的名字
 * 单例模式
 */
export class PayMethods_A8 implements IPayMethods{
    payMethodsList: string[] = [];
    private static instance: PayMethods_A8;

    private constructor() {

    }

    /**
     *
     * @param client
     * @returns {Promise<string[]>}
     */
    public static async getSupportedPayMethods(client:any) {
        if (null == this.instance) {
            this.instance = new PayMethods_A8();
        }
        try {
            if (this.instance.payMethodsList.length == 0) {
                await this.instance.processPayMethods(client);
            }
        } catch (e) {
            LogUtils.saleLog.error(e.toString());
        }
        return this.instance.payMethodsList;
    }

    /**
     * 获得支持的支付方式的名字
     * @param client
     */
    async processPayMethods(client:any) {

        let num:number = 0;
        let tabName = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=1]');
        let firstName = await tabName.getAttribute('content-desc');
        let name = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=last()]');
        let lastName = await name.getAttribute('content-desc');
        while (firstName !== lastName){
            num++;
            let tabName = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()='+num+']');
            firstName = await tabName.getAttribute("content-desc");
            this.payMethodsList.push(firstName);
        }
    }
}

export class PayMethods_Elo implements IPayMethods{
    payMethodsList: string[] = [];
    private static instance: PayMethods_Elo;

    private constructor() {

    }

    /**
     *
     * @param client
     * @returns {Promise<string[]>}
     */
    public static async getSupportedPayMethods(client:any) {
        if (null == this.instance) {
            this.instance = new PayMethods_Elo();
        }
        try {
            if (this.instance.payMethodsList.length == 0) {
                await this.instance.processPayMethods(client);
            }
        } catch (e) {
            LogUtils.saleLog.error(e.toString());
        }
        return this.instance.payMethodsList;
    }

    /**
     * 获得支持的支付方式的名字
     * @param client
     */
    async processPayMethods(client:any) {


    }
}