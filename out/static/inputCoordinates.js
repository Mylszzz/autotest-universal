"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputCoordinates = void 0;
const deviceName_1 = require("./deviceName");
/**
 * 键盘输入需要的绝对坐标类
 * @field coordMap:
 * A8
 */
class InputCoordinates_A8 {
    constructor() {
        this.coordMap = new Map([
            ['1', { x: 78, y: 810 }],
            ['2', { x: 270, y: 787 }],
            ['3', { x: 450, y: 829 }],
            ['4', { x: 88, y: 957 }],
            ['5', { x: 270, y: 954 }],
            ['6', { x: 450, y: 954 }],
            ['7', { x: 93, y: 1076 }],
            ['8', { x: 270, y: 1038 }],
            ['9', { x: 450, y: 1038 }],
            ['0', { x: 364, y: 1206 }],
            ['.', { x: 84, y: 1194 }]
        ]);
    }
    getCoordMap() {
        return this.coordMap;
    }
}
/**
 * 键盘输入需要的绝对坐标类
 * Elo
 */
class InputCoordinates_Elo {
    constructor() {
        this.coordMap = new Map([
            ['1', { x: 1421, y: 691 }],
            ['2', { x: 1563, y: 691 }],
            ['3', { x: 1706, y: 691 }],
            ['4', { x: 1421, y: 805 }],
            ['5', { x: 1563, y: 805 }],
            ['6', { x: 1706, y: 805 }],
            ['7', { x: 1421, y: 915 }],
            ['8', { x: 1563, y: 915 }],
            ['9', { x: 1706, y: 915 }],
            ['0', { x: 1417, y: 1021 }],
            ['.', { x: 1632, y: 1033 }]
        ]);
        this.coordMapForRedundPwd = new Map([
            ['1', { x: 744, y: 595 }],
            ['2', { x: 888, y: 595 }],
            ['3', { x: 1031, y: 595 }],
            ['4', { x: 744, y: 705 }],
            ['5', { x: 888, y: 705 }],
            ['6', { x: 1031, y: 705 }],
            ['7', { x: 744, y: 815 }],
            ['8', { x: 888, y: 815 }],
            ['9', { x: 1031, y: 815 }],
            ['0', { x: 956, y: 922 }]
        ]);
    }
    getCoordMap() {
        return this.coordMap;
    }
    getCoordMapForRedundPwd() {
        return this.coordMapForRedundPwd;
    }
}
/**
 * 如果需要获得坐标Map, 请直接调用此getCoordMap()方法
 */
class InputCoordinates {
    constructor() {
    }
    static getCoordMap() {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && (this.instance == null)) {
            this.instance = new InputCoordinates_A8();
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && (this.instance == null)) {
            this.instance = new InputCoordinates_Elo();
        }
        return this.instance.getCoordMap();
    }
    static getCoordMapForRedundPwd() {
        if (deviceName_1.DeviceName.getDeviceName() == 'elo' && (this.instance == null)) {
            this.instance = new InputCoordinates_Elo();
        }
        try {
            return this.instance.getCoordMapForRedundPwd();
        }
        catch (e) {
        }
    }
}
exports.InputCoordinates = InputCoordinates;
