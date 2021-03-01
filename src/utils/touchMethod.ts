import {BasicException} from "./exceptions";
import {LogUtils} from "./logUtils";

export class TouchMethod {
    /**
     * @returns 返回点击屏幕输入的方法
     * str: 需要点击的数字转化成的字符串，支持0~9和.
     * coordMap: 触摸事件需要的相关的坐标Map，可以使用src/static/inputCoordinates.ts下get方法获得
     */
    public static getTouchMethod(): any {

        return async (client: any, str: string, coorMap: Map<string, any>) => {
            let x:string = '';
            let y:string = '';
            let arrList: string[] = str.split('');
            for (let char of arrList) {
                try {
                    x = coorMap.get(char).x;
                    y = coorMap.get(char).y;
                }
                catch (e) {
                    LogUtils.log.error(new BasicException('A0001', '尝试使用触摸输入失败').toString());
                } finally {
                    await this.touchXY(client, Number.parseInt(x), Number.parseInt(y));
                }
            }
        }
    }

    /**
     * 在屏幕上点击(x, y) 绝对坐标, 并且等待300ms
     */
    private static async touchXY(client: any, x: number, y: number) {
        await client.touchAction([{
                action: 'tap',
                x: x,
                y: y
            }]
        );
        await client.pause(300);  // 等待触摸事件反应事件
    }

}