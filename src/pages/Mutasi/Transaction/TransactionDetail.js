import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Layout} from '@ui-kitten/components';

import {transaction_show} from '../../../api/transaction_api';

import {default as theme} from '../../../../theme.json';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Bounce, Plane} from 'react-native-animated-spinkit';

export default function TransactionDetail({route}) {
  const {id} = route.params;

  const [transaction, setTransaction] = useState({});

  useEffect(() => {
    getTransaction();
    const interval = setInterval(() => {
      getTransaction();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const getTransaction = async () => {
    try {
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(id, userKey, userBearerToken);

      await transaction_show(id, userKey, userBearerToken).then(res => {
        // console.log(res);
        if (res.status === 200) {
          console.log(res.data.data.status);
          setTransaction(res.data.data);
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
                <Text style={styles.labelTitle}>
                  Status : {transaction.status}
                </Text>
                <Text style={styles.valueTitle}>
                  {transaction.status == 'Sukses' ||
                  transaction.status == 'Gagal' ? (
                    <MaterialCommunityIcons name="printer" size={22} />
                  ) : (
                    <Plane size={22} color={theme['color-secondary-800']} />
                  )}
                </Text>
              </View>
              <View style={styles.line} />
              <View style={styles.row}>
                <Text style={styles.label}>Penerima</Text>
                <Text style={styles.value}>{transaction.dest_number}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Harga</Text>
                <Text style={styles.value}>
                  {formatCurrency(transaction.price)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nama Produk</Text>
                <Text style={styles.value}>{transaction.product_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Kategori</Text>
                <Text style={styles.value}>{transaction.product_category}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Brand</Text>
                <Text style={styles.value}>{transaction.product_brand}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>SN</Text>
                <Text style={styles.value}>
                  {transaction.sn !== '' ? transaction.sn : '-'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Deskripsi</Text>
                <Text style={styles.value}>
                  {transaction.description !== ''
                    ? transaction.description
                    : '-'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Key Blok</Text>
                <Text style={styles.value}>{transaction.block_key ?? '-'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tanggal</Text>
                <Text style={styles.value}>{transaction.date}</Text>
              </View>
              {/* <Text>{JSON.stringify(transaction)}</Text> */}
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
