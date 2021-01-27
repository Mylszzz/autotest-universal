"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenShotUtil = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ScreenShotUtil {
    /**
     * 截屏
     * @param client
     */
    // @ts-ignore
    static async takeScreenShot(client, orderNo) {
        let screenshot = await client.takeScreenshot();
        //console.log(screenshot);
        //定义生成图片的路径
        let path1 = '../../errorScreenShot/' + new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + '-' + Date.now() + '-' + orderNo + '.png';
        // @ts-ignore
        let buffer = Buffer.from(screenshot, 'base64'); //把base64的字符串转成buffer对象
        //运用fs对象写文件
        fs.writeFileSync(path.join(__dirname, path1), buffer);
    }
}
exports.ScreenShotUtil = ScreenShotUtil;
