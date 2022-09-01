import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../Assets';
import {Utils} from '../../utils/Dimensions';
import colors from '../../utils/colors';
import RadioButton from '../../components/radioButton';
import AppLoading from '../../components/AppLoading';
//API's
import {getWorkouts} from '../../API/methods/workOut';
import Button from '../../components/Button';
import GearAPI from './GearAPI/GearAPI';

var lastConnectedDevice = null;

const Home = props => {
  const difficuiltyData = [
    {
      label: 'Beginner - 10 sec',
      value: 10,
    },
    {
      label: 'Medium - 20 sec',
      value: 20,
    },
    {
      label: 'Difficult - 30 sec',
      value: 30,
    },
  ];
  const diskPositionData = [
    {
      label: 'Left',
      value: 'Left',
    },
    {
      label: 'Right',
      value: 'Right',
    },
  ];
  const pushUpData = [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },
    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
    {
      label: '6',
      value: '6',
    },
    {
      label: '7',
      value: '7',
    },
    {
      label: '8',
      value: '8',
    },
    {
      label: '9',
      value: '9',
    },
    {
      label: '10',
      value: '10',
    },
    {
      label: '11',
      value: '11',
    },
  ];
  const focused = useIsFocused();
  const [radioButtonCheck, setRadioButtonCheck] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [workoutList, setWorkoutList] = useState(false);
  const [openDifficult, setOpenDifficult] = useState(false);
  const [difficuilty, setDifficuilty] = useState('');
  const [openPosition, setOpenPosition] = useState(false);
  const [position, setPosition] = useState('');
  const [openPushUp, setOpenPushUp] = useState(false);
  const [pushUp, setPushUp] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);

  useEffect(() => {
    if (focused) {
      setUser();
      getWorkoutList();
    }
  }, [focused]);
  const getWorkoutList = async workOutNum => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('workout_type', workOutNum ? workOutNum : radioButtonCheck);
    getWorkouts(params)
      .then(response => {
        setWorkoutList(response.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  };
  const setUser = async () => {
    let user = await AsyncStorage.getItem('user');
    let device = await AsyncStorage.getItem('lastConnectedDevice');

    user = JSON.parse(user);
    if (user.profile_picture) {
      let profileString = user.profile_picture.split('?');
      setProfileUrl(profileString[0]);
    }
    if (device) {
      device = JSON.parse(device);
      lastConnectedDevice = device;
    }
    setUserData(user);
  };

  const renderWorkOutList = ({item, index}) => {
    return (
      <View style={styles.listViewContainer}>
        <View style={styles.listViewItem}>
          <Image
            resizeMode="contain"
            style={styles.listViewItemImage}
            source={images.pushUpMan}
          />
        </View>
        <View style={styles.listViewItem}>
          <Text style={styles.listViewItemText}>{item.time}</Text>
        </View>
        <View style={styles.listViewItem}>
          <Text style={styles.listViewItemText}>50</Text>
        </View>
        <View style={styles.listViewItem}>
          <Text style={styles.listViewItemText}>50</Text>
        </View>
      </View>
    );
  };
  const connectDevice = async () => {
    let isDeviceConnected = await GearAPI.IsDeviceConnected(
      lastConnectedDevice,
    );
    if (isDeviceConnected) {
      GearAPI.CheckProximity(lastConnectedDevice, function (e) {
        if (e.isNear) {
          setModalOpen(false);
          props.navigation.navigate('GearRepresentation',{timer:difficuilty});
          setTimeout(() => {
            alert('Calibration Completed!');
          }, 300);
        } else e.ContinueCheck();
      });
    } else {
      alert('No devices connected.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      {AppLoading.renderLoading(loading)}
      <LinearGradient
        start={{x: 0, y: 1.8}}
        end={{x: 1, y: 0}}
        colors={['#F9B041', '#BE202E']}
        style={styles.linearGradient}>
        <View style={styles.workoutContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={profileUrl ? {uri: profileUrl} : images.person}
              style={styles.profileImageStyle}
            />
          </View>
          {userData && (
            <View style={styles.nameContainer}>
              <Text style={styles.nameTextStyle}>
                {userData.first_name + ' ' + userData.last_name}
              </Text>

              <Text style={styles.workoutTextStyle}>Workouts</Text>
              <View style={styles.lineStyle} />
            </View>
          )}
          <View style={styles.radioButtonContainer}>
            <View style={styles.upperRadioButtonStyle}>
              <RadioButton
                active={radioButtonCheck == 2 ? true : false}
                onPress={() => {
                  setRadioButtonCheck(2);
                  getWorkoutList(2);
                }}
                title="Standalone"
              />
              <RadioButton
                active={radioButtonCheck == 1 ? true : false}
                onPress={() => {
                  // setRadioButtonCheck(2);
                }}
                title="Workout Testing"
              />
            </View>
            <View style={styles.lowerRadioButtonStyle}>
              <RadioButton
                active={radioButtonCheck == 1 ? true : false}
                onPress={() => {
                  setRadioButtonCheck(1);
                  getWorkoutList(1);
                }}
                title="Challenge"
              />
              <RadioButton
                active={radioButtonCheck == 0 ? true : false}
                onPress={() => {
                  setRadioButtonCheck(0);
                  getWorkoutList(0);
                }}
                title="Series Workout"
              />
            </View>
            <DropDownPicker
              items={difficuiltyData}
              open={openDifficult}
              setOpen={setOpenDifficult}
              value={difficuilty}
              setValue={value => {
                setDifficuilty(value);
                setModalOpen(true);
              }}
              containerStyle={styles.dropDownContainerStyle}
              style={styles.dropDownMainStyle}
              dropDownContainerStyle={styles.dropDownStyle}
              placeholderStyle={styles.dropDownPlaceHolder}
              placeholder={'Difficulty '}
              // placeholderStyle={{fontSize: 16, color: colors.darkOrange}}
              showArrow={true}
              zIndex={300}
            />
            <DropDownPicker
              items={diskPositionData}
              open={openPosition}
              setOpen={setOpenPosition}
              setValue={setPosition}
              value={position}
              containerStyle={styles.dropDownContainerStyle}
              style={styles.dropDownMainStyle}
              dropDownContainerStyle={styles.dropDownStyle}
              placeholderStyle={styles.dropDownPlaceHolder}
              placeholder={'Disc Position '}
              showArrow={true}
              zIndex={200}
            />
            <View style={styles.pushUpMainContainer}>
              <View style={styles.pushUpContainer}>
                <Text style={styles.pushUpText}>Pushups Repetition </Text>
              </View>
              <DropDownPicker
                items={pushUpData}
                open={openPushUp}
                value={pushUp}
                setOpen={setOpenPushUp}
                setValue={setPushUp}
                containerStyle={{width: '30%', height: Utils.resHeight(60)}}
                style={[styles.dropDownMainStyle, {width: '100%'}]}
                dropDownContainerStyle={[styles.dropDownStyle, {width: '100%'}]}
                placeholderStyle={styles.dropDownPlaceHolder}
                placeholder={'1 '}
                showArrow={true}
                zIndex={100}
              />
            </View>

            <Text style={[styles.workoutTextStyle, {alignSelf: 'center'}]}>
              Workouts
            </Text>
            <View style={[styles.lineStyle, {marginTop: 25}]} />
          </View>
          <View style={styles.listViewContainer}>
            <View style={styles.listViewItem}>
              <Text style={styles.listViewItemText}>Type/Name</Text>
            </View>
            <View style={styles.listViewItem}>
              <Text style={styles.listViewItemText}>Time</Text>
            </View>
            <View style={styles.listViewItem}>
              <Text style={styles.listViewItemText}>Difficulty</Text>
            </View>
            <View style={styles.listViewItem}>
              <Text style={styles.listViewItemText}>Previous Score</Text>
            </View>
          </View>
          <View style={styles.lineStyle} />
        </View>
        <FlatList
          scrollEnabled={true}
          data={workoutList}
          renderItem={renderWorkOutList}
        />
        <Modal animationType="slide" transparent visible={modalOpen}>
          <View style={styles.modalContainer}>
            <Pressable
              style={{flex: 1}}
              onPress={() => {
                setModalOpen(false);
              }}></Pressable>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalHeader}>{'Calibration'}</Text>
              <View style={styles.line} />
              <Text style={styles.descHeader}>
                {
                  "Position your 10SORFIT devices as shown below and click 'Continue'"
                }
              </Text>
              <View style={styles.deviceShapes}>
                <ImageBackground
                  resizeMode="contain"
                  style={styles.deviceShape}
                  source={images.deviceShape}>
                  <Text style={styles.shapeTitle}>L</Text>
                </ImageBackground>
                <ImageBackground
                  resizeMode="contain"
                  style={styles.deviceShape}
                  source={images.deviceShape}>
                  <Text style={styles.shapeTitle}>R</Text>
                </ImageBackground>
              </View>
              <Button
                onPress={() => {
                  // setModalOpen(false);
                  // props.navigation.navigate('GearRepresentation',{timer:difficuilty});
                  connectDevice();
                }}
                ButtonStyle={{
                  marginTop: '2%',
                  width: '40%',
                  alignSelf: 'center',
                }}
                titleStyle={{alignSelf: 'center'}}
                title={'Continue'}
              />
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    flex: 1,
  },
  workoutContainer: {},
  profileImageContainer: {
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: Utils.resHeight(150),
    width: Utils.resWidth(300),
    height: Utils.resWidth(300),
    marginTop: Utils.resHeight(70),
    alignSelf: 'center',
    overflow: 'hidden',
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
    color: 'white',
    fontSize: Utils.resHeight(20),
    marginTop: Utils.resHeight(10),
  },
  workoutTextStyle: {
    color: 'white',
    fontSize: Utils.resHeight(30),
    marginTop: Utils.resHeight(50),
  },
  lineStyle: {
    alignSelf: 'center',
    height: 1,
    backgroundColor: 'white',
    width: '90%',
    marginTop: Utils.resHeight(20),
  },
  radioButtonContainer: {
    marginTop: Utils.resHeight(50),
  },
  upperRadioButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  lowerRadioButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: Utils.resHeight(30),
  },
  listViewContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: Utils.resHeight(40),
  },
  listViewItem: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listViewItemText: {
    color: colors.white,
    fontSize: Utils.resHeight(12),
  },
  listViewItemImage: {
    width: '100%',
    height: Utils.resHeight(25),
  },
  dropDownStyle: {
    width: '80%',
    alignSelf: 'center',
  },
  dropDownPlaceHolder: {
    fontSize: 16,
    color: colors.darkOrange,
  },
  dropDownMainStyle: {
    width: '80%',
    alignSelf: 'center',
    height: Utils.resHeight(60),
  },
  dropDownContainerStyle: {
    marginTop: 20,
    height: Utils.resHeight(60),
  },
  pushUpContainer: {
    height: 50,
    width: '65%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#000000',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pushUpMainContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pushUpText: {
    color: '#EB5C2C',
    fontSize: 16,
  },
  modalContentContainer: {
    height: Utils.resHeight(450),
    borderTopLeftRadius: Utils.resHeight(30),
    borderTopRightRadius: Utils.resHeight(30),
    backgroundColor: 'white',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalHeader: {
    textAlign: 'center',
    marginVertical: Utils.resHeight(20),
    fontSize: Utils.resHeight(35),
    color: colors.darkOrange,
  },
  line: {
    width: '80%',
    height: 2,
    backgroundColor: colors.darkOrange,
    alignSelf: 'center',
  },
  descHeader: {
    width: '60%',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: Utils.resHeight(20),
    color: colors.darkOrange,
    marginTop: Utils.resHeight(5),
  },
  deviceShape: {
    width: Utils.resWidth(400),
    height: Utils.resHeight(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceShapes: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Utils.resHeight(10),
  },
  shapeTitle: {
    fontSize: Utils.resHeight(36),
    color: colors.darkOrange,
  },
});
