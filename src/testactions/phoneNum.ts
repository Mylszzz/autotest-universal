/**
 * 提供输入手机号的方法
 */
export class PhoneNum {

    //输入手机号
    public static async phoneNum(client: any, num: string) {
        await client.pause(2000);
        for (let i = 0; i < num.length; i++) {
            let n = await client.$('//android.view.View[@content-desc="' + num.charAt(i) + '"]');
            await n.click();
            await client.pause(300);
        }
    }
}
