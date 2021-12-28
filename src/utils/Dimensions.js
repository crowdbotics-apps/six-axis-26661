import {Dimensions, Platform, StatusBar,Appearance} from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

export const {height, width} = Dimensions.get('window');

export const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

const RES_WIDTH = 1920,
RES_HEIGHT = 1080;

export const Utils = {
isIos: Platform.OS == 'ios',
isAndroid: Platform.OS == 'android',
isTV: Platform.isTV,
isAppleTV: Platform.isTVOS,
isDarkMode: Appearance.getColorScheme() == 'dark',
headerHeight: 60,
resWidth: (val) => (isNaN(val) ? 1 : (val * width) / RES_WIDTH),
resHeight: (val) => (isNaN(val) ? 1 : (val * height) / RES_HEIGHT),
width: width,
height: height,
}
