"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNum = void 0;
/**
 * 提供输入手机号的方法
 */
class PhoneNum {
    //输入手机号
    static async phoneNum(client, num) {
        await client.pause(2000);
        for (let i = 0; i < num.length; i++) {
            let n = await client.$('//android.view.View[@content-desc="' + num.charAt(i) + '"]');
            await n.click();
            await client.pause(300);
        }
    }
}
exports.PhoneNum = PhoneNum;
