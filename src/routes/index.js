import React, {Component} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  Login,
  Register,
  ForgotPassword,
  Home,
  Mutasi,
  Promo,
  Profile,
  Qris,
} from '../pages';
import InputNumber from '../pages/services/pulsa/InputNumber';
import PriceList from '../pages/services/pulsa/PriceList';
import CheckOut from '../pages/services/pulsa/CheckOut';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, View} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Pages = () => (
  <Tab.Navigator
    tabBarHideOnKeyboard={true}
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#ABB1B6',
      },
      headerTintColor: 'white',
      headerStyle: {backgroundColor: '#2e3d49'},
      tabBarHideOnKeyboard: true,
    }}>
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false,

        tabBarIcon: ({focused}) => (
          <MaterialCommunityIcons
            name="home"
            size={28}
            color={focused ? '#FFE1AD' : '#2e3d49'}
            marginTop={5}
          />
        ),
        tabBarActiveTintColor: '#FFE1AD',
        tabBarInactiveTintColor: '#2e3d49',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
      tabBarInactiveTintColor="#fff"
      tabBarActiveTintColor="#FFE1AD"
    />
    <Tab.Screen
      name="Mutasi"
      component={Mutasi}
      options={{
        tabBarIcon: ({focused}) => (
          <MaterialCommunityIcons
            name="archive"
            size={28}
            color={focused ? '#FFE1AD' : '#2e3d49'}
            marginTop={5}
          />
        ),
        tabBarActiveTintColor: '#FFE1AD',
        tabBarInactiveTintColor: '#2e3d49',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
      tabBarInactiveTintColor="#fff"
      tabBarActiveTintColor="#FFE1AD"
    />
    <Tab.Screen
      name="Qris"
      component={Qris}
      options={{
        headerShown: false,
        tabBarIcon: ({focused}) => (
          <View style={styles.qris}>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={28}
              color={focused ? '#DBB57E' : '#FFE1AD'}
              // marginTop={5}
              marginBottom={5}
            />
          </View>
        ),
        tabBarActiveTintColor: '#FFE1AD',
        tabBarInactiveTintColor: '#2e3d49',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 15,
          color: '#FFE1AD',
        },
      }}
    />
    <Tab.Screen
      name="Promo"
      component={Promo}
      options={{
        tabBarIcon: ({focused}) => (
          <MaterialCommunityIcons
            name="ticket-percent"
            size={28}
            color={focused ? '#FFE1AD' : '#2e3d49'}
            marginTop={5}
          />
        ),
        tabBarActiveTintColor: '#FFE1AD',
        tabBarInactiveTintColor: '#2e3d49',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
      tabBarInactiveTintColor="#fff"
      tabBarActiveTintColor="#FFE1AD"
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({focused}) => (
          <MaterialCommunityIcons
            name="account"
            size={28}
            color={focused ? '#FFE1AD' : '#2e3d49'}
            marginTop={5}
          />
        ),
        tabBarActiveTintColor: '#FFE1AD',
        tabBarInactiveTintColor: '#2e3d49',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
      tabBarInactiveTintColor="#fff"
      tabBarActiveTintColor="#FFE1AD"
    />
  </Tab.Navigator>
);

export class Routes extends Component {
  render() {
    return (
      <>
        <Stack.Navigator
          screenOptions={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: '#2e3d49'},
          }}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen
            name="Pages"
            component={Pages}
            options={{headerShown: false}}
          />

          {/* services */}

          {/* Pulsa */}
          <Stack.Screen
            name="ServicePulsaInputNumber"
            component={InputNumber}
            options={{title: 'Pulsa'}}
            initialParams={{
              user_balance: '',
              category: '',
            }}
          />
          <Stack.Screen
            name="PriceList"
            component={PriceList}
            options={{title: 'List Harga'}}
            initialParams={{
              number: '',
              category: '',
              brand: '',
              product_sku_code_type: '',
              type: '',
              user_balance: '',
            }}
          />
          <Stack.Screen
            name="CheckOut"
            component={CheckOut}
            options={{title: 'Check Out'}}
            initialParams={{
              number: '',
              category: '',
              brand: '',
              product_sku_code_type: '',
              type: '',
              product_price: '',
              user_balance: '',
            }}
          />
        </Stack.Navigator>
      </>
    );
  }
}

const styles = StyleSheet.create({
  qris: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e3d49',
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: '#ABB1B6',
    borderWidth: 5,
  },
});

export default Routes;
