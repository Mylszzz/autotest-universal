"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchAction = void 0;
const driver_1 = require("../driver");
const Position_1 = require("../utils/Position");
class TouchAction {
    //输入手机号
    static async phoneNum(client, num) {
        await this.sleep(2000);
        for (let i = 0; i < num.length; i++) {
            let n = await client.$('//android.view.View[@content-desc="' + num.charAt(i) + '"]');
            await n.click();
        }
    }
    // //输入权限码
    //     public static async input(client: any,num:string) {
    //         for (let i = 0; i < num.length; i++) {
    //             if(num=="1"){
    //                 let n = await client.$('(//android.view.View[@content-desc="' + num.charAt(i) + '"])[3]');
    //                 await n.click();
    //             }else{
    //             let n = await client.$('//android.view.View[@content-desc="' + num.charAt(i) + '"]');
    //             await n.click();
    //             }
    //         }
    //         await client.pause(500);
    //         let con = await client.$('//android.widget.Button[@content-desc="确定"]');
    //         await client.pause(500);
    //         con.click();
    //         await client.pause(1000);
    //     }
    static async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms);
        });
    }
    //点击绝对坐标控件
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
    /**
     * 输入退款密码
     * @author Daniel_Li
     * @param client
     * @param s1
     */
    static async touchPasswordAction(client, s1) {
        let strings = Object.keys(s1);
        await strings.forEach(s => {
            console.log(s1.charAt(Number.parseInt(s)));
            let a = s1.charAt(Number.parseInt(s));
            if (a == "0") {
                this.touchAction(this.ArrPath[9].x, this.ArrPath[9].y);
            }
            else if (a == ".") {
            }
            else {
                let num = Number.parseInt(a);
                this.touchAction(this.ArrPath[num - 1].x, this.ArrPath[num - 1].y);
            }
        });
    }
    /**
     * 输入价格
     * @author Daniel_Li
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
                x: Position_1.Position.pay[num - 1].x,
                y: Position_1.Position.pay[num - 1].y
            }
        ]);
    }
}
exports.TouchAction = TouchAction;
//价格输入按键
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
