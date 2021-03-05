
export class DeviceName {
    private static deviceName: string = '';

    public static getDeviceName(): string {
        return this.deviceName;
    }

    public static setDeviceName(deviceName: string): void {
        this.deviceName = deviceName;
    }
}
