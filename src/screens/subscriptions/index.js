import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import images from '../../Assets';
import {createCard} from '../../API/methods/payments';
import {getSubscriptionsApi} from '../../API/methods/subscriptions';
import StripeHelper from '../../stripeHelper';
//Components
import AppLoading from '../../components/AppLoading';
import ButtonCard from '../../components/ButtonCard';
import Input from '../../components/Input';
import Button from '../../components/Button';
//Utils
import colors from '../../utils/colors';
import {Utils} from '../../utils/Dimensions';

const Subscriptions = props => {
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiryDate, setCardExpiryDate] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardHolderPostalCode, setCardHolderPostalCode] = useState('');
  const [userData, setUserData] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);
  const [addCardModal, setAddCardModal] = useState(false);
  const [subscriptionsList, setSubscriptionsList] = useState([]);
  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      getSubscriptions();
      setUser();
    }
  }, [focused]);
  const getSubscriptions = () => {
    setLoading(true);
    getSubscriptionsApi()
      .then(response => {
        setSubscriptionsList(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.log('🚀 line 45 ~ getProfile ~ error', error);
        setLoading(false);
      });
  };
  const setUser = async () => {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    if (user.profile_picture) {
      let profileString = user.profile_picture.split('?');
      setProfileUrl(profileString[0]);
    }
    setUserData(user);
  };
  const checkCardFields = () => {
    if (!cardName) return alert('Please enter your name!');
    if (!cardNumber) return alert('Please enter your card number!');
    if (cardNumber.length < 16)
      return alert('Card number should be of 16 digits!');
    if (!cardExpiryDate) return alert('Please enter expiry date');
    if (!cardCVC) return alert('Please enter card security code');
    if (!cardHolderPostalCode) return alert('Please enter zip/postal code');
    addCard();
  };
  const addCard = () => {
    let data = {
      name: cardName,
      number: cardNumber,
      exp_month: 12,
      exp_year: cardExpiryDate,
      cvc: cardCVC,
      address_zip: cardHolderPostalCode,
    };
    setLoading(true);
    StripeHelper.getToken(data, response => {
      if (response.error) {
        setLoading(false);
        alert(response.error.message);
      } else {
        createCard({
          card_token: response.id,
        })
          .then(resp => {
            console.log('🚀 ~ file: index.js ~ line 95 ~ addCard ~ resp', resp);
            setLoading(false);
          })
          .catch(error => {
            alert(error.message)
            console.log('🚀 line 45 ~ getProfile ~ error', error);
            setLoading(false);
          });
      }
    });
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
          <View style={styles.logOutButton} />
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
        <View style={{flex: 1}}>
          <View style={{flex: 0.1}} />
          <View style={styles.buttonsViewContainer}>
            <Text style={styles.subscriptionTitle}>
              {`Choose
Subscriptions`}
            </Text>
            <FlatList
              contentContainerStyle={{alignItems: 'center'}}
              horizontal={true}
              data={subscriptionsList}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => {
                return (
                  <ButtonCard
                    onPress={() => {
                      setAddCardModal(true);
                    }}
                    ButtonStyle={{marginHorizontal: Utils.resWidth(100)}}
                    image={images.payment}
                    title={item.recurring.interval.toUpperCase()}
                    titleText={item.unit_amount}
                  />
                );
              }}
            />
            {/* </View> */}
            <View style={{flex: 0.25}} />
          </View>
        </View>
      </LinearGradient>
      <Modal animationType="slide" transparent visible={addCardModal}>
        <View style={styles.container}>
          <View style={[styles.header, {marginTop: Utils.resHeight(30)}]}>
            <TouchableOpacity onPress={() => setAddCardModal(false)}>
              <Image
                style={[styles.backArrow, {tintColor: colors.darkOrange}]}
                source={images.arrowDown}
              />
            </TouchableOpacity>
            <Image style={styles.logo} source={images.gradianLogo} />
            <View style={styles.backArrow} />
          </View>
          <ButtonCard
            ButtonStyle={{alignSelf: 'center', marginTop: Utils.resHeight(52)}}
            image={images.payment}
            title={'Manage Payments'}
          />
          <View style={styles.contentContainer}>
            <Input
              onChangeText={setCardName}
              InputStyle={{textAlign: 'left'}}
              Placeholder="Name on Card"
              value={cardName}
            />
            <Input
              onChangeText={setCardNumber}
              InputStyle={{textAlign: 'left', marginTop: Utils.resHeight(20)}}
              Placeholder="Card Number"
              value={cardNumber}
            />
            <View style={styles.inputContainer}>
              <Input
                onChangeText={setCardExpiryDate}
                InputStyle={styles.inputField}
                Placeholder="Expiry Date"
                value={cardExpiryDate}
                keyboardType="decimal-pad"
              />
              <Input
                onChangeText={setCardCVC}
                InputStyle={styles.inputField}
                Placeholder="Security Code"
                value={cardCVC}
                keyboardType="decimal-pad"
                maxLength={3}
              />
            </View>
            <Input
              onChangeText={setCardHolderPostalCode}
              InputStyle={{textAlign: 'left'}}
              Placeholder="Zip / Postal Code"
              value={cardHolderPostalCode}
              keyboardType="decimal-pad"
            />
            <Button
              onPress={() => checkCardFields()}
              ButtonStyle={{marginTop: '20%'}}
              titleStyle={{alignSelf: 'center'}}
              title={'Add Payment Method'}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Subscriptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  subscriptionTitle: {
    fontSize: Utils.resHeight(42),
    color: colors.darkRed,
    textAlign: 'center',
    marginVertical: Utils.resHeight(20),
  },
  logo: {
    height: Utils.resHeight(30),
    width: '50%',
    resizeMode: 'contain',
  },
  profilePicView: {
    height: Utils.resHeight(100),
    width: Utils.resHeight(100),
    borderRadius: Utils.resHeight(50),
    backgroundColor: colors.grey,
    marginTop: Utils.resHeight(80),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: '10%',
    paddingTop: '15%',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: Utils.resHeight(20),
  },
  inputField: {
    width: '46%',
    textAlign: 'left',
  },
});
