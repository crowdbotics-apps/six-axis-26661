class NotificationMessage {

    constructor(hexdecimal = '') {
        this.hexdecimal = hexdecimal.toLowerCase();

        this.messageType = NotificationMessageType.FromHex(this.hexdecimal);
        this.dataType = this.parseComponent(2);
        this.isVibrating = !!this.parseComponent(4); // This is also the sensor status on Response messages
        this.sensorStatus = this.messageType == NotificationMessageType.Response ? this.parseComponent(4) : null;
        this.batteryPower = this.parseComponent(6);
        this.chargingStatus = this.parseComponent(8);
        this.pressureHighVal = this.parseComponent(10);
        this.pressureLowVal = this.parseComponent(12);
        this.acceleratorHighX = this.parseComponent(14);
        this.acceleratorLowX = this.parseComponent(16);
        this.acceleratorHighY = this.parseComponent(18);
        this.acceleratorLowY = this.parseComponent(20);
        this.acceleratorHighZ = this.parseComponent(22);
        this.acceleratorLowZ = this.parseComponent(24);
        this.locationHighX = this.parseComponent(26);
        this.locationLowX = this.parseComponent(28);
        this.locationHighY = this.parseComponent(30);
        this.locationLowY = this.parseComponent(32);
        this.extra1 = this.parseComponent(34);
        this.extra2 = this.parseComponent(36);
        this.extra3 = this.parseComponent(38);
    }

    parseComponent(position = 2, length = 2, returnHEX = false) {
        if (position < 0 || length < 0)
            return '';

        var value = '';
        if (this.hexdecimal.length + length >= position) {
            var hexComponent = this.hexdecimal.substr(position, length);
            value = returnHEX ? hexComponent : parseInt(NotificationMessage.HexToDec(hexComponent));
        }

        return value;
    }

    CurrentPressure() {
        return this.pressureLowVal;
    }

    MovementX(soft=true) {
        var x = this.locationHighX - this.locationLowX;
        return soft ? x / 100 : x;
    }

    MovementY(soft=true) {
        var y = this.locationHighY - this.locationLowY;
        return soft ? y / 100 : y;
    }

    static HexToDec(s) {
        var i, j, digits = [0], carry;
        for (i = 0; i < s.length; i += 1) {
            carry = parseInt(s.charAt(i), 16);
            for (j = 0; j < digits.length; j += 1) {
                digits[j] = digits[j] * 16 + carry;
                carry = digits[j] / 10 | 0;
                digits[j] %= 10;
            }
            while (carry > 0) {
                digits.push(carry % 10);
                carry = carry / 10 | 0;
            }
        }
        return digits.reverse().join('');

    }

    static Buf2Hex(buffer) { // buffer is an ArrayBuffer
        return [...new Uint8Array(buffer)]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
    }

    static FromBuffer(buffer) {
        return new NotificationMessage(NotificationMessage.Buf2Hex(buffer));
    }

}

NotificationMessage.prototype.ToString = function (fields) {

    var str = '***********\n';
    for (var p in this) {
        if (typeof this[p] == 'function')
            continue;

        var tabs = p.length > 14 ? '\t' : '\t\t';
        if (typeof fields != 'undefined') {
            for (var f in fields) {
                if (fields[f] == p) {

                    str += p + ':' + tabs + this[p] + '\n';
                    break;
                }
            }
        }
        else str += p + ':' + tabs + this[p] + '\n';
    }
    str += '***********\n';

    return str;
}

class NotificationMessageType {
    static Response = 'fa';
    static Update = 'fb';

    static FromHex(hexdecimal = '') {
        hexdecimal = hexdecimal.toLowerCase();
        if (hexdecimal.length > 1) {
            return hexdecimal.substr(0, 2);
        }
    }
}

class ChargingStatus {
    static NoCharging = 0;
    static Charging = 1;
    static FullyCharged = 2;

    static FromHex(hexdecimal = '') {
        hexdecimal = hexdecimal.toLowerCase();
        if (hexdecimal.length > 9) {
            return parseInt(hexdecimal.substr(8, 2));
        }
    }
}


export { ChargingStatus, NotificationMessageType, NotificationMessage as default };