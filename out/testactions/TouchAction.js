"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchAction = void 0;
const driver_1 = require("../driver");
const position_1 = require("../utils/position");
class TouchAction {
    //输入手机号
    static async phoneNum(client, num) {
        await client.pause(2000);
        for (let i = 0; i < num.length; i++) {
            let n = await client.$('//android.view.View[@content-desc="' + num.charAt(i) + '"]');
            await n.click();
            await client.pause(300);
        }
    }
    //点击绝对坐标控件
    /**
     * @deprecated
     */
    static async touchAction(x, y) {
        let client = await driver_1.SingleDriver.createClient();
        client.setImplicitTimeout(10000);
        await client.touchAction([{
                action: 'tap',
                x: x,
                y: y
            }]);
        //await browser.touchUp(x,y);
    }
    // /**
    //  * 输入退款密码
    //  * @param client
    //  * @param s1
    //  */
    // public static async touchPasswordAction(client:WebdriverIO.BrowserObject,s1: string) {
    //     let strings = Object.keys(s1);
    //     await strings.forEach(s=>{
    //         console.log(s1.charAt(Number.parseInt(s)));
    //         let a=s1.charAt(Number.parseInt(s));
    //         if (a=="0"){
    //             this.touchAction(this.ArrPath[9].x,this.ArrPath[9].y);
    //
    //         }else if (a=="."){
    //
    //         }else {
    //             let num:number=Number.parseInt(a);
    //             this.touchAction(this.ArrPath[num-1].x,this.ArrPath[num-1].y);
    //
    //         }
    //     });
    // }
    // public static async touchPasswordAction1(client:WebdriverIO.BrowserObject,s1: string) {
    //     let strings = Object.keys(s1);
    //     await strings.forEach(s=>{
    //         console.log(s1.charAt(Number.parseInt(s)));
    //         let a=s1.charAt(Number.parseInt(s));
    //         if (a=="0"){
    //             this.touchAction(this.ArrPath1[9].x,this.ArrPath1[9].y);
    //         }else if (a=="."){
    //
    //         }else {
    //             let num:number=Number.parseInt(a);
    //             this.touchAction(this.ArrPath1[num-1].x,this.ArrPath1[num-1].y);
    //         }
    //     });
    // }
    /**
     * 输入价格
     * @param client
     * @param s
     */
    static async touchPriceAction(client, s) {
        // await client.setImplicitTimeout(2000);
        let strings = await Object.keys(s);
        let key = s.charAt(strings);
        for (let str of strings) {
            console.log("=====输入数字：" + s.charAt(Number.parseInt(str)));
            if (s.charAt(Number.parseInt(str)) == "0") {
                await client.touchAction([{
                        action: 'tap',
                        x: this.ArrPath[9].x,
                        y: this.ArrPath[9].y
                    }]);
            }
            else if (key == '.') {
                await client.touchAction([
                    {
                        action: 'tap',
                        x: 84,
                        y: 1194
                    },
                ]);
                await client.pause(500);
            }
            else {
                let keydd = Number(key);
                await client.touchAction([
                    {
                        action: 'tap',
                        x: this.ArrPath[keydd - 1].x,
                        y: this.ArrPath[keydd - 1].y
                    },
                ]);
                await client.pause(1000);
            }
        }
    }
    /**
     * 点击支付供应商
     * @param client
     * @param num
     */
    static async clickPay(client, num) {
        await client.touchAction([
            {
                action: 'tap',
                x: position_1.Position.pay[num - 1].x,
                y: position_1.Position.pay[num - 1].y
            }
        ]);
    }
}
exports.TouchAction = TouchAction;
// A8的价格、会员手机号和退货授权码输入按键绝对坐标
/**
 * @deprecated
 */
TouchAction.ArrPath = [
    { x: 78, y: 810 },
    { x: 270, y: 787 },
    { x: 450, y: 829 },
    { x: 88, y: 957 },
    { x: 270, y: 954 },
    { x: 450, y: 954 },
    { x: 93, y: 1076 },
    { x: 270, y: 1038 },
    { x: 450, y: 1038 },
    { x: 364, y: 1206 },
    { x: 84, y: 1194 },
];
// 价格输入按键
/**
 * @deprecated
 */
TouchAction.ArrPath1 = [
    { x: 744, y: 595 },
    { x: 888, y: 595 },
    { x: 1031, y: 595 },
    { x: 744, y: 705 },
    { x: 888, y: 705 },
    { x: 1031, y: 705 },
    { x: 744, y: 815 },
    { x: 888, y: 815 },
    { x: 1031, y: 815 },
    { x: 956, y: 922 },
];
