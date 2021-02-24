"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchAction = void 0;
const driver_1 = require("../driver");
const Position_1 = require("../utils/Position");
const GlobalUtil_1 = require("../utils/GlobalUtil");
class TouchAction {
    //输入手机号
    static async phoneNum(client, num) {
        for (let i = 0; i < num.length; i++) {
            let phoneNumber = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[8]/android.widget.EditText');
            await phoneNumber.clearValue();
            await client.pause(1000);
            await phoneNumber.setValue(GlobalUtil_1.GlobalUtil.map.get('vipPhone'));
            await client.pause(1000);
            let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm.click();
            await client.pause(3000);
        }
    }
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
        strings.forEach(s => {
            console.log(s1.charAt(Number.parseInt(s)));
            let a = s1.charAt(Number.parseInt(s));
            if (a == "0") {
                this.touchAction(Position_1.Position.returnAuthorization[9].x, Position_1.Position.returnAuthorization[9].y);
            }
            else if (a == ".") {
                this.touchAction(Position_1.Position.returnAuthorization[10].x, Position_1.Position.returnAuthorization[10].y);
            }
            else {
                let num = Number.parseInt(a);
                this.touchAction(Position_1.Position.returnAuthorization[num - 1].x, Position_1.Position.returnAuthorization[num - 1].y);
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
        for (let str of strings) {
            console.log("=====输入数字：" + s.charAt(Number.parseInt(str)));
            if (s.charAt(Number.parseInt(str)) == "0") {
                await client.touchAction([{
                        action: 'tap',
                        x: Position_1.Position.NumberPath[9].x,
                        y: Position_1.Position.NumberPath[9].y
                    }]);
            }
            else if (s.charAt(Number.parseInt(str)) == ".") {
                await client.touchAction([{
                        action: 'tap',
                        x: Position_1.Position.NumberPath[10].x,
                        y: Position_1.Position.NumberPath[10].y
                    }]);
            }
            else {
                let num = Number.parseInt(s.charAt(Number.parseInt(str)));
                await client.touchAction([{
                        action: 'tap',
                        x: Position_1.Position.NumberPath[num - 1].x,
                        y: Position_1.Position.NumberPath[num - 1].y
                    }]);
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
    { x: 90, y: 830 },
    { x: 270, y: 830 },
    { x: 450, y: 830 },
    { x: 90, y: 960 },
    { x: 270, y: 960 },
    { x: 450, y: 960 },
    { x: 90, y: 1080 },
    { x: 270, y: 1080 },
    { x: 450, y: 1080 },
    { x: 360, y: 1212 },
    { x: 90, y: 1220 } // .
];
//退货密码输入按键
TouchAction.ArrPathGood = [
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
