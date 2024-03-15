import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {transaction_create} from '../../../api/transaction_api';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card} from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';

// import {Table, Row, Rows} from 'react-native-table-component';
import {user_profile} from '../../../api/user_api';

import {Bounce} from 'react-native-animated-spinkit';

const CheckoutKmp = ({route, navigation}) => {
  const {category, brand, type, number, partner_name} = route.params;

  const [user, setUser] = useState({});

  const [nominal, setNominal] = useState('');
  const [description, setDescription] = useState('');

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('user-id');
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(userId, userKey, userBearerToken);

      await user_profile(userId, userKey, userBearerToken).then(res => {
        if (res.status === 200) {
          setUser(res.data.data);
          // setLoading(false);

          setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async (number, nominal) => {
    try {
      setLoading(true);

      const product_sku_code = 'kmp_' + nominal;

      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(
        number,
        product_sku_code,
        category,
        brand,
        type,
        nominal,
        userKey,
        userBearerToken,
      );
      await transaction_create(
        number,
        product_sku_code,
        category,
        brand,
        type,
        nominal,
        userKey,
        userBearerToken,
      ).then(res => {
        // console.log(res.status);
        if (res.status === 201) {
          console.log(res.data.data);
          console.log('Transaction ID' + res.data.data.id);

          setLoading(false);
          navigation.replace('TransactionDetail', {id: res.data.data.id});
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
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Card style={styles.card}>
            <View style={styles.nominal}>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                placeholder="Nominal"
                autoFocus={true}
                placeholderTextColor={theme['color-primary-500']}
                onChangeText={nominal => setNominal(nominal)}
                maxLength={20}
              />
              <TextInput
                style={styles.inputDescription}
                placeholder="Catatan ..."
                placeholderTextColor={theme['color-primary-500']}
                onChangeText={description => setDescription(description)}
                maxLength={20}
              />
            </View>

            <View style={styles.line} />
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Number </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{number}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Nama </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{partner_name}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Category </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{category}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Brand </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{brand}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Type</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{type}</Text>
              </View>
            </View>

            {/* <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Discount</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>-</Text>
              </View>
            </View> */}
          </Card>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              submit(number, nominal);
            }}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.totalText}>
                  {/* Total : {formatCurrency(product_price)},00 */}
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
      <Bounce
        size={48}
        color={theme['color-secondary-500']}
        style={[styles.spinkitLoader, {display: isLoading ? 'flex' : 'none'}]}
      />
    </>
  );
};

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
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: theme['color-dark-gray-200'],
  },
  line: {
    borderBottomColor: theme['color-dark-gray-300'],
    borderBottomWidth: 1,
    marginVertical: 10, // Adjust this value to change the vertical space around the line
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
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  text: {
    color: theme['color-dark-gray-500'],
    marginTop: 5,
    // fontSize: 15,
  },
  textValue: {
    textAlign: 'right',
    color: theme['color-dark-500'],
    fontSize: 15,
    marginTop: 5,
  },
  input: {
    height: 52,
    borderColor: theme['color-primary-400'],
    backgroundColor: theme['color-primary-100'],
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 24,
    fontSize: 25,
    zIndex: 100,

    borderRadius: 10,
  },
  inputDescription: {
    height: 52,
    borderColor: theme['color-primary-200'],
    backgroundColor: theme['color-primary-300'],
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingTop: 25,
    marginTop: -12,
    borderRadius: 10,
    color: theme['color-primary-800'],
    // borderBlockColor: theme['color-primary-300'],
  },
  button: {
    height: 48,
    backgroundColor: theme['color-secondary-500'],
    paddingVertical: 12,
    paddingHorizontal: 25,
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
export default CheckoutKmp;
