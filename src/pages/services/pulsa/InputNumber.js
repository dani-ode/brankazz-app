import {
  Layout,
  Text,
  Button,
  IconRegistry,
  Icon,
  Card,
  Datepicker,
  Input,
} from '@ui-kitten/components';

import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {getOperator} from '../../../utils/getOperator';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {default as theme} from '../../../../theme.json';
import {Image} from 'react-native';

import Images from '../../../assets/images';

const InputNumber = ({route}) => {
  const {user_balance, category} = route.params;

  const navigation = useNavigation();
  const [number, setNumber] = useState(0);

  useEffect(() => {
    //
  }, []);

  const type = 'prabayar';
  let brandCard = '';
  let brandName = 'XL';

  // Provider Logo
  let OperatorLogo = Images.OperatorLogo.OperatorLogo;

  if (category == 'Games') {
    OperatorLogo = Images.GameLogo.mobileLegendsLogo;
    brandName = 'MOBILE LEGENDS';
  } else {
    if (number.length > 6) {
      const brand = getOperator(number);
      if (brand.message == 'VALID') {
        // console.log(brand);
        // return;
        brandCard = brand.card;

        if (brand.operator === 'Telkomsel') {
          brandName = 'TELKOMSEL';
          OperatorLogo = Images.OperatorLogo.TelkomselLogo;
        } else if (brand.operator === 'Indosat Ooredoo') {
          brandName = 'INDOSAT';
          OperatorLogo = Images.OperatorLogo.IndosatOoredooLogo;
        } else if (brand.operator === 'XL Axiata') {
          brandName = 'XL';
          OperatorLogo = Images.OperatorLogo.XLAxiataLogo;
        } else if (brand.operator === 'Smartfren') {
          brandName = 'SMARTFREN';
          OperatorLogo = Images.OperatorLogo.SmartfrenLogo;
        } else if (brand.operator === 'Net1') {
          brandName = 'NET1';
          OperatorLogo = Images.OperatorLogo.Net1Logo;
        } else if (brand.operator === 'ByRU') {
          brandName = 'by.U';
          OperatorLogo = Images.OperatorLogo.ByRULogo;
        } else if (brand.operator === '3') {
          brandName = 'TRI';
          OperatorLogo = Images.OperatorLogo.TriLogo;
        }

        // brandOperator = brand.operator;

        // console.log(brandOperator);
      }
    }
  }

  const handleProduct = async (by_type, number) => {
    // console.log(by_type, number, brandName);
    if (number.length < 7) {
      alert('Masukkan nomor yang valid');
      return;
    }
    const brand = getOperator(number);
    if (!brand) {
      alert('Masukkan nomor yang valid');
      return;
    }
    if (brand.message === 'INVALID') {
      alert('Masukkan nomor yang valid');
      return;
    }
    const brand_name = brandName;
    navigation.navigate('PriceList', {
      number: number,
      category: category,
      brand: brand_name,
      product_sku_code_type: by_type,
      type: type,
      user_balance: user_balance,
    });
  };

  const sugesstionData = [
    {
      Pulsa: {
        TELKOMSEL: [
          {name: 'Promo', code: 'tsel_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'tsel_r', description: 'Transaksi Cepat'},
          {name: 'Transfer', code: 'tselt_r', description: 'Pulsa Transfer'},
        ],
        INDOSAT: [
          {name: 'Promo', code: 'indosat_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'indosat_r', description: 'Transaksi Cepat'},
        ],
        SMARTFREN: [
          {
            name: 'Promo',
            code: 'smart_p',
            description: 'Harga Termurah',
          },
          {
            name: 'Reguler',
            code: 'smart_r',
            description: 'Transaksi Cepat',
          },
        ],
        TRI: [
          {name: 'Promo', code: 'three_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'three_r', description: 'Transaksi Cepat'},
        ],
        XL: [
          {name: 'Promo', code: 'xl_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'xl_r', description: 'Transaksi Cepat'},
        ],
        'by.U': [
          {name: 'Promo', code: 'byru_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'byru_r', description: 'Transaksi Cepat'},
        ],
      },
    },
    {
      Data: {
        TELKOMSEL: [
          {name: 'Flash', code: 'tseldflash_r', description: 'Transaksi Cepat'},
          {name: 'Combo', code: 'tseldcombo_r', description: 'Combo Sakti'},
          {
            name: 'Midnight',
            code: 'tseldmalam_r',
            description: 'Internet Malam',
          },
          {name: 'Check', code: 'tseld_check_user', description: 'Cek Paket'},
        ],
        INDOSAT: [
          {name: 'Promo', code: 'indosat_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'indosat_r', description: 'Transaksi Cepat'},
        ],
        SMARTFREN: [
          {
            name: 'Promo',
            code: 'smart_p',
            description: 'Harga Termurah',
          },
          {
            name: 'Reguler',
            code: 'smart_r',
            description: 'Transaksi Cepat',
          },
        ],
        TRI: [
          {name: 'Promo', code: 'three_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'three_r', description: 'Transaksi Cepat'},
        ],
        XL: [
          {name: 'Promo', code: 'xl_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'xl_r', description: 'Transaksi Cepat'},
        ],
        'by.U': [
          {name: 'Promo', code: 'byru_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'byru_r', description: 'Transaksi Cepat'},
        ],
      },
    },
    {
      'Paket SMS & Telpon': {
        TELKOMSEL: [
          {
            name: 'Telephone',
            code: 'tselsns_r',
            description: 'Transaksi Cepat',
          },
          {name: 'SMS', code: 'tselns_r', description: 'Combo Sakti'},
        ],
        INDOSAT: [
          {name: 'Promo', code: 'indosat_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'indosat_r', description: 'Transaksi Cepat'},
        ],
        SMARTFREN: [
          {
            name: 'Promo',
            code: 'smart_p',
            description: 'Harga Termurah',
          },
          {
            name: 'Reguler',
            code: 'smart_r',
            description: 'Transaksi Cepat',
          },
        ],
        TRI: [
          {name: 'Promo', code: 'three_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'three_r', description: 'Transaksi Cepat'},
        ],
        XL: [
          {name: 'Promo', code: 'xl_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'xl_r', description: 'Transaksi Cepat'},
        ],
        'by.U': [
          {name: 'Promo', code: 'byru_p', description: 'Harga Termurah'},
          {name: 'Reguler', code: 'byru_r', description: 'Transaksi Cepat'},
        ],
      },
    },
    {
      Games: {
        'MOBILE LEGENDS': [
          {
            name: 'Mobile Legends',
            code: 'mlegend_r',
            description: 'Harga Termurah',
          },
        ],
        'FREE FIRE': [
          {
            name: 'Free Fire',
            code: 'ffire_r',
            description: 'Harga Termurah',
          },
        ],
      },
    },
  ];

  function getCode(category, brand) {
    console.log(category, brand);

    for (const item of sugesstionData) {
      if (item.hasOwnProperty(category)) {
        const categoryData = item[category];
        if (categoryData.hasOwnProperty(brand)) {
          const brandData = categoryData[brand];
          const codes = brandData.map(item => ({
            code: item.code,
            name: item.name,
            description: item.description,
          }));
          return codes.length > 0 ? codes : null; // Return null if no codes found
        } else {
          return [{code: 'null', name: 'null'}]; // Return null if brand not found
        }
      }
    }
    return null; // Return null jika tidak ditemukan
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.layout}>
          <Card style={styles.card}>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="Masukkan Nomor HP"
              autoFocus={true}
              placeholderTextColor={theme['color-primary-800']}
              onChangeText={number => setNumber(number)}
              maxLength={20}
            />
            <View style={styles.sugesstion}>
              {getCode(category, brandName).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme['color-gray-600'],
                    },
                  ]}
                  onPress={() => {
                    handleProduct(item.code, number);
                  }}>
                  <View style={styles.row}>
                    <View style={styles.providerLogoContainer}>
                      <Image
                        style={styles.providerLogo}
                        source={OperatorLogo}
                      />
                    </View>
                    <View style={[styles.column, {flexDirection: 'column'}]}>
                      <Text
                        style={[
                          styles.buttonText,
                          {color: theme['color-primary-100']},
                        ]}>
                        {category}
                        {brandCard ? ' ' + brandCard : ''} {item.name}
                      </Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </View>
                    <Text
                      style={[
                        {
                          color: theme['color-primary-100'],
                          marginLeft: 'auto',
                        },
                      ]}>
                      <MaterialCommunityIcons name="arrow-right" size={20} />
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: theme['color-dark-gray-200'],
  },
  row: {
    flexDirection: 'row',
    // space between
    // justifyContent: 'space-between',
  },
  col: {
    // flex: 1,
  },
  layout: {
    backgroundColor: theme['color-dark-gray-200'],
  },

  card: {
    borderRadius: 15,
    marginVertical: 15,
    paddingVertical: 15,
    backgroundColor: theme['color-dark-500'],
  },

  input: {
    height: 40,
    borderBottomColor: theme['color-dark-gray-400'],
    borderTopColor: theme['color-dark-700'],
    borderLeftColor: theme['color-dark-700'],
    borderRightColor: theme['color-dark-700'],
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 30,
    margin: 10,
    backgroundColor: theme['color-dark-600'],
    color: theme['color-secondary-500'],
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    height: 60,
  },

  sugesstion: {
    backgroundColor: theme['color-dark-gray-600'],
    borderColor: theme['color-primary-700'],
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
    marginBottom: 10,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // borderRadius: 4,
    padding: 5,
    width: '100%',
  },
  buttonText: {
    textAlign: 'right',
    color: theme['color-primary-100'],
  },

  providerLogoContainer: {
    width: 40,
    height: 40,
    padding: 5,
    backgroundColor: theme['color-dark-gray-400'],
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme['color-primary-600'],
  },
  providerLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  description: {
    fontSize: 12,
    color: theme['color-dark-gray-400'],
  },
});

export default InputNumber;
