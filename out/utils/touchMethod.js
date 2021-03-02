"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchMethod = void 0;
const exceptions_1 = require("./exceptions");
const logUtils_1 = require("./logUtils");
class TouchMethod {
    /**
     * @returns 返回点击屏幕输入的方法
     * str: 需要点击的数字转化成的字符串，支持0~9和.
     * coordMap: 触摸事件需要的相关的坐标Map，可以使用src/static/inputCoordinates.ts下get方法获得
     */
    static getTouchMethod() {
        return async (client, str, coorMap) => {
            let x = '';
            let y = '';
            let arrList = str.split('');
            for (let char of arrList) {
                try {
                    x = coorMap.get(char).x;
                    y = coorMap.get(char).y;
                }
                catch (e) {
                    logUtils_1.LogUtils.log.error(new exceptions_1.AutoTestException('A0001', '尝试使用触摸输入失败').toString());
                }
                finally {
                    await this.touchXY(client, Number.parseInt(x), Number.parseInt(y));
                }
            }
        };
    }
    /**
     * 在屏幕上点击(x, y) 绝对坐标, 并且等待300ms
     */
    static async touchXY(client, x, y) {
        await client.touchAction([{
                action: 'tap',
                x: x,
                y: y
            }]);
        await client.pause(300); // 等待触摸事件反应事件
    }
}
exports.TouchMethod = TouchMethod;
