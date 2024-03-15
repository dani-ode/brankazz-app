import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import {default as theme} from '../../../../theme.json';
import {Card} from '@ui-kitten/components';
import {TextInput} from 'react-native-gesture-handler';

import {user_by_number} from '../../../api/blockhain_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {account_ref} from '../../../api/transaction_api';

export default function InputMeterNumber({route, navigation}) {
  const {user_balance, category} = route.params;
  const [number, setNumber] = useState('');
  const [meter, setMeterDetail] = useState({});

  const brand = 'pln';

  const getMeterDetail = async ({
    user_balance,
    category,
    brand,
    type,
    number,
    by_type,
  }) => {
    try {
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
        if (res.status === 200) {
          navigation.navigate('PriceList', {
            number: number,
            category: product_category,
            brand: brand_name,
            product_sku_code_type: by_type,
            type: type,
            user_balance: user_balance,
          });
        }
      });
    } catch (error) {
      Alert.alert('Error', error.response);
      console.error(error);
    }
  };

  return (
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
  );
}

const styles = StyleSheet.create({
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
