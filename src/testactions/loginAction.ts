
import {LogUtils} from "../utils/LogUtils";
import {GlobalUtil} from "../utils/GlobalUtil";
import {ReadCSV} from "../utils/ReadCSV";
// import {GlobalUtil} from "../utils/GlobalUtil";

export class LoginAction{

    public static async Login(client: WebdriverIOAsync.BrowserObject){
        await client.pause(15000);
            try {
                LogUtils.log.info("====开始进行商户登录===");
                //账号
                let usernameText =  await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
                await usernameText.clearValue();
                await client.pause(1000);
                await usernameText.setValue("ht202011190002802");  //TODO
                await client.pause(1000);
                //密码
                let passwordText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
                await client.pause(1000);
                await passwordText.setValue("Pp88888888");  //TODO
                await client.pause(1000);
                //登录按钮
                let loginBtn = await client.$('//android.widget.Button[@content-desc="登录"]');
                await client.pause(1000);
                await loginBtn.click();
                GlobalUtil.init();



                try {
                    let ele = await client.$('//android.view.View[@content-desc="正在登陆,请稍后...."]');
                    LogUtils.log.info(await ele.getAttribute("content-desc"));
                    let eleJudge:boolean = true;
                    while (eleJudge){
                        eleJudge = await client.isElementDisplayed(ele.elementId);
                    }
                    // await Arr.judgeIsExit(client,ele);
                }catch (e){
                }finally {
                    try {
                       await client.pause(1000);
                       // let name = await client.$('//android.view.View[@content-desc="货号:' + Message.storeNumber + '"]');
                       // if (!await client.isElementDisplayed(name.elementId)){
                       //     throw new Error('错误');
                       // }
                       //  LogUtils.log.info('登陆成功---');

                    }catch (e){
                        // await client.startActivity(Message.appPackageName,Message.appActivityName);
                        // LogUtils.log.error("--------由于网络原因--设备重新启动了！！！！")
                        // await LoginAction.Login(client);
                    }
                }

            }catch (e) {
                // await client.startActivity(Message.appPackageName,Message.appActivityName);
                // console.log("-----------------登陆程序出错--重新启动了！！！！");
                // await LoginAction.Login(client);
            }
    }

}
