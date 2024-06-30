import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Layout} from '@ui-kitten/components';

import {transaction_show} from '../../../api/transaction_api';

import {default as theme} from '../../../../theme.json';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Bounce, Plane} from 'react-native-animated-spinkit';

import Clipboard from '@react-native-clipboard/clipboard';

import ViewShot, {captureRef} from 'react-native-view-shot';

import Share from 'react-native-share';
import Images from '../../../assets/images';
import {CommonActions} from '@react-navigation/native';

export default function TransactionDetail({route, navigation}) {
  const {id} = route.params;

  const [transaction, setTransaction] = useState({});
  const ref = useRef();

  useEffect(() => {
    getTransaction();

    if (transaction.block_key == null) {
      const interval = setInterval(() => {
        getTransaction();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, []);

  const copyToClipboard = text => {
    Clipboard.setString(text);
  };

  const handleShare = async () => {
    // take an screenshot and share it
    ref.current.capture().then(uri => {
      console.log('do something with ', uri);

      const options = {
        title: 'Share receipt',
        url: uri,
        failOnCancel: false,
      };

      Share.open(options)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    });
  };

  const getTransaction = async () => {
    try {
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(id, userKey, userBearerToken);

      await transaction_show(id, userKey, userBearerToken).then(res => {
        // console.log(res);
        if (res.status === 200) {
          console.log(res.data.data.status);

          setTransaction(res.data.data);
          // setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  function formatCurrency(amount) {
    amount = Number(amount)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
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
      <View style={styles.container}>
        <ScrollView>
          <Layout style={styles.layout}>
            <ViewShot
              ref={ref}
              options={{
                fileName: 'debitReceipt-' + transaction.id,
                format: 'jpg',
                quality: 0.9,
              }}>
              <Card style={styles.receiptCard}>
                <View style={[styles.row, styles.header]}>
                  <Image
                    source={Images.App.brankazzLogo}
                    style={{height: 28, width: 28, marginRight: 8}}
                  />
                  <View style={styles.headerTitle}>
                    <Text style={styles.title}>BRANKAZZ</Text>
                    <Text style={styles.tagline}>
                      PT. BRANKAZZ ELEKTRONIK INDONESIA
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.labelTitle,
                      {
                        color:
                          transaction.status == 'Gagal'
                            ? 'red'
                            : transaction.status == 'Sukses'
                            ? 'green'
                            : '#2e3d49',
                      },
                    ]}>
                    Status :{' '}
                    {transaction.status == 'Sukses'
                      ? 'Settlement'
                      : transaction.status}
                  </Text>
                  <View>
                    <View style={styles.row}>
                      {/* <Text style={styles.valueTitle}>
                        {transaction.status == 'Sukses' ||
                        transaction.status == 'Gagal' ? (
                          <MaterialCommunityIcons name="printer" size={22} />
                        ) : (
                          <Plane
                            size={22}
                            color={theme['color-secondary-800']}
                          />
                        )}
                      </Text> */}
                      <TouchableOpacity
                        onPress={() => {
                          handleShare();
                        }}>
                        <Text style={styles.valueTitle}>
                          {transaction.status == 'Sukses' ||
                          transaction.status == 'Gagal' ? (
                            <MaterialCommunityIcons name="share" size={22} />
                          ) : (
                            <Plane
                              size={22}
                              color={theme['color-secondary-800']}
                            />
                          )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.line} />
                <View style={styles.transactionInfo}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Akun Penerima</Text>
                    <TouchableOpacity
                      onPress={() => {
                        copyToClipboard(transaction.dest_number);
                      }}>
                      <Text style={styles.value}>
                        {transaction.dest_number}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.row,
                      {
                        display:
                          transaction.product_name == 'kampua'
                            ? 'flex'
                            : 'none',
                      },
                    ]}>
                    <Text style={styles.label}>Nama Penerima</Text>
                    <Text style={styles.value}>{transaction.user_in_name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Harga</Text>
                    <Text style={styles.value}>
                      {formatCurrency(transaction.price)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Deskripsi</Text>
                    <Text style={styles.value}>
                      {transaction.description != ''
                        ? transaction.description
                        : '-'}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Nama Produk</Text>
                    <Text style={styles.value}>
                      {convertToReadable(transaction.product_name)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Kategori</Text>
                    <Text style={styles.value}>
                      {convertToReadable(transaction.product_category)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Brand</Text>
                    <Text style={styles.value}>
                      {convertToReadable(transaction.product_brand)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>SN</Text>
                    <Text style={styles.value}>
                      {transaction.sn !== '' ? transaction.sn : '-'}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>RC</Text>
                    <Text style={styles.value}>
                      {transaction.rc !== '' ? transaction.rc : '-'}
                    </Text>
                  </View>
                  {/* <View style={styles.row}>
                  <Text style={styles.label}>Key Blok</Text>
                  <Text style={styles.value}>
                    {transaction.block_key ?? '-'}
                  </Text>
                </View> */}
                  <View style={styles.row}>
                    <Text style={styles.label}>Tanggal</Text>
                    <Text style={styles.value}>{transaction.date}</Text>
                  </View>

                  <View style={styles.line} />

                  <View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Nama Pengirim</Text>
                      <Text style={styles.value}>
                        {transaction.sender_name}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Akun Pengirim</Text>
                      <Text style={styles.value}>
                        {transaction.sender_account_number}
                      </Text>
                    </View>
                  </View>
                </View>

                <Card style={styles.blockKeyCard}>
                  {/* <View style={styles.row}> */}
                  <Text style={styles.bklabel}>
                    <MaterialCommunityIcons name="key" size={18} />
                  </Text>
                  <Text style={styles.bkvalue}>{transaction.block_key}</Text>
                  {/* </View> */}
                </Card>
                {/* <Text>{JSON.stringify(transaction)}</Text> */}
              </Card>
            </ViewShot>
          </Layout>

          {/* Back To Home Button */}
          <Layout style={styles.backToHomeButtonContainer}>
            <View
              style={[
                styles.backToHomeButton,
                {display: transaction.status == 'Sukses' ? 'flex' : 'none'},
              ]}>
              <TouchableOpacity
                mode="contained"
                onPress={() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Pages'}],
                    }),
                  );
                }}>
                <Text>
                  <MaterialCommunityIcons name="home" size={18} /> Back To Home
                </Text>
              </TouchableOpacity>
            </View>
          </Layout>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // spinkitLoader: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: theme['color-dark-500'],
  //   opacity: 0.7,
  //   position: 'absolute',
  //   zIndex: 1000,
  //   width: '100%',
  //   height: '100%',
  //   top: 0,
  //   left: 0,
  //   bottom: 0,
  //   right: 0,
  // },
  container: {
    flex: 1,
    backgroundColor: theme['color-dark-gray-200'],
  },
  layout: {
    padding: 24,
    backgroundColor: theme['color-dark-gray-200'],
    marginBottom: 50,
  },
  receiptCard: {
    // paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,

    justifyContent: 'start',
  },
  title: {
    fontSize: 14,
    color: theme['color-dark-gray-500'],
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 10,
    color: theme['color-dark-gray-400'],
  },
  line: {
    borderBottomColor: theme['color-dark-gray-300'],
    borderBottomWidth: 1,
    marginVertical: 3, // Adjust this value to change the vertical space around the line
  },
  labelTitle: {
    fontWeight: 'bold',
    color: theme['color-dark-gray-500'],
  },
  valueTitle: {
    fontWeight: 'bold',
    color: theme['color-secondary-800'],
    backgroundColor: theme['color-secondary-300'],
    padding: 5,
    borderRadius: 3,
    marginTop: -10,
  },
  transactionInfo: {
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    color: theme['color-dark-gray-400'],
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    color: theme['color-dark-gray-500'],
    marginTop: 8,
  },

  blockKeyCard: {
    marginTop: 10,
    backgroundColor: theme['color-primary-500'],
    borderColor: theme['color-primary-400'],
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
  },

  bklabel: {
    fontSize: 14,
    color: theme['color-secondary-700'],
    fontWeight: 'bold',
    // marginTop: 15,
    position: 'absolute',
    backgroundColor: theme['color-secondary-500'],
    borderRadius: 3,
  },

  bkvalue: {
    fontSize: 14,
    color: theme['color-dark-gray-100'],
  },

  backToHomeButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme['color-dark-gray-200'],
  },

  backToHomeButton: {
    backgroundColor: theme['color-secondary-500'],
    color: theme['color-secondary-700'],
    borderRadius: 10,
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowColor: theme['color-dark-100'],
    shadowRadius: 20,
    elevation: 3,
    padding: 10,
    // marginTop: 20,
  },
});
