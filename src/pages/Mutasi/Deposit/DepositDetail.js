import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Layout} from '@ui-kitten/components';

import {deposit_show} from '../../../api/deposit_api';

import {default as theme} from '../../../../theme.json';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Bounce, Plane} from 'react-native-animated-spinkit';

import Clipboard from '@react-native-clipboard/clipboard';

export default function DepositDetail({route}) {
  const {id} = route.params;

  const [deposit, setDeposit] = useState({});

  useEffect(() => {
    getDeposit();

    if (deposit == null) {
      const interval = setInterval(() => {
        getDeposit();
      }, 2500);

      return () => clearInterval(interval);
    }
  }, []);

  const copyToClipboard = text => {
    Clipboard.setString(text);
  };

  const getDeposit = async () => {
    try {
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(id, userKey, userBearerToken);

      await deposit_show(id, userKey, userBearerToken).then(res => {
        // console.log(res);
        if (res.status === 200) {
          console.log(res.data.data.status);
          setDeposit(res.data.data);
          // setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  function formatCurrency(amount) {
    amount = Number(amount)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Layout style={styles.layout}>
            <Card>
              <View style={styles.row}>
                <Text style={styles.labelTitle}>Status : {deposit.status}</Text>
                <Text style={styles.valueTitle}>
                  {deposit.status == 'settlement' ||
                  deposit.status == 'Gagal' ? (
                    <MaterialCommunityIcons name="printer" size={22} />
                  ) : (
                    <Plane size={22} color={theme['color-secondary-800']} />
                  )}
                </Text>
              </View>
              <View style={styles.line} />
              <View style={styles.row}>
                <Text style={styles.label}>Harga</Text>
                <Text style={styles.value}>
                  {formatCurrency(deposit.amount)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nama Pengirim</Text>
                <Text style={styles.value}>{deposit.user_out_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Akun Pengirim</Text>
                <TouchableOpacity
                  onPress={() => {
                    copyToClipboard(deposit.user_out_account);
                  }}>
                  <Text style={styles.value}>{deposit.user_out_account}</Text>
                </TouchableOpacity>
              </View>
              {/* <Text>{JSON.stringify(deposit)}</Text> */}
            </Card>
          </Layout>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // spinkitLoader: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: theme['color-dark-500'],
  //   opacity: 0.7,
  //   position: 'absolute',
  //   zIndex: 1000,
  //   width: '100%',
  //   height: '100%',
  //   top: 0,
  //   left: 0,
  //   bottom: 0,
  //   right: 0,
  // },
  container: {
    flex: 1,
    backgroundColor: theme['color-dark-gray-200'],
  },
  layout: {
    padding: 24,
    backgroundColor: theme['color-dark-gray-200'],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderBottomColor: theme['color-dark-gray-300'],
    borderBottomWidth: 1,
    marginVertical: 10, // Adjust this value to change the vertical space around the line
  },
  labelTitle: {
    fontWeight: 'bold',
    color: theme['color-dark-gray-500'],
  },
  valueTitle: {
    fontWeight: 'bold',
    color: theme['color-secondary-800'],
    backgroundColor: theme['color-secondary-300'],
    padding: 5,
    borderRadius: 3,
  },
  label: {
    fontSize: 14,
    color: theme['color-dark-gray-400'],
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    color: theme['color-dark-gray-500'],
    marginTop: 8,
  },
});
