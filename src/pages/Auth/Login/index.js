import React from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {StackActions} from '@react-navigation/native';

import {user_fcm_token, user_login} from '../../../api/user_api';
import {Card, Layout} from '@ui-kitten/components';

import {default as theme} from '../../../../theme.json';
import {Bounce} from 'react-native-animated-spinkit';

import messaging from '@react-native-firebase/messaging';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
    };
    this.getOnboarding();
    this.getData();
    this.onDisplayNotification();
  }

  getOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem('onboarding');
      if (!value) {
        this.props.navigation.dispatch(StackActions.replace('Onboarding'));
      } else {
        console.log(value);
      }
    } catch (e) {
      console.error(e);
    }
  };

  onDisplayNotification = async () => {
    await messaging().requestPermission();
  };

  getData = async () => {
    try {
      console.log('get user data');
      const value = await AsyncStorage.getItem('bearer-token');
      if (value !== null) {
        this.props.navigation.dispatch(StackActions.replace('Pages'));
      } else {
        console.log('user not logged in');
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleLogin = async () => {
    try {
      console.log('trying to login ...');
      this.setState({isLoading: true});

      const authStatus = await messaging().requestPermission();

      const {email, password} = this.state;

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        await user_login(email, password).then(res => {
          console.log(res);
          if (res) {
            if (res.status === 200) {
              console.log('stroed user');

              const userId = res.data.data.id;
              const userKey = res.data.data.key;
              const userBearerToken = res.data.data.token;

              AsyncStorage.setItem('user-id', JSON.stringify(userId));
              AsyncStorage.setItem('user-key', userKey);
              AsyncStorage.setItem('bearer-token', userBearerToken);
              // console.log(res.data.data);

              // set user personal FCM Token
              messaging()
                .getToken()
                .then(token => {
                  user_fcm_token(userId, token, userKey, userBearerToken).then(
                    res => {
                      // console.log(res.status);
                      if (res.status === 201) {
                        console.log('stored fcm token');
                      }
                    },
                  );
                  console.log('FCM Token: ' + token);
                });

              console.log('logged in');
              this.props.navigation.dispatch(StackActions.replace('Pages'));
            } else {
              Alert.alert('Login Gagal', 'Email atau Password Anda salah');
              console.log('failed to login');
              this.setState({isLoading: false});
            }
          }
        });

        console.log('Authorization status:', authStatus);
      } else {
        this.setState({isLoading: false});

        this.onDisplayNotification();
      }
    } catch (error) {
      Alert.alert('Error', error.response);
      console.log('failed to login');
      this.setState({isLoading: false});
      console.error(error);
    }
  };

  handleSignUp = () => {
    this.props.navigation.navigate('Register');
  };

  handleForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Bounce
          size={48}
          color={theme['color-secondary-500']}
          style={[
            styles.spinkitLoader,
            {display: this.state.isLoading ? 'flex' : 'none'},
          ]}
        />
        <ScrollView>
          <View style={styles.spacer} />
          <Layout style={styles.layout}>
            <Card style={styles.card}>
              <KeyboardAvoidingView enabled>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={email => this.setState({email})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme['color-primary-500']}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={password => this.setState({password})}
                  placeholderTextColor={theme['color-primary-500']}
                  secureTextEntry
                />

                <TouchableOpacity onPress={this.handleForgotPassword}>
                  <Text style={styles.forgotText}>Lupa Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleLogin}>
                  <Text style={styles.buttonText}>
                    <MaterialCommunityIcons name="lock" size={16} /> LOGIN
                  </Text>
                </TouchableOpacity>

                <Text style={styles.buttonSignUpText}>
                  <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={this.handleSignUp}>
                    <Text style={styles.signUpText}>Belum Punya Akun? </Text>
                  </TouchableOpacity>
                </Text>
              </KeyboardAvoidingView>
            </Card>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

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
  container: {
    flex: 1,
    backgroundColor: theme['color-dark-500'],
  },

  layout: {
    backgroundColor: theme['color-dark-500'],
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  card: {
    marginTop: 200,
    width: '80%',
    paddingVertical: 20,
    backgroundColor: theme['color-primary-500'],
    borderRadius: 15,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // Add your styles here
    borderColor: 'black', // Add your styles here
    padding: 10, // Add your styles here
  },
  input: {
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
  button: {
    backgroundColor: theme['color-secondary-500'],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    color: theme['color-secondary-800'],
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotText: {
    // color: theme['color-primary-500'],
    textAlign: 'right',
    marginTop: -5,
    color: theme['color-secondary-400'],
    fontSize: 13,
  },

  signUpButton: {
    backgroundColor: theme['color-primary-500'],
    // paddingVertical: 5,
    paddingHorizontal: 0,
    borderRadius: 4,
    paddingVertical: 0,
  },
  buttonSignUpText: {
    color: theme['color-dark-gray-500'],
    textAlign: 'center',
    marginTop: 13,
  },
  signUpText: {
    color: theme['color-secondary-500'],
    fontWeight: 'bold',
  },
});

export default Login;
