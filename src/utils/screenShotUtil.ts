import * as fs from 'fs';
import * as path from "path";

export class ScreenShotUtil {

    /**
     * 截屏
     * @param client
     */
    // @ts-ignore
    public static async takeScreenShot(client: WebdriverIOAsync.BrowserObject,orderNo:string){
        let screenshot =await client.takeScreenshot();
        //console.log(screenshot);
        //定义生成图片的路径
        let path1='../../errorScreenShot/'+new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+'-'+Date.now()+'-'+orderNo+'.png';

        // @ts-ignore
        let buffer = Buffer.from(screenshot,'base64');//把base64的字符串转成buffer对象
        //运用fs对象写文件
        fs.writeFileSync(path.join(__dirname,path1),buffer);

    }

}
