import {Text, Card} from '@ui-kitten/components';

import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';
import {Image} from 'react-native';

import Images from '../../../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {account_ref} from '../../../api/transaction_api';
import {Bounce} from 'react-native-animated-spinkit';

const InputInternetNumber = ({route}) => {
  const {user_balance, category, brand, code} = route.params;
  const navigation = useNavigation();
  const [number, setNumber] = useState(0);

  const [user, setUser] = useState({});

  const [isLoading, setLoading] = useState(false);

  const brand_lowerCase = brand.toLowerCase();

  // Provider Logo
  if (code === 'pasca_int_indihome') {
    FintechLogo = Images.InternetLogo.speedyAndTelkomselLogo;
  } else if (code === 'pasca_int_iconnet') {
    FintechLogo = Images.InternetLogo.iconnectLogo;
  } else if (code === 'pasca_int_myrebpubic') {
    FintechLogo = Images.InternetLogo.myRepublicLogo;
  } else if (code === 'pasca_int_cbn') {
    FintechLogo = Images.InternetLogo.cbnLogo;
  } else if (code === 'pasca_int_telkompstn') {
    FintechLogo = Images.InternetLogo.telkompstnLogo;
  }

  const handlePostPaid = async number => {
    try {
      if (!number || number.length < 3) {
        Alert.alert('Masukkan nomor yang valid');
        return;
      }

      setLoading(true);

      const product_sku_code = code;
      let type = 'pascabayar';

      const dest_number = number;

      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(userBearerToken, userKey, dest_number, product_sku_code);

      // return;

      await postpaid_inquiry(
        userBearerToken,
        userKey,
        dest_number,
        product_sku_code,
      )
        .then(res => {
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
            setLoading(false);
            Alert.alert('Error', res.data.message);
          }
        })
        .catch(err => {
          setLoading(false);
          console.error(err);
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.row, styles.provider]}>
          <View style={styles.providerLogoContainer}>
            <Image style={styles.providerLogo} source={FintechLogo} />
          </View>
          <View style={[styles.column, {flexDirection: 'column'}]}>
            <Text style={styles.description}>{brand}</Text>
          </View>
        </View>
        {/* <View style={styles.row}> */}
        <Card style={styles.card}>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="Masukkan Nomor"
            autoFocus={true}
            placeholderTextColor={theme['color-primary-500']}
            onChangeText={number => setNumber(number)}
            maxLength={20}
          />
        </Card>
        {/* </View> */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePostPaid(number)}>
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
    backgroundColor: theme['color-dark-gray-200'],
    // position: 'relative',
  },
  row: {
    flexDirection: 'row',
    // space between
    // justifyContent: 'space-between',
  },
  provider: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  providerLogoContainer: {
    width: 40,
    height: 40,
    padding: 5,
    backgroundColor: theme['color-primary-100'],
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  providerLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  description: {
    color: theme['color-dark-500'],
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
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

export default InputInternetNumber;
