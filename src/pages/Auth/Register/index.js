// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';
import {Card} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Bounce} from 'react-native-animated-spinkit';
import CheckBox from '@react-native-community/checkbox';

import {BRANKAZZ_BASE_URL} from '@env';
import {BRANKAZZ_ACCESS_KEY} from '@env';

const Register = props => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPin, setUserPin] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const [showPin, setShowPin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [checked, setChecked] = useState(false);

  const emailInputRef = createRef();
  const phoneInputRef = createRef();
  const addressInputRef = createRef();
  const pinInputRef = createRef();
  const passwordInputRef = createRef();

  const handleSubmitButton = () => {
    if (!checked) {
      alert('Please agree with our terms and conditions');
      return;
    }

    setErrortext('');
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!phoneNumber) {
      alert('Please fill Phone Number');
      return;
    }
    if (!userAddress) {
      alert('Please fill Address');
      return;
    }
    if (!userPin) {
      alert('Please fill Password');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      name: userName,
      email: userEmail,
      pin: userPin,
      password: userPassword,
      phone_number: phoneNumber,
      address: userAddress,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch(BRANKAZZ_BASE_URL + 'register', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Access-Key': BRANKAZZ_ACCESS_KEY,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.success == true) {
          setIsRegistraionSuccess(true);
          console.log('Registration Successful. Please Login to proceed');
        } else {
          setErrortext(responseJson.message);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const toggleShowPin = () => {
    setShowPin(!showPin);
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme['color-dark-500'],
          justifyContent: 'center',
        }}>
        {/* <Image
          source={require('../Image/success.png')}
          style={{
            height: 150,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        /> */}
        <Text style={styles.successTextStyle}>Pendaftaran Berhasil</Text>
        <Text style={styles.successDescriptionStyle}>
          Cek email anda ({userEmail}) untuk verifikasi, lalu login
        </Text>
        <TouchableOpacity
          style={styles.buttonGoBackStyle}
          activeOpacity={0.5}
          onPress={() => {
            // setIsRegistraionSuccess(false);
            props.navigation.navigate('Login');
          }}>
          <Text style={styles.buttonTextStyle}>Kembali ke Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <>
      <Bounce
        size={48}
        color={theme['color-secondary-500']}
        style={[styles.spinkitLoader, {display: loading ? 'flex' : 'none'}]}
      />
      <View style={{flex: 1, backgroundColor: theme['color-dark-500']}}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Card style={styles.card}>
            <View style={{alignItems: 'center'}}>
              {/* <Image
            source={require('../Image/aboutreact.png')}
            style={{
              width: '50%',
              height: 100,
              resizeMode: 'contain',
              margin: 30,
            }}
          /> */}
            </View>
            <KeyboardAvoidingView enabled>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={UserName => setUserName(UserName)}
                  underlineColorAndroid="#f000"
                  placeholder="Nama"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    emailInputRef.current && emailInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={UserEmail => setUserEmail(UserEmail)}
                  underlineColorAndroid="#f000"
                  placeholder="Email"
                  placeholderTextColor="#8b9cb5"
                  keyboardType="email-address"
                  ref={emailInputRef}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current && passwordInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={UserPin => setUserPin(UserPin)}
                  underlineColorAndroid="#f000"
                  placeholder="Pin"
                  placeholderTextColor="#8b9cb5"
                  keyboardType="numeric"
                  ref={pinInputRef}
                  returnKeyType="next"
                  secureTextEntry={!showPin}
                  onSubmitEditing={() =>
                    phoneInputRef.current && phoneInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={toggleShowPin}
                  style={styles.toggleButton}>
                  <MaterialCommunityIcons
                    name={showPin ? 'eye' : 'eye-off'}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={UserPassword => setUserPassword(UserPassword)}
                  underlineColorAndroid="#f000"
                  placeholder="Password"
                  placeholderTextColor="#8b9cb5"
                  ref={passwordInputRef}
                  returnKeyType="next"
                  secureTextEntry={!showPassword}
                  onSubmitEditing={() =>
                    phoneInputRef.current && phoneInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={toggleShowPassword}
                  style={styles.toggleButton}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                  underlineColorAndroid="#f000"
                  placeholder="Nomor HP"
                  placeholderTextColor="#8b9cb5"
                  keyboardType="numeric"
                  ref={phoneInputRef}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    addressInputRef.current && addressInputRef.current.focus()
                  }
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={UserAddress => setUserAddress(UserAddress)}
                  underlineColorAndroid="#f000"
                  placeholder="Alamat Saat Ini"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={addressInputRef}
                  returnKeyType="next"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
              </View>
              {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
              ) : null}

              <View style={styles.checkboxContainer}>
                <View style={styles.row}>
                  <CheckBox
                    disabled={false}
                    value={checked}
                    style={styles.checkbox}
                    tintColors={{
                      true: theme['color-secondary-800'],
                      false: theme['color-secondary-800'],
                    }}
                    onValueChange={newValue => {
                      setChecked(newValue);
                    }}
                  />
                  <Text style={styles.checkboxText}>
                    Saya menyetujui (
                    <TouchableOpacity
                      style={styles.termsText}
                      onPress={() => {
                        Linking.openURL('https://brankazz.corpo.id/terms');
                      }}>
                      <Text
                        style={{
                          color: theme['color-secondary-800'],
                          marginBottom: -4,
                          textDecorationLine: 'underline',
                          fontSize: 12,
                        }}>
                        Syarat dan ketentuan
                      </Text>
                    </TouchableOpacity>
                    )
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitButton}>
                <Text style={styles.buttonTextStyle}>
                  {' '}
                  <MaterialCommunityIcons name="account" size={16} /> REGISTER
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Card>
        </ScrollView>
      </View>
    </>
  );
};
export default Register;

const styles = StyleSheet.create({
  spinkitLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme['color-dark-500'],
    opacity: 0.7,
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  card: {
    marginHorizontal: 25,
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: theme['color-primary-500'],
    borderRadius: 15,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    // marginTop: 20,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: theme['color-secondary-500'],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 20,
    margin: 10,
    // marginHorizontal: 25,
  },
  buttonGoBackStyle: {
    backgroundColor: theme['color-secondary-500'],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 20,
    margin: 10,
    marginHorizontal: 25,
  },
  buttonTextStyle: {
    color: theme['color-primary-800'],
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputStyle: {
    width: '100%',
    color: theme['color-primary-100'],
    borderColor: theme['color-dark-gray-500'],
    backgroundColor: theme['color-dark-gray-500'],
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 25,
    marginBottom: 10,
    height: 48,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
  successDescriptionStyle: {
    color: theme['color-primary-400'],
    textAlign: 'center',
    fontSize: 15,
  },

  checkboxContainer: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: -30,
  },

  checkboxText: {
    color: theme['color-primary-100'],
    fontSize: 12,
    marginLeft: 5,

    marginLeft: -2,
  },

  termsText: {
    // marginBottom: 100,
  },
});
