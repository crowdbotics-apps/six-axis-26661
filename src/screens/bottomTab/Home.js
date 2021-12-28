import React, {useState,useEffect} from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../Assets';
import {Utils} from '../../utils/Dimensions';
import colors from '../../utils/colors';
import RadioButton from '../../components/radioButton';

const Home = props => {
  const [radioButtonCheck, setRadioButtonCheck] = useState(0);
  const [userData, setUserData] = useState(null);
  const [workOutList, setWorkOutList] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  useEffect(() => {
    setUser()
  },[])
  const setUser=async()=>{
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setUserData(user);
  }

  const renderWorkOutList = () => {
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
          <Text style={styles.listViewItemText}>2:10</Text>
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

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        start={{x: 0, y: 1.8}}
        end={{x: 1, y: 0}}
        colors={['#F9B041', '#BE202E']}
        style={styles.linearGradient}>
        <View style={styles.workoutContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={images.pofileImage}
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
                active={radioButtonCheck == 1 ? true : false}
                onPress={() => {
                  setRadioButtonCheck(1);
                }}
                title="Standalone"
              />
              <RadioButton
                active={radioButtonCheck == 2 ? true : false}
                onPress={() => {
                  setRadioButtonCheck(2);
                }}
                title="Workout Testing"
              />
            </View>
            <View style={styles.lowerRadioButtonStyle}>
              <RadioButton
                active={radioButtonCheck == 3 ? true : false}
                onPress={() => {
                  setRadioButtonCheck(3);
                }}
                title="Challenge"
              />
              <RadioButton
                active={radioButtonCheck == 4 ? true : false}
                onPress={() => {
                  setRadioButtonCheck(4);
                }}
                title="Series Workout"
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
          data={workOutList}
          renderItem={renderWorkOutList}
        />
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
});
