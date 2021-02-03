import {Device_A8, Device_Elo} from "./loginUtil";
import {DeviceName} from "../../static/deviceName";


const deviceName:string = DeviceName.getDeviceName();  // a8或者elo

export class LoginAction {

    static async login(client:any) {
        let device:any;
        if (deviceName == 'a8') {
            device = new Device_A8(client);
        } else if (deviceName == 'elo') {
            device = new Device_Elo(client);
        }
        await client.setImplicitTimeout(20000);
        await device.getDeviceConfig();
        client.pause(1000);
        await device.loginProcess();
        client.pause(1000);
    }
}