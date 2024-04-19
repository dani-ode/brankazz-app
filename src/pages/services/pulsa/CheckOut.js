import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {account_ref, transaction_create} from '../../../api/transaction_api';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card} from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';

// import {Table, Row, Rows} from 'react-native-table-component';
import {user_profile} from '../../../api/user_api';

import {Bounce, Wave} from 'react-native-animated-spinkit';

const CheckOut = ({route, navigation}) => {
  const {
    number,
    category,
    brand,
    product_sku_code,
    type,
    product_price,
    user_balance,
    ewalet_check_user_code,
  } = route.params;

  console.log(
    'category = ' + category,
    'brand = ' + brand,
    'code = ' + ewalet_check_user_code,
  );

  const [user, setUser] = useState([['-', '-', '-']]);

  const [isLoading, setLoading] = useState(true);
  const [userWallet, setUserWallet] = useState({});

  const [meterDetail, setMeterDetail] = useState({});
  const [meterName, setMeterName] = useState('naN');
  const [meterId, setMeterId] = useState('0');
  const [meterPower, setMeterPower] = useState('0');

  useEffect(() => {
    getUser();

    if (brand === 'PLN') {
      getMeterDetail();
      const interval = setInterval(() => {
        getMeterDetail();
      }, 5000);
      return () => clearInterval(interval);
    }

    if (ewalet_check_user_code) {
      getUserWallet();
      const interval = setInterval(() => {
        getUserWallet();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const getUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('user-id');
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(userId, userKey, userBearerToken);

      await user_profile(userId, userKey, userBearerToken).then(res => {
        if (res) {
          if (res.status === 200) {
            setUser(res.data.data);
            // setLoading(false);

            setLoading(false);
          } else {
            Alert.alert('Error', res.data.message, [
              {text: 'OK', onPress: () => navigation.goBack()},
            ]);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getMeterDetail = async () => {
    try {
      const brand_name = brand.toLowerCase();

      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      const product_sku_code = 'pln_check_user';

      console.log(number, brand_name, type, user_balance);

      await account_ref(
        userKey,
        userBearerToken,
        number,
        product_sku_code,
        brand_name,
      ).then(res => {
        if (res.status === 200) {
          // let string = 'NURDIN[id]323201372948[power]R1 /000001300';
          let string = res.data.data.name;

          // Split the string based on the delimiters
          let parts = string.split(/\[|\]/);

          // Extract the values and assign them to variables
          let name = parts[0];
          let id = parts[2];
          let power = parts[4];

          console.log('name =', name);
          console.log('id =', id);
          console.log('power =', power);

          setMeterName(name);
          setMeterId(id);
          setMeterPower(power);

          console.log(res.data.data);
          setMeterDetail(res.data.data);
        }
      });
    } catch (error) {
      Alert.alert('Error', error.response);
      console.error(error);
    }
  };

  const getUserWallet = async () => {
    try {
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      const product_sku_code = ewalet_check_user_code;

      await account_ref(
        userKey,
        userBearerToken,
        number,
        product_sku_code,
        brand,
      ).then(res => {
        if (res) {
          if (res.status === 200) {
            //   console.log(res.data.data.name);
            setUserWallet(res.data.data);
          }
        } else {
          Alert.alert('Error', res.data.message, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
        }
      });
    } catch (error) {
      Alert.alert('Error', error.response);
      console.error(error);
    }
  };

  const submit = async (number, product_sku_code, category, brand, type) => {
    try {
      setLoading(true);

      const dest_number = number;
      // const product_sku_code = product_sku_code;
      const product_category = category;
      const product_brand = brand;
      const product_type = type;
      const amount = product_price;
      const connection = 'digiflazz';
      const description =
        description ?? 'Transaksi ' + category + ' ' + brand + ' ' + type;

      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(
        userBearerToken,
        userKey,
        dest_number,
        product_sku_code,
        product_category,
        product_brand,
        product_type,
        amount,
        connection,
        description,
      );
      await transaction_create(
        userBearerToken,
        userKey,
        dest_number,
        product_sku_code,
        product_category,
        product_brand,
        product_type,
        amount,
        connection,
        description,
      )
        .then(res => {
          // console.log(res.status);
          setLoading(false);
          if (res) {
            if (res.status === 201) {
              console.log(res.data.data);
              console.log('Transaction ID' + res.data.data.id);

              navigation.replace('TransactionDetail', {id: res.data.data.id});
            }
          } else {
            Alert.alert('Error', 'Terjadi kesalahan, silahkan coba lagi');
          }
        })
        .catch(err => {
          Alert.alert('Error', err.response.data.message);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  function convertToReadable(text) {
    if (!text) {
      return text;
    }
    // Pisahkan kata-kata dengan underscore
    let words = text.split('_');

    // Ubah setiap kata menjadi huruf kapital di awal
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    // Gabungkan kembali kata-kata menjadi satu string
    let result = words.join(' ');

    return result;
  }

  function formatCurrency(amount) {
    amount = amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  function replaceXWithAsterisk(name) {
    return name.replace(/X/g, '*');
  }

  // const [tableHead, setTableHead] = useState(['Head', 'Head2']);
  // const [tableData, setTableData] = useState([
  //   ['1', '2'],
  //   ['a', 'b'],
  //   ['1', '2'],
  //   ['a', 'b'],
  // ]);

  const PlnUserDetail = () => {
    if (meterId == '0') {
      return null;
    }

    return (
      <>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.text}>Nama </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.textValue}>{meterName}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.text}>Subscriber ID</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.textValue}>{meterId}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.text}>Segment Power </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.textValue}>{meterPower}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Card style={styles.card}>
            {/* <Text style={styles.title}></Text> */}
            {/* <Table
              style={styles.table}
              borderStyle={{
                borderWidth: 2,
                borderColor: theme['color-primary-200'],
              }}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
              <Rows data={tableData} textStyle={styles.text} />
            </Table> */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Number </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{number}</Text>
              </View>
            </View>
            {ewalet_check_user_code ? (
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.text}>Nama </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.textValue}>
                    {userWallet.name ? (
                      replaceXWithAsterisk(userWallet.name)
                    ) : !ewalet_check_user_code ? (
                      'tanpa cek nama'
                    ) : (
                      <Wave size={16} color={theme['color-primary-600']} />
                    )}
                  </Text>
                </View>
              </View>
            ) : null}
            <PlnUserDetail />
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Kategory </Text>
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
                <Text style={styles.textValue}>{convertToReadable(type)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Product Price</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>
                  {formatCurrency(product_price)}
                </Text>
              </View>
            </View>
            <View style={styles.line} />
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Discount</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>-</Text>
              </View>
            </View>
          </Card>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              submit(
                number,
                product_sku_code,
                category.toLowerCase(),
                brand.toLowerCase(),
                type.toLowerCase(),
              );
            }}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.totalText}>
                  Total : {formatCurrency(product_price)},00
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
    // fontSize: 15,
  },
  textValue: {
    textAlign: 'right',
    color: theme['color-dark-500'],
    fontSize: 15,
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
export default CheckOut;
