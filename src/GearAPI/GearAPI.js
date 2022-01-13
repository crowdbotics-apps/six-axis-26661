import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid } from 'react-native';
import NotificationMessage, { NotificationMessageType } from './NotificationMessage';
import buffer from 'buffer';

const Buffer = buffer.Buffer;
class GearAPIManager {

    // Public properties
    warningsEnabled; communicationLog;

    // Private properties
    #manager; #events; #writers; #vibrateOFF; #isInProximity;

    // Private methods
    #RequestPermission; #ApplyCallback; #HandleResponseMessage; #IsSupportedDevice;

    constructor() {
        this.#manager = new BleManager();
        this.#writers = {};
        this.#vibrateOFF = true;
        this.#isInProximity = null;
        this.#events = {
            onGearDiscovery: [],
            onGearNotification: [],
            onGearConnect: [],
            onGearDisconnect : []
        }

        this.#RequestPermission = async () => {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Request for Location Permission',
                message: 'This app requires access to Fine Location Permission',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK'
            }
            );
            return (granted === PermissionsAndroid.RESULTS.GRANTED);
        }

        this.#ApplyCallback = function (sender, objs, ...args) {
            
            if (objs == null) return;
            if (typeof objs == 'undefined') return;
            //if (typeof objs != 'object') objs = [objs];
            
            for (var o in objs) {
                var obj = objs[o];
                if (typeof obj == 'object' && typeof obj.handleEvent == 'function')
                    obj.handleEvent.apply(obj, args);
                else if (typeof obj == 'function')
                    obj.apply(sender, args);
            }
        };

        this.#HandleResponseMessage = function (char, msg) {
            if (msg.messageType != NotificationMessageType.Response)
                return;
            
            if (msg.dataType == 16) {
                this.#isInProximity = !!msg.sensorStatus;
            }
        };

        this.#IsSupportedDevice = function (device) {
            return (
                device &&
                device.name == 'SlidePanel' &&
                device.id.toLowerCase().indexOf('4e:98:bb') === 0
            );
        };

        this.warningsEnabled = true;
        this.communicationLog = false;
    }

    async CheckBluetoothState() {
        const btState = await this.#manager.state();
        if (btState === 'Unsupported')
            return BluetoothState.Unsupported;
        else if (btState === 'PoweredOn')
            return BluetoothState.ON;
        else return BluetoothState.OFF;
    }

    async TurnOnBluetooth() {
        var state = await this.CheckBluetoothState();
        if (state == BluetoothState.Unsupported) {
            if (this.warningsEnabled)
                console.warn('[GearAPI] Bluethooth is not supported for this device.');

            return false;
        }

        if (state == BluetoothState.OFF)
            await this.#manager.enable();

        return true;
    }

    async TurnOffBluetooth() {
        var state = await this.CheckBluetoothState();
        if (state == BluetoothState.Unsupported) {
            if (this.warningsEnabled)
                console.warn('[GearAPI] Bluethooth is not supported for this device.');

            return false;
        }

        if (state == BluetoothState.ON)
            await this.#manager.disable();

        return true;
    }

    async StartDeviceScan() {
        var state = await this.CheckBluetoothState();
        if (state != BluetoothState.ON) {
            if (this.warningsEnabled) {
                if (state == BluetoothState.OFF)
                    console.warn('[GearAPI] Bluethooth is turned OFF.');
                else
                    console.warn('[GearAPI] Bluethooth is not supported for this device.');
            }
            return false;
        }

        const permission = await this.#RequestPermission();
        if (permission) {
            this.#manager.startDeviceScan(null, null, async (error, device) => {
                if (error) {
                    if (this.warningsEnabled)
                        console.log('[GearAPI] ' + error);

                    return;
                }

                if (this.#IsSupportedDevice(device)) {
                    this.#ApplyCallback(this, this.#events.onGearDiscovery, device);
                }

            });

            return true;
        }
        else if (this.warningsEnabled)
            console.warn('[GearAPI] Bluethooth permission denied.');

        return false;
    }

    StopDeviceScan() {
        this.#manager.stopDeviceScan();
    }

    async ConectDevice(device) {

        this.#manager.stopDeviceScan();
        if (typeof device == 'undefined' ||
            device == null ||
            device.id == null ||
            device.id == ''
        ) return;

        var isConnected = await this.IsDeviceConnected(device);
        if (isConnected) return;

        device.connect().then((device) => {
            this.#ApplyCallback(this, this.#events.onGearConnect, device);
            return device.discoverAllServicesAndCharacteristics();
        }).then((device) => {
            return device.services();
        }).then((services) => {
            services.forEach(async service => {
                device.characteristicsForService(service.uuid).then((chars) => {
                    for (var i in chars) {
                        var char = chars[i];
                        if (char == null ||
                            char.uuid == null ||
                            typeof char.uuid == 'undefined') continue;

                        switch (char.uuid.split('-')[0]) {
                            case '0001ffb1':
                                this.#writers[char.deviceID] = char;
                                break;
                            case '0001ffb2':
                            //default:
                                this.#manager.monitorCharacteristicForDevice(
                                    char.deviceID,
                                    char.serviceUUID,
                                    char.uuid, (error, char) => {
                                        if (char != null) {
                                            var bufferData = Buffer.from(char.value, 'base64').buffer;
                                            var msg = NotificationMessage.FromBuffer(bufferData);
                                            if (this.communicationLog) console.log('Packet received: ' + msg.hexdecimal);
                                            if (msg.messageType == NotificationMessageType.Update) {
                                                if (msg.isVibrating && this.#vibrateOFF)
                                                    this.VibrateOFF(device);

                                                this.#ApplyCallback(this, this.#events.onGearNotification, device, msg);
                                            }
                                            else if (msg.messageType == NotificationMessageType.Response)
                                                this.#HandleResponseMessage(char, msg)
                                        }
                                    });
                                break;
                            
                        }
                    }
                });
            });
        }).catch((error) => {
                // Handle errors
            });
    }

    async DisconnectDevice(device) {
        if (typeof device == 'undefined' ||
            device == null ||
            device.id == null ||
            device.id == ''
        ) return;

        var isConnected = await this.IsDeviceConnected(device);
        if (!isConnected) return;
            
        this.#manager.cancelDeviceConnection(device.id).then((device) => {
            if (typeof this.#writers[device.id] != 'undefined')
                delete this.#writers[device.id];

            this.#ApplyCallback(this, this.#events.onGearDisconnect, device);
        });
    }

    async IsDeviceConnected(device) {
        return await this.#manager.isDeviceConnected(device.id);
    }

    async SendPacket(device = null, hexStr = '') {
        if (typeof device == 'undefined' ||
            device == null ||
            device.id == null ||
            device.id == ''
        ) return;

        var char = this.#writers[device.id] || null;
        if (char == null) return;

        var packet = Buffer.from(hexStr, 'hex').toString('base64');
        await this.#manager.writeCharacteristicWithoutResponseForDevice(
            char.deviceID,
            char.serviceUUID,
            char.uuid,
            packet);
        if (this.communicationLog) console.log('Packet sent: ' + hexStr);
        
    }

    async Vibrate(device, length = 200) {
        if (typeof device == 'undefined' ||
            device == null ||
            device.id == null ||
            device.id == ''
        ) return;

        var isConnected = await this.IsDeviceConnected(device);
        if (!isConnected) return;

        this.#vibrateOFF = false;
        await this.SendPacket(device, 'ea01010000000000000000000000000000000000');
        setTimeout(function (sender, device) {
            sender.VibrateOFF(device);
        }, length, this, device);
        await sleep(length);
    }

    async VibrateOFF(device) {
        this.#vibrateOFF = true;
        await this.SendPacket(device, 'ea01000000000000000000000000000000000000');
    }

    async CheckProximity(device, cb = null, intervalLenght = 500) {
        if (typeof device == 'undefined' ||
            device == null ||
            device.id == null ||
            device.id == ''
        ) return;

        var isConnected = await this.IsDeviceConnected(device);
        if (!isConnected) return;

        this.#isInProximity = null;
        await this.SendPacket(device, 'eb10000000000000000000000000000000000000');
        while (this.#isInProximity === null) await sleep(intervalLenght);

        //var result = this.#ApplyCallback(this, cb, this.#isInProximity);
        var event = {
            _continueCheck: false,
            device: device,
            isNear: this.#isInProximity,
            ContinueCheck: function () {
                this._continueCheck = true;
            }
        };

        if (typeof cb == 'object' && typeof cb.handleEvent == 'function')
            result = cb.handleEvent.apply(cb, event);
        else if (typeof cb == 'function')
            result = cb.apply(this, [event]);

        if (event._continueCheck) {
            this.CheckProximity(device, cb, intervalLenght);
        }
    }


    OnGearDiscovery(cb) {
        this.#events.onGearDiscovery = [cb];            
    }

    OnGearNotification(cb) {
        this.#events.onGearNotification = [cb];
    }

    OnGearConnect(cb) {
        this.#events.onGearConnect = [cb];
    }

    OnGearDisconnect(cb) {
        this.#events.onGearDisconnect = [cb];            
    }

}

class BluetoothState {
    static Unsupported = 'unsupported';
    static ON = 'on';
    static OFF = 'off';
}

Array.prototype.remove = function (item) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] == item) delete this[i];
    }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

var GearAPI = new GearAPIManager();
export { BluetoothState, GearAPI as default };
