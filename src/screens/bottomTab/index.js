import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../../utils/colors';
import Images from '../../Assets';
const Tab = createBottomTabNavigator();

//Screens
import Home from './Home';
import WorkOut from './WorkOut';
import Bluethooth from './Bluethooth';
import Menu from './Menu';

const BottomTabStack = props => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: true,
        // keyboardHidesTabBar: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.darkOrange,
        tabBarInactiveTintColor: Colors.darkOrange,
        inactiveTintColor: Colors.darkOrange,
        activeTintColor: Colors.darkOrange,
        style: {
          elevation: 0,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          indicatorStyle: {
            width: 0,
            height: 0,
            elevation: 0,
          },
        },

        tabStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <View style={[styles.BarStyle]}>
              <Image style={[styles.iconImage]} source={Images.home} />
            </View>
          ),
          tabBarStyle: {},
          headerShown: false,
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <View style={[styles.BarStyle]}>
              <Image style={[styles.iconImage]} source={Images.workOut} />
            </View>
          ),
          headerShown: false,
        }}
        name="WorkOut"
        component={WorkOut}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <View style={[styles.BarStyle]}>
              <Image style={[styles.iconImage]} source={Images.bluetooth} />
            </View>
          ),
          headerShown: false,
        }}
        name="Bluetooth"
        component={Bluethooth}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <View style={[styles.BarStyle]}>
              <Image style={[styles.iconImage]} source={Images.menu} />
            </View>
          ),
          headerShown: false,
        }}
        name="Menu"
        component={Menu}
      />
    </Tab.Navigator>
  );
};
export default BottomTabStack;

export const styles = StyleSheet.create({
  iconImage: {
    width: '100%',
    height: '100%',
    // marginTop: wp(-5),
    // backgroundColor: 'red',
    resizeMode: 'contain',
  },
  BarStyle: {
    width: 22,
    height: 22,
    elevation: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGreen,
  },
});
