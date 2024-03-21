import React, {Component} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  Login,
  Register,
  ForgotPassword,
  Onboarding,
  Home,
  Promo,
  Profile,
  Qris,
  MutasiDepositScreen,
  MutasiTransactionScreen,
} from '../pages';
import InputAccNumber from '../pages/services/transfer/InputAccNumber';
import CheckoutKmp from '../pages/services/transfer/CheckoutKmp';

import InputNumber from '../pages/services/pulsa/InputNumber';
import PriceList from '../pages/services/pulsa/PriceList';
import CheckOut from '../pages/services/pulsa/CheckOut';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, View} from 'react-native';
import SelectSeller from '../pages/Exchange/SelectSeller';
import BidQueue from '../pages/Exchange/BidQueue';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TransactionDetail from '../pages/Mutasi/Transaction/TransactionDetail';
import FintechList from '../pages/services/emoney/FintechList';
import InputEwalletNumber from '../pages/services/emoney/InputEwalletNumber';
import InputEwalletNominal from '../pages/services/emoney/InputEwalletNominal';
import InputMeterNumber from '../pages/services/pln/InputMeterNumber';
import BankList from '../pages/services/bank/BankList';
import DepositDetail from '../pages/Mutasi/Deposit/DepositDetail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TopTab = createMaterialTopTabNavigator();

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
      component={MutasiPages}
      options={{
        headerShown: false,
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

const MutasiPages = () => (
  <TopTab.Navigator
    screenOptions={{
      // indicatorStyle: {
      //   backgroundColor: '#FFF',
      //   height: 4,
      // },
      tabBarLabelStyle: {fontSize: 12, color: '#FFF'},
      // tabBarItemStyle: {width: 100},
      tabBarStyle: {backgroundColor: '#2e3d49'},
      // textColor: 'white',
    }}>
    <TopTab.Screen name="Dana Keluar" component={MutasiTransactionScreen} />
    <TopTab.Screen name="Dana Masuk" component={MutasiDepositScreen} />
  </TopTab.Navigator>
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
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{title: ''}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{title: 'Lupa Password'}}
          />
          <Stack.Screen
            name="Pages"
            component={Pages}
            options={{headerShown: false}}
          />

          {/* Exchange */}

          <Stack.Screen
            name="ExchangeSelectSeller"
            component={SelectSeller}
            options={{title: 'Exchange'}}
            initialParams={{
              account_number: '',
              ask_quantity: '',
              ask_price: '',
              user_name: '',
            }}
          />

          <Stack.Screen
            name="ExchangeBidQueue"
            component={BidQueue}
            options={{title: 'Antrian Penawaran'}}
          />

          {/* services ---------------- */}

          {/* Transfer KMP coin */}
          <Stack.Screen
            name="ServiceTransferInputNumber"
            component={InputAccNumber}
            options={{title: 'Transfer KMP'}}
            initialParams={{
              user_balance: '',
              category: '',
            }}
          />
          <Stack.Screen
            name="ServiceTransferCheckout"
            component={CheckoutKmp}
            options={{title: 'Masukkan nominal'}}
            initialParams={{
              user_balance: '',
              category: '',
              brand: '',
              type: '',
              number: '',
              partner_name: '',
            }}
          />

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

          {/* PLN */}
          <Stack.Screen
            name="ServicePlnInputMeterNumber"
            component={InputMeterNumber}
            options={{title: 'Masukkan Nomor'}}
            initialParams={{
              user_balance: '',
              category: '',
            }}
          />

          {/* E-Wallet */}
          <Stack.Screen
            name="ServiceEwaletFintechList"
            component={FintechList}
            options={{title: 'Pilih E-Wallet'}}
            initialParams={{
              user_balance: '',
              category: '',
            }}
          />
          <Stack.Screen
            name="ServiceEwaletInputNumber"
            component={InputEwalletNumber}
            options={{title: 'Masukkan Nomor'}}
            initialParams={{
              user_balance: '',
              category: '',
              brand: '',
              code: '',
            }}
          />
          <Stack.Screen
            name="ServiceEwalletInputNominal"
            component={InputEwalletNominal}
            options={{title: 'Masukkan Nominal'}}
            initialParams={{
              user_balance: '',
              category: '',
              brand: '',
              code: '',
              number: '',
              name: '',
              code: '',
            }}
          />
          {/* Bank */}
          <Stack.Screen
            name="ServiceBankList"
            component={BankList}
            options={{title: 'Pilih Bank'}}
            initialParams={{
              user_balance: '',
              category: '',
            }}
          />
          <Stack.Screen
            name="ServiceBankInputAccountNumber"
            component={InputEwalletNumber}
            options={{title: 'Masukkan Nomor'}}
            initialParams={{
              user_balance: '',
              category: '',
              brand: '',
              code: '',
            }}
          />

          {/* End services ---------------- */}

          {/* Mutasi transaction detail */}
          <Stack.Screen
            name="TransactionDetail"
            component={TransactionDetail}
            options={{title: 'Transaction Detail'}}
            initialParams={{
              id: '',
            }}
          />
          <Stack.Screen
            name="DepositDetail"
            component={DepositDetail}
            options={{title: 'Deposit Detail'}}
            initialParams={{
              id: '',
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
