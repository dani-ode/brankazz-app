import React from 'react';
import {
  Button,
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

import {user_login} from '../../../api/user_api';
import {Card, Layout} from '@ui-kitten/components';

import {default as theme} from '../../../../theme.json';
import {Bounce} from 'react-native-animated-spinkit';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
    };
    this.getData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('bearer-token');
      if (value !== null) {
        this.props.navigation.dispatch(StackActions.replace('Pages'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleLogin = async () => {
    try {
      this.setState({isLoading: true});

      const {email, password} = this.state;
      await user_login(email, password).then(res => {
        if (res.status === 200) {
          AsyncStorage.setItem('user-id', JSON.stringify(res.data.data.id));
          AsyncStorage.setItem('user-key', res.data.data.key);
          AsyncStorage.setItem('bearer-token', res.data.data.token);

          this.props.navigation.dispatch(StackActions.replace('Pages'));
        }
      });
    } catch (error) {
      this.setState({isLoading: false});
      console.error(error);
    }
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
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleLogin}>
                <Text style={styles.buttonText}>
                  <MaterialCommunityIcons name="lock" size={16} /> Login
                </Text>
              </TouchableOpacity>
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
    color: theme['color-dark-500'],
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Login;
