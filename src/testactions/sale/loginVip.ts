import {PhoneNum} from "../phoneNum";
import {GlobalUtil} from "../../utils/globalUtil";
import {LogUtils} from "../../utils/logUtils";

/**
 * A8
 */
export class VipLogin_A8 implements VipLogin {
    client: any;
    phoneNum: string;
    private static instance: VipLogin_A8;

    private constructor(client: any) {
        this.client = client;
        this.phoneNum = <string>GlobalUtil.getConfigMap().get('vipPhone');
    }

    /**
     * 获得VipLogin_A8的实例
     * @param client
     * @returns {VipLogin_A8}
     */
    public static getInstance(client: any): VipLogin_A8 {
        if (null == this.instance) {
            this.instance = new VipLogin_A8(client);
        }
        return this.instance;
    }

    public async vipLogin() {
        let vipBtn = await this.client.$('//android.view.View[@content-desc="请点击登录会员号码"]');
        await vipBtn.click();
        LogUtils.saleLog.info('******登录vip账号:'+this.phoneNum+'*******');
        //输入会员号码
        await PhoneNum.phoneNum(this.client, this.phoneNum);
        await this.client.pause(1000);
        //点击确定
        let okBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await okBtn.click();
        await this.client.pause(3000);
    }
}

/**
 * ELO
 */
export class VipLogin_Elo implements VipLogin {
    client: any;
    phoneNum: string;
    private static instance: VipLogin_Elo;

    private constructor(client: any) {
        this.client = client;
        this.phoneNum = <string>GlobalUtil.getConfigMap().get('vipPhone');
    }

    /**
     * 获得VipLogin_Elo的实例
     * @param client
     * @returns {VipLogin_Elo}
     */
    public static getInstance(client: any): VipLogin_Elo {
        if (null == this.instance) {
            this.instance = new VipLogin_Elo(client);
        }
        return this.instance;
    }

    public async vipLogin() {
        //输入会员号码
        await PhoneNum.phoneNum(this.client, this.phoneNum);
        await this.client.pause(1000);
        //点击确定
        let okBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await okBtn.click();
        await this.client.pause(3000);
    }
}

/**
 * Vip 登录的接口
 */
interface VipLogin {
    client: any;
    phoneNum: string;  // vip登录账号（电话号码）

    vipLogin(): void;  // vip登录脚本
}