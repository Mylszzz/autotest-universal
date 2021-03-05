import * as wdio from 'webdriverio';
import {Options} from 'webdriver';
import {DeviceName} from "./static/deviceName";
import {DriverConfig} from "./static/driverConfig";



export class SingleDriver {
    private static client: wdio.BrowserObject;

    /**
     * 1.声明一个空的变量 client
     * 2.提供静态方法，如果 clietn 为 null，就创建一个新的 client 对象并返回
     * 3.每次创建的是返回的都是同一个实例。
     */

    public static async createClient(): Promise<wdio.BrowserObject> {
        if (!this.client) {
            if (DeviceName.getDeviceName() == 'a8') {
                this.client = await wdio.remote(DriverConfig.config_a8);
            } else if (DeviceName.getDeviceName() == 'elo') {
                this.client = await wdio.remote(DriverConfig.config_elo);
            }

        }
        return this.client;
    }
}
