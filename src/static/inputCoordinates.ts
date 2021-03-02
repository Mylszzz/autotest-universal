import {DeviceName} from "./deviceName";

interface ICoordinatesMap {
    coordMap: Map<string, any>;

    getCoordMap(): Map<string, any>;
}

/**
 * 键盘输入需要的绝对坐标类
 * @field coordMap:
 * A8
 */
class InputCoordinates_A8 implements ICoordinatesMap {
    coordMap: Map<string, any>;

    public constructor() {
        this.coordMap = new Map([
            ['1', {x: 78, y: 810}],
            ['2', {x: 270, y: 787}],
            ['3', {x: 450, y: 829}],
            ['4', {x: 88, y: 957}],
            ['5', {x: 270, y: 954}],
            ['6', {x: 450, y: 954}],
            ['7', {x: 93, y: 1076}],
            ['8', {x: 270, y: 1038}],
            ['9', {x: 450, y: 1038}],
            ['0', {x: 364, y: 1206}],
            ['.', {x: 84, y: 1194}]
        ]);
    }

    public getCoordMap(): Map<string, any> {
        return this.coordMap;
    }
}

/**
 * 键盘输入需要的绝对坐标类
 * Elo
 */
export class InputCoordinates_Elo implements ICoordinatesMap {
    coordMap: Map<string, any>;  // 主数字键盘
    coordMapForRedundPwd:  Map<string, any>;  // 退款密码数字键盘

    public constructor() {
        this.coordMap = new Map([
            ['1', {x: 1421, y: 691}],
            ['2', {x: 1563, y: 691}],
            ['3', {x: 1706, y: 691}],
            ['4', {x: 1421, y: 805}],
            ['5', {x: 1563, y: 805}],
            ['6', {x: 1706, y: 805}],
            ['7', {x: 1421, y: 915}],
            ['8', {x: 1563, y: 915}],
            ['9', {x: 1706, y: 915}],
            ['0', {x: 1417, y: 1021}],
            ['.', {x: 1632, y: 1033}]
        ]);
        this.coordMapForRedundPwd = new Map([
            ['1', {x: 744, y: 595}],
            ['2', {x: 888, y: 595}],
            ['3', {x: 1031, y: 595}],
            ['4', {x: 744, y: 705}],
            ['5', {x: 888, y: 705}],
            ['6', {x: 1031, y: 705}],
            ['7', {x: 744, y: 815}],
            ['8', {x: 888, y: 815}],
            ['9', {x: 1031, y: 815}],
            ['0', {x: 956, y: 922}]
        ]);
    }

    public getCoordMap(): Map<string, any> {
        return this.coordMap;
    }

    public getCoordMapForRedundPwd(): Map<string, any> {
        return this.coordMapForRedundPwd;
    }

    /**
     * Elo退出账号关联坐标
     */
    public static getExitAccountCoor(): any{
        return [
            {x: 1693, y: 230},  // 退出账号按钮坐标
            {x: 948, y: 933},  // 确定
            {x: 948, y: 1025},  // 取消
];
    }
}

/**
 * 如果需要获得坐标Map, 请直接调用此getCoordMap()方法
 */
export class InputCoordinates {
    private static instance: InputCoordinates_A8|InputCoordinates_Elo;

    private constructor() {

    }

    public static getCoordMap(): Map<string, any> {
        if (DeviceName.getDeviceName() == 'a8' && (this.instance == null)) {
            this.instance = new InputCoordinates_A8();
        } else if (DeviceName.getDeviceName() == 'elo' && (this.instance == null)) {
            this.instance = new InputCoordinates_Elo();
        }
        return this.instance.getCoordMap();
    }

    public static getCoordMapForRedundPwd(): Map<string, any>|void {
        if (DeviceName.getDeviceName() == 'elo' && (this.instance == null)) {
            this.instance = new InputCoordinates_Elo();
        }
        try {
            return (<InputCoordinates_Elo>this.instance).getCoordMapForRedundPwd();
        } catch (e) {

        }
    }
}
