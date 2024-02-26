import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {transaction_create} from '../../../api/transaction_api';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card} from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';

const CheckOut = ({route}) => {
  const {
    number,
    category,
    brand,
    product_sku_code,
    type,
    product_price,
    user_balance,
  } = route.params;

  const submit = async (product_sku_code, number, category, brand, type) => {
    const userKey = await AsyncStorage.getItem('user-key');
    const userBearerToken = await AsyncStorage.getItem('bearer-token');

    console.log(
      product_sku_code,
      number,
      category,
      brand,
      type,
      userKey,
      userBearerToken,
    );

    try {
      await transaction_create(
        product_sku_code,
        number,
        category,
        brand,
        type,
        userKey,
        userBearerToken,
      ).then(res => {
        console.log(res);
        if (res.status === 200) {
          console.log(res.data.data);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  function formatCurrency(amount) {
    amount = amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Text style={styles.title}></Text>
          <View>
            <Text>Number : {number}</Text>
            <Text>Category : {category}</Text>
            <Text>Brand : {brand}</Text>
            <Text>Buyer SKU Code : {product_sku_code}</Text>
            <Text>Type : {type}</Text>
            <Text>Product Price : {product_price}</Text>
            <Text>User Balance : {user_balance}</Text>
          </View>
        </Card>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            submit(
              product_sku_code,
              number,
              category.toLowerCase(),
              brand.toLowerCase(),
              type.toLowerCase(),
            );
          }}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.totalText}>
                Rp {formatCurrency(product_price)},00
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.buttonText}>
                Check Out{' '}
                <MaterialCommunityIcons name="arrow-right" size={18} />
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: theme['color-dark-gray-200'],
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  card: {
    marginTop: 15,
    backgroundColor: theme['color-primary-200'],
    // borderRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 30,
    margin: 10,
  },
  button: {
    height: 48,
    backgroundColor: theme['color-secondary-500'],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 25,
    borderColor: theme['color-secondary-600'],
    borderWidth: 1,
  },
  totalText: {
    color: theme['color-secondary-900'],
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 15,
  },
  buttonText: {
    color: theme['color-secondary-900'],
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 15,
  },
});
export default CheckOut;
