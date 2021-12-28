import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  NativeModules,
  NativeEventEmitter,
  NativeAppEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import RNBluetoothClassic, {
  BluetoothEventType,
} from 'react-native-bluetooth-classic';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Assets
import images from '../../Assets';

//Components
import ButtonCard from '../../components/ButtonCard';
import colors from '../../utils/colors';
import {Utils} from '../../utils/Dimensions';

const Bluethooth = props => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [list, setList] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState("");
  const [bluethoothList, setBluethoothList] = useState(['', '']);
  const [userData, setUserData] = useState(null);
  const peripherals = new Map();
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  useEffect(() => {
    setUser();
    BleManager.start({showAlert: true});
    // BleManager.retrieveServices();

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          startFetchingCurrentLocation();
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              startFetchingCurrentLocation();
              console.log('User accept');
            } else {
              startFetchingCurrentLocation();
              console.log('User refuse');
            }
          });
        }
      });
    } else {
      startFetchingCurrentLocation();
    }

    return () => {
      console.log('unmount');
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      );
    };
  }, []);
  const startFetchingCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {},
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const checkBluetoothAvailable = async () => {
    let available = await RNBluetoothClassic.isBluetoothAvailable();
    let enabled;
    if (available) {
      enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (enabled) {
        setModalOpen(true);
        setIsScanning(true);
        setList([]);
        RNBluetoothClassic.startDiscovery()
          .then(response => {
            setIsScanning(false);
            setList(response);
          })
          .catch(err => {
            console.log('🚀 ~ file: Bluethooth.js ~ line 122 ~ err', err);
          });
      } else {
        RNBluetoothClassic.requestBluetoothEnabled().then((resp)=>{
        }).catch((err)=>{
        alert('Please turn on Bluetooth');
        })
      }
    } else {
      alert("Bluetooth isn't available on this device");
    }
  };

  const handleDisconnectedPeripheral = data => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  const handleUpdateValueForCharacteristic = data => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  };

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length == 0) {
        console.log('No connected peripherals');
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  };

  const setUser = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setUserData(user);
  };

  const handleDiscoverPeripheral = peripheral => {
    console.log('Got ble peripheral', peripheral);
    if (peripheral.name) {
      // peripheral.name = 'NO NAME';
      peripherals.set(peripheral.id, peripheral);
    }

    setList(Array.from(peripherals.values()));
  };

  const handleStopScan = () => {
    console.log('Scan is stopped. Devices: ');
    setIsScanning(false);
  };

  const scanNearByDevices = () => {
    setList([]);
    console.log('Yes');
    BleManager.scan([], 5, true)
      .then(() => {
        console.log('Scanning...');
        setIsScanning(true);
        // this.setState({scanning: true});
      })
      .catch(err => {
        console.log(
          '🚀 ~ file: Bluethooth.js ~ line 43 ~ scanNearByDevices ~ err',
          err,
        );
      });
  };
  const testPeripheral = peripheral => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id)
          .then(() => {
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              setList(Array.from(peripherals.values()));
            }
            console.log('Connected to ' + peripheral.id);

            setTimeout(() => {
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then(
                peripheralData => {
                  console.log('Retrieved peripheral services', peripheralData);

                  BleManager.readRSSI(peripheral.id).then(rssi => {
                    console.log('Retrieved actual RSSI value', rssi);
                    let p = peripherals.get(peripheral.id);
                    if (p) {
                      p.rssi = rssi;
                      peripherals.set(peripheral.id, p);
                      setList(Array.from(peripherals.values()));
                    }
                  });
                },
              );

              // Test using bleno's pizza example
              // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
              /*
            BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
              console.log(peripheralInfo);
              var service = '13333333-3333-3333-3333-333333333337';
              var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
              var crustCharacteristic = '13333333-3333-3333-3333-333333330001';
              setTimeout(() => {
                BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                  console.log('Started notification on ' + peripheral.id);
                  setTimeout(() => {
                    BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
                      console.log('Writed NORMAL crust');
                      BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
                        console.log('Writed 351 temperature, the pizza should be BAKED');
                        
                        //var PizzaBakeResult = {
                        //  HALF_BAKED: 0,
                        //  BAKED:      1,
                        //  CRISPY:     2,
                        //  BURNT:      3,
                        //  ON_FIRE:    4
                        //};
                      });
                    });
                  }, 500);
                }).catch((error) => {
                  console.log('Notification error', error);
                });
              }, 200);
            });*/
            }, 900);
          })
          .catch(error => {
            console.log('Connection error', error);
          });
      }
    }
  };

  const renderBluethoothList = ({item}) => {
    return (
      <View style={styles.listViewContainer}>
        <View style={[styles.listViewItem, {width: '10%'}]}>
          <Image
            resizeMode="contain"
            style={styles.listViewItemImage}
            source={images.bluetooth}
          />
        </View>
        <View
          style={[
            styles.listViewItem,
            {width: '40%', alignItems: 'flex-start'},
          ]}>
          <Text
            style={[styles.listViewItemText, {fontSize: Utils.resHeight(16)}]}>
            {item.name}
          </Text>
        </View>
          <TouchableOpacity
            onPress={() => {
                RNBluetoothClassic.pairDevice(item.address).then((response)=>{
                  setConnectedDevice(item.address)
                }).catch((err)=>{
                console.log("🚀 ~ line 313 ~ RNBluetoothClassic.pairDevice ~ err", err)
                })
            }}
            style={[
              styles.listViewItem,
              {borderWidth: 1, borderColor: colors.white},
            ]}>
            <Text style={styles.listViewItemText}>{item.address == connectedDevice?"Connected":"Connect"}</Text>
          </TouchableOpacity>
        {/* <TouchableOpacity
        onPress={() => {
          RNBluetoothClassic.getConnectedDevices().then((res)=>{
          console.log("🚀 ~ file: Bluethooth.js ~ line 326 ~ RNBluetoothClassic.getConnectedDevices ~ res", res)

          }).catch((err)=>{
          console.log("🚀 ~ file: Bluethooth.js ~ line 328 ~ RNBluetoothClassic.getConnectedDevices ~ err", err)
          })
      }}
          style={[styles.listViewItem, {backgroundColor: colors.white}]}>
          <Text style={[styles.listViewItemText, {color: colors.darkOrange}]}>
            Disconnect
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image source={images.pofileImage} style={styles.profileImageStyle} />
      </View>
      {userData && (
        <View style={styles.nameContainer}>
          <Text style={styles.nameTextStyle}>
            {userData.first_name + ' ' + userData.last_name}
          </Text>
        </View>
      )}
      <View style={styles.buttonsViewContainer}>
        <View style={styles.buttonsContainer}>
          <ButtonCard
            onPress={() => {
              // scanNearByDevices();
              // setModalOpen(true);
              checkBluetoothAvailable();
            }}
            image={images.bluetooth}
          />
          <ButtonCard image={images.bluethoothWorkout} />
        </View>
        <View style={styles.buttonsContainer}>
          <ButtonCard
            onPress={() => {}}
            imageContainer={styles.imageContainer}
            image={images.bluethoothWorkout}
          />
          <ButtonCard image={images.menu} />
        </View>
      </View>
      <Modal transparent visible={modalOpen}>
        <View style={styles.modalContainer}>
          <Pressable
            style={{flex: 1}}
            onPress={() => setModalOpen(false)}></Pressable>
          <LinearGradient
            start={{x: 0, y: 2}}
            end={{x: 0.1, y: 0}}
            colors={['#F9B041', '#BE202E']}
            style={styles.modalContentContainer}>
            <TouchableOpacity style={styles.listDevices}>
              <Text style={styles.listDevicesTitle}>List of Devices</Text>
              <Image
                resizeMode="contain"
                style={styles.arrowDown}
                source={images.arrowDown}
              />
            </TouchableOpacity>
            {list.length == 0 && !isScanning && (
              <View style={{flex: 1, margin: 20}}>
                <Text style={{textAlign: 'center', color: colors.white}}>
                  No Devices
                </Text>
              </View>
            )}
            {isScanning && (
              <View style={{flex: 1, margin: 20}}>
                <Text style={{textAlign: 'center', color: colors.white}}>
                  Scanning...
                </Text>
              </View>
            )}
            <FlatList
              scrollEnabled={true}
              data={list}
              renderItem={renderBluethoothList}
            />
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

export default Bluethooth;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: Utils.resHeight(60),
  },
  imageContainer: {
    borderWidth: Utils.resHeight(5),
    borderRadius: Utils.resHeight(40),
    height: Utils.resHeight(80),
    width: Utils.resHeight(80),
    padding: Utils.resHeight(7),
    borderColor: colors.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContentContainer: {
    flex: 0.5,
    borderTopLeftRadius: Utils.resHeight(30),
    borderTopRightRadius: Utils.resHeight(30),
  },
  listDevices: {
    width: '80%',
    height: Utils.resHeight(60),
    alignSelf: 'center',
    marginTop: Utils.resHeight(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: `${colors.white}80`,
    borderBottomWidth: Utils.resHeight(1),
    paddingHorizontal: Utils.resHeight(5),
  },
  arrowDown: {
    height: Utils.resHeight(12),
    width: Utils.resHeight(20),
  },
  listDevicesTitle: {
    color: colors.white,
    fontSize: Utils.resHeight(24),
  },
  listViewContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: Utils.resHeight(30),
    justifyContent: 'space-between',
  },
  listViewItem: {
    width: '22.5%',
    justifyContent: 'center',
    alignItems: 'center',
    height: Utils.resHeight(30),
  },
  listViewItemText: {
    color: colors.white,
    fontSize: Utils.resHeight(12),
  },
  listViewItemImage: {
    width: '100%',
    height: Utils.resHeight(15),
    tintColor: colors.white,
  },
  profileImageContainer: {
    borderColor: colors.darkOrange,
    borderWidth: 2,
    borderRadius: Utils.resHeight(150),
    width: Utils.resWidth(300),
    height: Utils.resWidth(300),
    padding: 2,
    marginTop: Utils.resHeight(70),
    alignSelf: 'center',
  },
  profileImageStyle: {
    height: '100%',
    width: '100%',
  },
  nameContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameTextStyle: {
    color: colors.darkOrange,
    fontSize: Utils.resHeight(20),
    marginTop: Utils.resHeight(10),
  },
  workoutTextStyle: {
    color: colors.darkOrange,
    fontSize: Utils.resHeight(30),
    marginTop: Utils.resHeight(50),
  },
  buttonsViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
