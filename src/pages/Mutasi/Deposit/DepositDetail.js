import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Layout} from '@ui-kitten/components';

import {deposit_show} from '../../../api/deposit_api';

import {default as theme} from '../../../../theme.json';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Bounce, Plane} from 'react-native-animated-spinkit';

import Clipboard from '@react-native-clipboard/clipboard';
import Images from '../../../assets/images';
import ViewShot from 'react-native-view-shot';

import Share from 'react-native-share';

export default function DepositDetail({route}) {
  const {id} = route.params;
  const ref = useRef();

  const [deposit, setDeposit] = useState({});

  useEffect(() => {
    getDeposit();
    if (deposit.block_key == null) {
      const interval = setInterval(() => {
        getDeposit();
      }, 8000);

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

  const getDeposit = async () => {
    try {
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      console.log(id, userKey, userBearerToken);

      await deposit_show(id, userKey, userBearerToken).then(res => {
        // console.log(res);

        if (res) {
          if (res.status === 200) {
            console.log('Deposit Status : ' + res.data.data.status);
            console.log(res.data.data);
            setDeposit(res.data.data);
            // setLoading(false);
          } else if (res.status === 500) {
            console.log(res);
          }
        } else {
          console.log('No Response');
          console.log(res);
          // setLoading(false);
        }
      });
    } catch (error) {
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
    amount = Number(amount)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Layout style={styles.layout}>
            <ViewShot
              ref={ref}
              options={{
                fileName: 'creditReceipt-' + deposit.id,
                format: 'jpg',
                quality: 0.9,
              }}>
              <Card>
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
                          deposit.status == 'settlement' ? 'green' : 'gray',
                      },
                    ]}>
                    Status : {deposit.status}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleShare();
                    }}>
                    <Text style={styles.valueTitle}>
                      {deposit.status == 'settlement' ||
                      deposit.status == 'Gagal' ? (
                        <MaterialCommunityIcons name="share" size={22} />
                      ) : (
                        <Plane size={22} color={theme['color-secondary-800']} />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.line} />
                <View style={styles.depositInfo}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Harga</Text>
                    <Text style={styles.value}>
                      {formatCurrency(deposit.amount)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Nama Pengirim</Text>
                    <Text style={styles.value}>{deposit.user_out_name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Catatan</Text>
                    <Text style={styles.value}>{deposit.message}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Akun Pengirim</Text>
                    <TouchableOpacity
                      onPress={() => {
                        copyToClipboard(deposit.user_out_account);
                      }}>
                      <Text style={styles.value}>
                        {deposit.user_out_account}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Provider</Text>
                    <Text style={styles.value}>
                      {convertToReadable(deposit.provider_name)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Metode Pembayar</Text>
                    <Text style={styles.value}>
                      {convertToReadable(deposit.payment_method)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Pesan kanal</Text>
                    <Text style={styles.value}>
                      {deposit.channel_response_message != ''
                        ? deposit.channel_response_message
                        : '-'}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Tanggal</Text>
                    <Text style={styles.value}>{deposit.date}</Text>
                  </View>
                </View>

                <View style={styles.line} />

                <View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Nama Penerima</Text>
                    <Text style={styles.value}>{deposit.receiver_name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Akun Pengirim</Text>
                    <Text style={styles.value}>
                      {deposit.receiver_account_number}
                    </Text>
                  </View>
                </View>

                <Card style={styles.blockKeyCard}>
                  {/* <View style={styles.row}> */}
                  <Text style={styles.bklabel}>
                    <MaterialCommunityIcons name="key" size={18} />
                  </Text>
                  <Text style={styles.bkvalue}>{deposit.block_key}</Text>
                  {/* </View> */}
                </Card>
                {/* <Text>{JSON.stringify(deposit)}</Text> */}
              </Card>
            </ViewShot>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderBottomColor: theme['color-dark-gray-300'],
    borderBottomWidth: 1,
    marginVertical: 10, // Adjust this value to change the vertical space around the line
  },
  depositInfo: {
    paddingHorizontal: 10,
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
});
