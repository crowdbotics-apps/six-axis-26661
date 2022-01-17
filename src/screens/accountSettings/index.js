import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import images from '../../Assets';
//Components
import AppLoading from '../../components/AppLoading';
import ButtonCard from '../../components/ButtonCard';
//Utils
import colors from '../../utils/colors';
import {Utils} from '../../utils/Dimensions';

const AccountSettings = props => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);
  const focused = useIsFocused();
  useEffect(() => {
    if (focused) setUser();
  }, [focused]);
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image style={styles.backArrow} source={images.arrowDown} />
          </TouchableOpacity>
          <View style={styles.profileImageContainer}>
            <Image
              source={profileUrl ? {uri: profileUrl} : images.person}
              style={styles.profileImageStyle}
            />
          </View>
          <View style={styles.logOutButton}/>
          {/* <TouchableOpacity onPress={() => setLogOutModal(true)}>
            <Image style={styles.logOutButton} source={images.logOut} />
          </TouchableOpacity> */}
        </View>
        {userData && (
          <View style={styles.nameContainer}>
            <Text style={styles.nameTextStyle}>
              {userData.first_name + ' ' + userData.last_name}
            </Text>
          </View>
        )}
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex:0.1}}/>
          <View style={styles.buttonsViewContainer}>
            <View style={styles.buttonsContainer}>
              <ButtonCard
                onPress={() => {
                  props.navigation.navigate('profileSetup');
                }}
                image={images.payment}
                title={'Manage Payments'}
              />
              <ButtonCard
                onPress={() => props.navigation.navigate('Subscriptions')}
                image={images.subscriptions}
                title={'Subscriptions'}
              />
            </View>
            {/* <View style={styles.buttonsContainer}>
              <ButtonCard
                onPress={() => {}}
                image={images.payment}
                title={'Manage Payments'}
              />
              <ButtonCard image={images.history} title={'Workout History'} />
            </View>
            <ButtonCard
              onPress={() => setChangePasswordModal(true)}
              image={images.changePassword}
              title={'Change Password'}
            /> */}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default AccountSettings;

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '55%',
  },
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
  logOutButton: {
    height: Utils.resWidth(100),
    width: Utils.resWidth(100),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Utils.resHeight(70),
    paddingHorizontal: '5%',
  },
  buttonsViewContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginTop: Utils.resHeight(60),
    marginHorizontal: '5%',
    borderRadius: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: Utils.resHeight(60),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000060',
  },
  modalContentContainer: {
    flex: 0.3,
    borderTopLeftRadius: Utils.resHeight(30),
    borderTopRightRadius: Utils.resHeight(30),
    backgroundColor: colors.white,
  },
  logOutModalTitleView: {
    alignSelf: 'center',
    borderBottomWidth: Utils.resHeight(1),
    height: Utils.resHeight(40),
    paddingHorizontal: '2%',
    borderBottomColor: colors.darkOrange,
    marginTop: Utils.resHeight(30),
  },
  logOutModalTitle: {
    fontSize: Utils.resHeight(22),
    color: colors.darkOrange,
  },
  logOutModalButtons: {
    flex: 1,
    justifyContent: 'center',
    // alignItems:"center"
  },
  logOutModalButton: {
    height: Utils.resHeight(60),
    width: Utils.resWidth(600),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkOrange,
    marginHorizontal: '2%',
  },
  logOutModalButtonTitle: {
    color: colors.white,
    fontSize: Utils.resHeight(22),
  },
  chanegePasswordModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000060',
  },
  chanegePasswordModalTitle: {
    textAlign: 'center',
    marginVertical: Utils.resHeight(20),
    fontSize: Utils.resHeight(30),
  },
  backArrow: {
    height: Utils.resWidth(100),
    width: Utils.resWidth(100),
    tintColor: colors.white,
    resizeMode: 'contain',
    transform: [{rotate: '90deg'}],
  },
});
