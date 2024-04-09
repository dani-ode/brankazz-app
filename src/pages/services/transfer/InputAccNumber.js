import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import {default as theme} from '../../../../theme.json';
import {Card} from '@ui-kitten/components';
import {TextInput} from 'react-native-gesture-handler';

import {user_by_number} from '../../../api/blockhain_api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InputAccNumber({route, navigation}) {
  const {user_balance} = route.params;
  const [number, setNumber] = useState('');
  const [partner, setPartner] = useState({});
  category = 'e_money';
  brand = 'kampua';
  type = 'transfer';

  function generateChecksum(accountNumber) {
    // Remove spaces and dashes from the account number
    accountNumber = accountNumber.replace(/ |-/g, '');

    // Calculate the checksum using the Luhn algorithm
    let checksum = 0;
    let length = accountNumber.length;
    let parity = length % 2;
    for (let i = 0; i < length; i++) {
      let digit = parseInt(accountNumber[i]);
      if (i % 2 === parity) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      checksum += digit;
    }
    checksum %= 10;
    if (checksum !== 0) {
      checksum = 10 - checksum;
    }

    return checksum;
  }

  function validateNumber(accountNumber) {
    // Remove spaces and dashes from the account number
    accountNumber = accountNumber.replace(/ |-/g, '');

    // Extract the checksum from the account number
    let checksum = parseInt(accountNumber.slice(-1));

    // Remove the checksum from the account number
    let accountNumberWithoutChecksum = accountNumber.slice(0, -1);

    // Calculate the checksum using the Luhn algorithm
    let checksumCalculated = generateChecksum(accountNumberWithoutChecksum);

    // Validate the checksum
    return checksum === checksumCalculated;
  }

  const getPartner = async ({user_balance, category, brand, type, number}) => {
    try {
      if (!validateNumber(number)) {
        Alert.alert(
          'Terjadi kesalahan',
          'Cek nomor tujuan Anda sebelum mencoba lagi',
        );
        return;
      }

      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      await user_by_number(number, userKey, userBearerToken)
        .then(res => {
          // console.log('Response: ' + res);

          if (res) {
            if (res.status === 200) {
              setPartner(res.data.data);
              navigation.navigate('ServiceTransferCheckout', {
                user_balance: user_balance,
                category: category,
                brand: brand,
                type: type,
                number: number,
                partner_name: res.data.data.name,
                amount_code: '01',
                set_amount: '0',
                set_description: '-',
              });
            }
          } else {
            Alert.alert(
              'Terjadi kesalahan',
              'Cek nomor tujuan Anda sebelum mencoba lagi',
            );
          }
        })
        .catch(error => {
          console.error(error);
        });
    } catch (error) {
      // Alert.alert('Error', error.response);
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
            placeholder="Masukkan Address KMP"
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
            getPartner({
              user_balance: user_balance,
              category: category,
              brand: brand,
              type: type,
              number: number,
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
