import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';
// import Preference from 'react-native-preference';
// import {requestNotifications} from 'react-native-permissions';

//Creating Instance of Stack
const Stack = createStackNavigator();
const navigator = React.createRef();

//Screens
// import OnBoarding from './screens/onBoarding';
// import ConnectWithOthers from './screens/connectWithOthers';
import Splash from './screens/splash';
import Auth from './screens/auth';
import profileSetup from './screens/profileSetup';
import AccountSettings from './screens/accountSettings';
import Subscriptions from './screens/subscriptions';
import ForgetPassword from './screens/forgetPassword'


// Stacks
import BottonStack from './screens/bottomTab';
// import AuthStack from './screens/authStack';

//Utils
// import Colors from './utils/colors';

//Constants



/** Main Stack of the app */
const MainStack = () => {
  
  const [navigation,setNavigation] = useState("Auth")
  
const AsyncValue = async() => {

   let authToken = await AsyncStorage.getItem("authToken")
   console.log("🚀 ~ file: Routing.js ~ line 38 ~ AsyncValue ~ authToken", authToken)
   if(authToken){
    navigator.current.navigate('BottonStack');
   } else {
    navigator.current.navigate('Auth');
   }
}

  // useEffect(() => {
  //   AsyncValue()
  //  }, []);
  //  const navigateTo = async()=>{
  //   let authToken = await AsyncStorage.getItem("authToken")
  //     if(authToken){
  //       setNavigation("BottonStack")
  //       // navigation.dispatch(StackActions.replace('BottonStack'));
  //     }
  //   //    else {
  //   //   navigation.dispatch(StackActions.replace('Auth'));
  //   // }
  //   return () => clearTimeout(timer);
  // }

  return (
    <Stack.Navigator 
      screenOptions={{headerMode: false}}
      initialRouteName={"Splash"}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="BottonStack" component={BottonStack} />
      <Stack.Screen name="profileSetup" component={profileSetup} />
      <Stack.Screen name="AccountSettings" component={AccountSettings} />
      <Stack.Screen name="Subscriptions" component={Subscriptions} />
    </Stack.Navigator>
  );
};

/** Theme will help to change app light mode to dark mode */
export default AppNavigator = () => {

  return (
    <NavigationContainer ref={navigator}>
      <MainStack />
    </NavigationContainer>
  );
};
