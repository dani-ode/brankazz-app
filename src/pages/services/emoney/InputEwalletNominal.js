import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {account_ref, postpaid_inquiry} from '../../../api/transaction_api';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card} from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';

// import {Table, Row, Rows} from 'react-native-table-component';
import {user_profile} from '../../../api/user_api';

import {Bounce, Wave} from 'react-native-animated-spinkit';

const InputEwalletNominal = ({route, navigation}) => {
  const {
    user_balance,
    category,
    brand,
    number,
    name,
    code,
    relativeCode,
    checkUserCode,
  } = route.params;

  console.log(
    user_balance,
    category,
    brand,
    number,
    name,
    code,
    relativeCode,
    checkUserCode,
  );

  const [user, setUser] = useState({});
  const [userWallet, setUserWallet] = useState({});

  const [nominal, setNominal] = useState('');
  const [description, setDescription] = useState('');

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getUser();

    if (checkUserCode) {
      getUserWallet();
      if (userWallet == null) {
        const interval = setInterval(() => {
          getUserWallet();
        }, 5000);
        return () => clearInterval(interval);
      }
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
          }
        } else {
          Alert.alert('Error', res.data.message, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getUserWallet = async () => {
    try {
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      const product_sku_code = checkUserCode;

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

  const submit = async (number, nominal) => {
    try {
      if (!relativeCode) {
        Alert.alert('Error', 'Saat ini ' + brand + ' hanya untuk pascabayar');
        return;
      }
      if (!checkUserCode && !userWallet.name) {
        Alert.alert(
          'Nama belum ditemukan',
          'Pastikan nomor yang anda masukkan benar',
        );
        return;
      }
      if (!nominal) {
        Alert.alert('Error', 'Nominal harus diisi');
        return;
      }

      if (nominal == '') {
        setLoading(false);
        Alert.alert('Perhatian', 'Nominal harus diisi');
        return;
      }

      const amount = nominal.replace(/\./g, '');

      const intAmount = parseInt(amount);

      if (intAmount < 2000) {
        setLoading(false);
        Alert.alert(
          'Nominal Kurang',
          'Saat ini minimal transfer ke E-Wallet 2.000',
        );
        return;
      }
      if (intAmount > 500000) {
        setLoading(false);
        Alert.alert(
          'Nominal melebihi',
          'Saat ini Anda hanya bisa mengirim maksimal 500.000 ke E-Wallet',
        );
        return;
      }

      // .toString().replace(/./g, '')

      setLoading(true);

      const product_sku_code = relativeCode;
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

      console.log(
        userBearerToken,
        userKey,
        dest_number,
        product_sku_code,
        amount,
      );
      await postpaid_inquiry(
        userBearerToken,
        userKey,
        dest_number,
        product_sku_code,
        amount,
      ).then(res => {
        // console.log(res.status);
        if (res) {
          if (res.status === 201) {
            console.log(res.data.data);

            // Extracting desired data
            const admin_fee = res.data.data.digiflazz_data.admin;
            const product_price = res.data.data.digiflazz_data.selling_price;
            const ref_id = res.data.data.digiflazz_data.ref_id;
            const signature = res.data.data.signature;

            // console.log(admin_fee, product_price, ref_id, signature);

            setLoading(false);
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

  const handleProduct = async (by_type, number) => {
    const brand_name = brand.toUpperCase();

    let type = 'prabayar';

    let product_category = category;
    if (category == 'e_wallet') {
      product_category = 'E-Money';
    }

    console.log(number, category, brand_name, by_type, type, user_balance);

    navigation.navigate('PriceList', {
      number: number,
      category: product_category,
      brand: brand_name,
      product_sku_code_type: by_type,
      type: type,
      user_balance: user_balance,
      ewalet_check_user_code: checkUserCode,
    });
  };

  function formatCurrency(amount) {
    amount = amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  const formatAmount = value => {
    // Remove zero on the left
    let formattedValue = value.replace(/^0+/, '');

    // Remove non-digit characters
    formattedValue = formattedValue.replace(/\D/g, '');

    // Format the number with commas
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return formattedValue;
  };
  // Function to handle input change
  const handleInputChange = text => {
    const formattedValue = formatAmount(text);
    // console.log(formattedValue);
    setNominal(formattedValue);
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

  function replaceXWithAsterisk(name) {
    return name.replace(/X/g, '*');
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Card style={styles.card}>
            <View style={{display: relativeCode ? 'flex' : 'none'}}>
              <View style={styles.nominal}>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="Nominal"
                  autoFocus={true}
                  value={nominal}
                  placeholderTextColor={theme['color-primary-500']}
                  onChangeText={nominal => handleInputChange(nominal)}
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
            </View>
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
                <Text style={styles.textValue}>
                  {userWallet.name ? (
                    replaceXWithAsterisk(userWallet.name)
                  ) : !checkUserCode ? (
                    'tanpa cek nama'
                  ) : (
                    <Wave size={16} color={theme['color-primary-600']} />
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Category </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>
                  {convertToReadable(category)}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Brand </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{brand.toUpperCase()}</Text>
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

          <View style={{display: relativeCode ? 'flex' : 'none'}}>
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
                    Lanjutkan{' '}
                    <MaterialCommunityIcons name="arrow-right" size={18} />
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.sepparator}> ---- Atau Pilih Nominal ----</Text>
          </View>
          <View style={styles.sugesstion}>
            <TouchableOpacity
              style={[
                styles.buttonSugestion,
                {
                  backgroundColor: theme['color-primary-600'],
                },
              ]}
              onPress={() => {
                handleProduct(code + 'r', number);
              }}>
              <Text style={styles.description}>
                Top Up {brand.toUpperCase()} Promo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonSugestion,
                {
                  backgroundColor: theme['color-primary-500'],
                },
              ]}
              onPress={() => {
                handleProduct(code + 'adm', number);
              }}>
              <Text style={styles.description}>
                Top Up {brand.toUpperCase()} Admin 2.000
              </Text>
            </TouchableOpacity>
          </View>
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
    fontWeight: 'bold',
    borderRadius: 10,
    color: theme['color-dark-500'],
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
    marginBottom: 15,
    borderColor: theme['color-secondary-600'],
    borderWidth: 1,
  },
  buttonSugestion: {
    marginTop: 15,
    height: 48,
    backgroundColor: theme['color-dark-500'],
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: theme['color-dark-gray-300'],
    borderWidth: 1,
    borderRadius: 15,
  },
  description: {
    color: theme['color-secondary-100'],
    fontWeight: 'bold',
    textAlign: 'center',
    alignContent: 'center',
    fontSize: 15,
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
  sepparator: {
    color: theme['color-dark-gray-500'],
    textAlign: 'center',
  },
});
export default InputEwalletNominal;
