import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import {default as theme} from '../../../../theme.json';
import {Card} from '@ui-kitten/components';
import {TextInput} from 'react-native-gesture-handler';

import {user_by_number} from '../../../api/blockhain_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {account_ref, postpaid_inquiry} from '../../../api/transaction_api';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Bounce} from 'react-native-animated-spinkit';

export default function InputBpjsNumber({route, navigation}) {
  const {user_balance, category} = route.params;
  const [number, setNumber] = useState('');
  const [meter, setMeterDetail] = useState({});

  const [isLoading, setLoading] = useState(false);

  const brand = 'bpjs';

  const getMeterDetail = async ({
    user_balance,
    category,
    brand,
    type,
    number,
    by_type,
  }) => {
    try {
      if (number.length < 11 || number.length > 12) {
        Alert.alert('Masukkan nomor yang valid');
        return;
      }

      setLoading(true);
      const brand_name = brand.toUpperCase();
      const product_category = category.toUpperCase();

      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      const product_sku_code = 'pln_check_user';

      console.log(number, category, brand_name, by_type, type, user_balance);

      await account_ref(
        userKey,
        userBearerToken,
        number,
        product_sku_code,
        brand,
      ).then(res => {
        setLoading(false);
        if (res) {
          if (res.status === 200) {
            navigation.navigate('PriceList', {
              number: number,
              category: product_category,
              brand: brand_name,
              product_sku_code_type: by_type,
              type: type,
              user_balance: user_balance,
            });
          } else {
            Alert.alert('Error', res.data.message);
          }
        } else {
          Alert.alert('Error', 'Something went wrong, please try again later');
        }
      });
    } catch (error) {
      Alert.alert('Error', error.response);
      console.error(error);
    }
  };

  const handlePostPaid = async number => {
    try {
      if (!number || number.length < 11 || number.length > 12) {
        Alert.alert('Masukkan nomor yang valid');
        return;
      }

      setLoading(true);

      const product_sku_code = 'plnpasca';
      let type = 'pascabayar';

      const dest_number = number;
      // const product_sku_code = product_sku_code;
      // const product_category = category;
      // const product_brand = brand;
      // const product_type = type;
      // const connection = 'digiflazz';
      // const description =
      //   description ?? 'Transaksi ' + category + ' ' + brand + ' ' + type;

      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(userBearerToken, userKey, dest_number, product_sku_code);

      await postpaid_inquiry(
        userBearerToken,
        userKey,
        dest_number,
        product_sku_code,
      ).then(res => {
        // console.log(res.status);

        setLoading(false);
        if (res) {
          if (res.status === 201) {
            console.log(res.data.data);

            // Extracting desired data
            const name = res.data.data.digiflazz_data.customer_name;

            const admin_fee = res.data.data.digiflazz_data.admin;
            const product_price = res.data.data.digiflazz_data.selling_price;
            const ref_id = res.data.data.digiflazz_data.ref_id;
            const signature = res.data.data.signature;

            // console.log(admin_fee, product_price, ref_id, signature);

            navigation.replace('EwalletCheckOut', {
              type,
              user_balance,
              category,
              brand,
              product_sku_code,
              ref_id,
              number,
              name,
              admin_fee,
              product_price,
              signature,
            });
          }
        } else {
          Alert.alert('Error', res.data.message);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <Card style={styles.card}>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="Masukkan nomor meter"
              autoFocus={true}
              placeholderTextColor={theme['color-primary-500']}
              onChangeText={number => setNumber(number)}
              maxLength={20}
            />
          </Card>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              Pascabayar?{' '}
              <TouchableOpacity onPress={() => handlePostPaid(number)}>
                <Text style={styles.link}>Bayar Tagihan</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              getMeterDetail({
                user_balance: user_balance,
                category: category,
                brand: brand,
                type: 'prabayar',
                number: number,
                by_type: 'pln_r',
              })
            }>
            <Text style={styles.buttonText}>Lanjutkan</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Bounce
        size={48}
        color={theme['color-secondary-500']}
        style={[styles.spinkitLoader, {display: isLoading ? 'flex' : 'none'}]}
      />
    </>
  );
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
    backgroundColor: theme['color-dark-gray-200'],
    // position: 'relative',
  },
  row: {
    // flexDirection: 'row',
    // space between
    // justifyContent: 'space-between',
  },
  card: {
    marginHorizontal: 25,
    marginVertical: 20,
    backgroundColor: theme['color-dark-gray-100'],
    borderColor: theme['color-primary-500'],
    // borderRightWidth: 0,
  },
  input: {
    backgroundColor: theme['color-dark-gray-200'],
    borderColor: theme['color-primary-700'],
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
    borderRadius: 10,
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowColor: theme['color-dark-100'],
    shadowRadius: 20,
    elevation: 3,
    color: theme['color-dark-500'],
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },

  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    marginVertical: 20,
  },

  label: {
    color: theme['color-dark-500'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  link: {
    color: theme['color-secondary-800'],
    textDecorationLine: 'underline',
    marginBottom: -4,
  },

  submitContainer: {
    backgroundColor: theme['color-dark-gray-500'],

    paddingHorizontal: 25,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1000,
  },
  button: {
    backgroundColor: theme['color-secondary-500'],
    borderRadius: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderColor: theme['color-primary-700'],
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme['color-secondary-800'],
  },
});
