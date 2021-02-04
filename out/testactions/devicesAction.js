"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutAction_elo = void 0;
const LogUtils_1 = require("../utils/LogUtils");
const Position_1 = require("../utils/Position");
class LogoutAction_elo {
    constructor(client) {
        this.client = client;
    }
    async accountLogout() {
        let contactBtn = await this.client.$('//android.widget.Button[@content-desc="contact"]');
        await contactBtn.click();
        await this.client.pause(500);
        // 以坐标形式点击退出账号按钮
        await this.client.touchAction([
            {
                action: 'tap',
                x: Position_1.Position.exit_account[0].x,
                y: Position_1.Position.exit_account[0].y,
            },
        ]);
        await this.client.touchAction([
            {
                action: 'tap',
                x: Position_1.Position.exit_account[1].x,
                y: Position_1.Position.exit_account[1].y,
            },
        ]);
        try {
            await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            LogUtils_1.LogUtils.log.info("=====账号登出--》手动登出符合预期==");
        }
        catch (e) {
            LogUtils_1.LogUtils.log.info("=====账号登出--》手动登出不符合预期==");
        }
    }
    // 退出系统
    async sysLogout() {
        let menu = await this.client.$('//android.widget.Button[@content-desc="menu"]');
        await menu.click();
        await this.client.pause(1000);
        let sysLogout = await this.client.$('//android.widget.Button[@content-desc="退出程序"]');
        await sysLogout.click();
        await this.client.pause(1000);
    }
}
exports.LogoutAction_elo = LogoutAction_elo;
