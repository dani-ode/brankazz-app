import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card} from '@ui-kitten/components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../theme.json';

// import {Table, Row, Rows} from 'react-native-table-component';
import {user_profile} from '../../api/user_api';

import {Bounce, Wave} from 'react-native-animated-spinkit';
import {user_by_number} from '../../api/blockhain_api';
import {deposit_create} from '../../api/deposit_api';

const InputDepositNominal = ({route, navigation}) => {
  const {
    partner_kampua_number,
    ask_quantity,
    ask_price,
    payment_method,
    provider_name,
    partner_billing_name,
    partner_billing_number,
  } = route.params;

  const [user, setUser] = useState({});
  const [partner, setPartner] = useState({});

  const [nominal, setNominal] = useState('');
  const [description, setDescription] = useState('');

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
    // getPartner();
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
  //   const getPartner = async () => {
  // try {
  //   const accountNumber = partner_kampua_number;
  //   const userKey = await AsyncStorage.getItem('user-key');
  //   const userBearerToken = await AsyncStorage.getItem('bearer-token');
  //   console.log(accountNumber, userKey, userBearerToken);
  //   await user_by_number(accountNumber, userKey, userBearerToken).then(
  //     res => {
  //       if (res.status === 200) {
  //         setPartner(res.data.data);
  //         // setLoading(false);
  //         setLoading(false);
  //       }
  //     },
  //   );
  // } catch (error) {
  //   console.error(error);
  // }
  //   };

  const getBilling = async () => {
    try {
      //
    } catch (error) {
      Alert.alert('Error', error.response);
      console.error(error);
    }
  };

  const submit = async (nominal, description) => {
    try {
      const method = payment_method;
      const provider = provider_name;
      let amount = nominal.replace(/\./g, '');

      let intAmount = parseInt(amount);

      if (intAmount <= 10000) {
        Alert.alert('Nominal Kurang', 'Minimal deposit 10.000');
        console.log('kurang');
        return;
      }

      const partner = partner_kampua_number;
      const third_party = 'moota';

      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(
        userBearerToken,
        userKey,
        method,
        provider,
        amount,
        partner,
        third_party,
        description,
      );

      setLoading(true);

      await deposit_create(
        userBearerToken,
        userKey,
        method,
        provider,
        amount,
        partner,
        third_party,
        description,
      ).then(res => {
        // console.log(res.status);
        if (res.status === 201) {
          console.log(res.data.data);
          console.log('Deposit ID' + res.data.data.id);

          setLoading(false);
          navigation.replace('DepositDetail', {id: res.data.data.id});
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

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

  function formatCurrency(amount) {
    amount = amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

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
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Number </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{partner_billing_number}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Nama </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>{partner_billing_name}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Tipe </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>
                  {convertToReadable(payment_method)}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.text}>Brand </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textValue}>
                  {provider_name.toUpperCase()}
                </Text>
              </View>
            </View>
          </Card>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              submit(nominal, description);
            }}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.totalText}>
                  {/* Total : {formatCurrency(product_price)},00 */}
                </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.buttonText}>
                  Buat Invoice{' '}
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

    fontWeight: 'bold',
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
export default InputDepositNominal;
