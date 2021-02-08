const deviceName:string = 'a8';
// const deviceName:string = 'elo';

export class DeviceName {
    public static getDeviceName():string {
        return deviceName;
    }
}

export enum DeviceNameEnum {
    a8,
    elo
}
