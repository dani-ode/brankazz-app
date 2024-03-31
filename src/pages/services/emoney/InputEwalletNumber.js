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

const InputEwalletNumber = ({route}) => {
  const {user_balance, category, brand, code, relativeCode, checkUserCode} =
    route.params;
  const navigation = useNavigation();
  const [number, setNumber] = useState(0);

  const [user, setUser] = useState({});

  const brand_lowerCase = brand.toLowerCase();

  // Provider Logo
  if (code === 'gopayc_') {
    FintechLogo = Images.FintechLogo.gopaycLogo;
  } else if (code === 'gopayd_') {
    FintechLogo = Images.FintechLogo.gopaydLogo;
  } else if (code === 'linkaja_') {
    FintechLogo = Images.FintechLogo.linkajaLogo;
  } else if (code === 'ovo_') {
    FintechLogo = Images.FintechLogo.ovoLogo;
  } else if (code === 'shppay_') {
    FintechLogo = Images.FintechLogo.shppayLogo;
  } else if (code === 'shppaym_') {
    FintechLogo = Images.FintechLogo.shppaymLogo;
  } else if (code === 'dana_') {
    FintechLogo = Images.FintechLogo.danaLogo;
  } else if (code === 'isaku_') {
    FintechLogo = Images.FintechLogo.isakuLogo;
  } else if (code === 'maximc_') {
    FintechLogo = Images.FintechLogo.maximcLogo;
  } else if (code === 'maximd_') {
    FintechLogo = Images.FintechLogo.maximdLogo;
  } else if (code === 'grabu_') {
    FintechLogo = Images.FintechLogo.grabuLogo;
  } else if (code === 'grabc_') {
    FintechLogo = Images.FintechLogo.grabcLogo;
  } else if (code === 'sakuku_') {
    FintechLogo = Images.FintechLogo.sakukuLogo;
  } else if (code === 'doku_') {
    FintechLogo = Images.FintechLogo.dokuLogo;
  }

  const getUser = async ({user_balance, category, brand, number, code}) => {
    try {
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      const product_sku_code = checkUserCode;

      if (!checkUserCode) {
        navigation.navigate('ServiceEwalletInputNominal', {
          user_balance: user_balance,
          category: category,
          brand: brand,
          number: number,
          name: '',
          code: code,
          relativeCode: relativeCode,
          checkUserCode: checkUserCode,
        });

        return;
      }

      await account_ref(
        userKey,
        userBearerToken,
        number,
        product_sku_code,
        brand,
      ).then(res => {
        if (res.status === 200) {
          console.log(res.data.data.name);
          setUser(res.data.data);
          navigation.navigate('ServiceEwalletInputNominal', {
            user_balance: user_balance,
            category: category,
            brand: brand,
            number: number,
            name: res.data.data.name,
            code: code,
            relativeCode: relativeCode,
            checkUserCode: checkUserCode,
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
          onPress={() =>
            getUser({
              user_balance: user_balance,
              category: category,
              brand: brand_lowerCase,
              number: number,
              code: code,
            })
          }>
          <Text style={styles.buttonText}>Lanjutkan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default InputEwalletNumber;
