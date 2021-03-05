
export class DeviceName {
    private static deviceName: string = 'a8';

    public static getDeviceName(): string {
        return this.deviceName;
    }

    public static setDeviceName(deviceName: string): void {
        this.deviceName = deviceName;
    }
}
