"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchAction = void 0;
const driver_1 = require("../driver");
const Position_1 = require("../utils/Position");
const LogUtils_1 = require("../utils/LogUtils");
const RefundOrder_1 = require("./RefundOrder");
const GlobalUtil_1 = require("../utils/GlobalUtil");
class TouchAction {
    //输入手机号
    static async phoneNum(client, num) {
        await this.sleep(2000);
        for (let i = 0; i < num.length; i++) {
            let n = await client.$('//android.view.View[@content-desc="' + num.charAt(i) + '"]');
            await n.click();
        }
    }
    //输入权限码
    static async input(client) {
        try {
            let num = GlobalUtil_1.GlobalUtil.map.get('backGoods');
            let strings = Object.keys(num);
            LogUtils_1.LogUtils.log.info('-----------------输入授权码-------------');
            for (const s of strings) {
                let a = num.charAt(Number.parseInt(s));
                if (a == "0") {
                    await client.touchAction([{
                            action: 'tap',
                            x: this.ArrPath[9].x,
                            y: this.ArrPath[9].y
                        }]);
                }
                else {
                    let num = Number.parseInt(a);
                    await client.touchAction([{
                            action: 'tap',
                            x: this.ArrPath[num - 1].x,
                            y: this.ArrPath[num - 1].y
                        }]);
                }
            }
            let con = await client.$('//android.widget.Button[@content-desc="确定"]');
            con.click();
            await client.pause(1000);
        }
        catch (e) {
            LogUtils_1.LogUtils.log.info(e);
            LogUtils_1.LogUtils.log.info('订单退货输入授权码时出错----------');
            try {
                LogUtils_1.LogUtils.log.info("监测是否为不支持供应商错误");
                if (await client.isElementDisplayed((await client.$('//android.view.View[@content-desc="退货信息预查询失败，订单支付行包含指定支付供应商, 不支持退货"]')).elementId)) {
                    // let tip = await client.$('//android.view.View[@content-desc="退货信息预查询失败，订单支付行包含指定支付供应商, 不支持退货"]');
                    let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
                    await confirm.click();
                    await client.pause(500);
                    let back = await client.$('//android.widget.Button[@content-desc="arrow back "]');
                    await back.click();
                    RefundOrder_1.RefundOrder.isFind = true;
                    LogUtils_1.LogUtils.log.info('-----------------订单支付行包含指定支付供应商, 不支持退货-------------');
                }
            }
            catch (e) {
                LogUtils_1.LogUtils.log.info("不是支持供应商的错误");
            }
        }
    }
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
        strings.forEach(s => {
            console.log(s1.charAt(Number.parseInt(s)));
            let a = s1.charAt(Number.parseInt(s));
            if (a == "0") {
                this.touchAction(Position_1.Position.returnAuthorization[9].x, Position_1.Position.returnAuthorization[9].y);
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
//退货密码输入按键
TouchAction.ArrPathGood = [
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
