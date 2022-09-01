import React, {useState, useEffect,useContext} from 'react';
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
import * as Progress from 'react-native-progress';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../Assets';
import {StatusBarHeight, Utils} from '../../utils/Dimensions';
import colors from '../../utils/colors';
import RadioButton from '../../components/radioButton';
import AppLoading from '../../components/AppLoading';
//API's
import {getWorkouts} from '../../API/methods/workOut';
import Button from '../../components/Button';
import GearAPI from '../bottomTab/GearAPI/GearAPI';
import { AppContext } from '../../context/AppContext';

const GearRepresentation = props => {
  const {setDevices, devices, setDevicesId, devicesId} = useContext(AppContext);
  const {navigation, route} = props;
  const focused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState(null);
  const [timer, setTimer, timerRef] = useState(route?.params?.timer);

  useEffect(() => {
    if (focused) {
      setUser();
      listenNotification()
    }
  }, [focused]);
  const listenNotification=async()=>{
    GearAPI.OnGearNotification((res)=>{
    console.log("🚀 ~ file: index.js ~ line 46 ~ GearAPI.OnGearNotification ~ res", JSON.stringify(res))
    })
    
  }
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          setModalOpen(true)
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);
    // interval cleanup on component unmount
    return () => clearInterval(interval);
  }, []);
  const setUser = async () => {
    let user = await AsyncStorage.getItem('user');

    user = JSON.parse(user);
    if (user.profile_picture) {
      let profileString = user.profile_picture.split('?');
      setProfileUrl(profileString[0]);
    }
    setUserData(user);
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
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
            style={styles.backIconContainer}>
            <Image
              style={{
                height: '60%',
                width: '60%',
                resizeMode: 'contain',
                transform: [{rotate: '90deg'}],
              }}
              source={images.arrowDown}
            />
          </TouchableOpacity>
          <View style={[styles.profileImageContainer]}>
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
            </View>
          )}
        </View>
        <View style={styles.caloriesContainer}>
          <View style={styles.caloriesBox}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{'Calories'}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.title, {fontWeight: 'bold'}]}>{'25'}</Text>
            </View>
          </View>
          <View style={[styles.caloriesBox, {marginLeft: '5%'}]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{'Points'}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.title, {fontWeight: 'bold'}]}>{'10'}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.timer}>{`00:${
          timer < 10 ? `0${timer}` : timer
        }`}</Text>
        <View style={styles.barContainer}>
          <Progress.Bar
            color={colors.lightOrange}
            progress={timer / route?.params?.timer}
            borderWidth={0}
            height={Utils.resHeight(22)}
            width={Utils.resWidth(1450)}
            borderRadius={0}
          />
        </View>
        <View style={styles.radioButtons}>
          <View style={styles.radioButton}>
            <View style={styles.radioFill} />
          </View>
          <View style={styles.radioButton}>
            <View style={styles.radioFill} />
          </View>
        </View>
        <Modal animationType="slide" transparent visible={modalOpen}>
          <View style={styles.modalContainer}>
            <Pressable
              style={{flex: 1}}
              onPress={() => {
                setModalOpen(false);
              }}></Pressable>
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalHeader}>{'Share on Social Media'}</Text>
              <View style={styles.line} />
              <View style={styles.caloriesContainer}>
                <View style={styles.caloriesBox}>
                  <View
                    style={[
                      styles.titleContainer,
                      {backgroundColor: colors.darkRed},
                    ]}>
                    <Text style={[styles.title, , {color: colors.white}]}>
                      {'Calories'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.detailContainer,
                      {backgroundColor: colors.darkRed},
                    ]}>
                    <Text
                      style={[
                        styles.title,
                        {fontWeight: 'bold', color: colors.white},
                      ]}>
                      {'25'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.caloriesBox, {marginLeft: '5%'}]}>
                  <View
                    style={[
                      styles.titleContainer,
                      {backgroundColor: colors.darkRed},
                    ]}>
                    <Text style={[styles.title, {color: colors.white}]}>
                      {'Points'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.detailContainer,
                      {backgroundColor: colors.darkRed},
                    ]}>
                    <Text
                      style={[
                        styles.title,
                        {fontWeight: 'bold', color: colors.white},
                      ]}>
                      {'10'}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.timer, {color: colors.darkRed}]}>
                {'04:18'}
              </Text>
              <View style={styles.socialMediaContainer}>
                <TouchableOpacity>
                  <Image style={styles.shareImage} source={images.facebook} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image style={styles.shareImage} source={images.twitter} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image style={styles.shareImage} source={images.instagram} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image style={styles.shareImage} source={images.linkedIn} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.darkOrange,
                    height: Utils.resHeight(50),
                    width: Utils.resHeight(50),
                    borderRadius: Utils.resHeight(25),
                    alignItems: 'center',
                    paddingTop: Utils.resHeight(5),
                  }}>
                  <Image
                    style={{
                      height: Utils.resHeight(35),
                      width: Utils.resHeight(35),
                      resizeMode: 'contain',
                    }}
                    source={images.external}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default GearRepresentation;
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
    fontSize: Utils.resHeight(30),
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
  backIconContainer: {
    height: 35,
    width: 35,
    position: 'absolute',
    top: Utils.resHeight(90),
    left: Utils.resWidth(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesContainer: {
    width: '100%',
    marginTop: Utils.resHeight(30),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  caloriesBox: {
    width: '30%',
    // backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  straightLine: {
    height: Utils.resHeight(50),
    width: '1%',
    backgroundColor: colors.darkOrange,
  },
  titleContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    height: Utils.resHeight(50),
  },
  title: {
    color: colors.darkOrange,
  },
  detailContainer: {
    width: '38%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    height: Utils.resHeight(50),
    marginLeft: '2%',
  },
  timer: {
    marginTop: Utils.resHeight(60),
    textAlign: 'center',
    color: colors.white,
    fontSize: Utils.resWidth(100),
    fontWeight: 'bold',
  },
  barContainer: {
    width: Utils.resWidth(1525),
    marginTop: Utils.resHeight(20),
    height: Utils.resHeight(30),
    backgroundColor: colors.white,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    // paddingHorizontal:"2%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtons: {
    marginTop: Utils.resHeight(100),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  radioButton: {
    borderWidth: 1,
    borderColor: colors.white,
    height: Utils.resHeight(80),
    width: Utils.resHeight(80),
    borderRadius: Utils.resHeight(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFill: {
    height: Utils.resHeight(45),
    width: Utils.resHeight(45),
    borderRadius: Utils.resHeight(25),
    backgroundColor: colors.white,
  },
  shareImage: {
    height: Utils.resHeight(50),
    width: Utils.resHeight(50),
    resizeMode: 'contain',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '15%',
    justifyContent: 'space-between',
    marginTop: Utils.resHeight(50),
  },
});
