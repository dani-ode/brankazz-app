import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';

import {default as theme} from '../../../theme.json';
import {user_logout, user_profile} from '../../api/user_api';
import {RefreshControl, TextInput} from 'react-native-gesture-handler';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Clipboard from '@react-native-clipboard/clipboard';
import {Modal} from '@ui-kitten/components';
import QRCode from 'react-native-qrcode-svg';
import CheckBox from '@react-native-community/checkbox';

import {checkVersion} from 'react-native-check-version';

import DeviceInfo from 'react-native-device-info';
import {check_version} from '../../api/app_init_api';

const ProfileScreen = ({navigation}) => {
  useEffect(() => {
    getUser();
    const interval = setInterval(() => {
      getUser();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [user, setUser] = useState({});

  const [qratonModal, setQratonModal] = useState(false);

  const [qratonType, setQratonType] = useState(false);
  const [qratonAmount, setQratonAmount] = useState(0);
  const [qratonDescription, setQratonDescription] = useState('');

  const [showQraton, setShowQraton] = useState(true);

  const [isLoading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('user-id');
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      if (!userId || !userKey || !userBearerToken) {
        await AsyncStorage.clear();
        navigation.replace('Login');
      }

      await user_profile(userId, userKey, userBearerToken).then(res => {
        if (res) {
          if (res.status === 200) {
            setUser(res.data.data);
            // console.log(res.data.data);
            setLoading(false);
          } else {
            handleLogout();
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const userKey = await AsyncStorage.getItem('user-key');
      const userBearerToken = await AsyncStorage.getItem('bearer-token');

      await user_logout(userKey, userBearerToken).then(res => {
        console.log(res);
      });
      await AsyncStorage.clear();
      setLoading(false);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const generateQRValue = (
    standard,
    type,
    amount,
    accountNumber,
    accountName,
    description,
  ) => {
    let typeStr = '02';
    if (!type) {
      typeStr = '01';
    }

    if (!amount) {
      amount = 0;
    }

    if (!description) {
      description = '-';
    }

    const amountStr = String(amount);

    let amountLengthStr = String(amountStr.length);
    if (amountStr.length < 10) {
      amountLengthStr = '0' + amountLengthStr;
    }

    amountLengthStr = String(amountLengthStr);

    const accountNumberStr = String(accountNumber);
    const accountNameStr = String(accountName);

    let accountNumberLengthStr = String(accountNumberStr.length);

    if (accountNumberStr.length < 10) {
      accountNumberLengthStr = '0' + accountNumberLengthStr;
    }

    let accountNameLengthStr = String(accountNameStr.length);
    if (accountNameStr.length < 10) {
      accountNameLengthStr = '0' + accountNameLengthStr;
    }

    let descriptionLengthStr = String(description.length);
    if (description.length < 10) {
      descriptionLengthStr = '0' + descriptionLengthStr;
    }

    const qrValue = `${standard}${typeStr}${amountLengthStr}${amountStr}${accountNumberLengthStr}${accountNumberStr}${accountNameLengthStr}${accountNameStr}${descriptionLengthStr}${description}`;

    console.log(qrValue);
    return qrValue;
  };

  const data = [
    {
      id: 1,
      image: 'https://img.icons8.com/color/70/000000/administrator-male.png',
      title: 'Edit Akun',
      code: 'EditProfile',
      url: '',
    },
    {
      id: 2,
      image: 'https://img.icons8.com/color/70/000000/cottage.png',
      title: 'Bahasa',
      code: 'SelectLanguage',
      url: '',
    },
    {
      id: 3,
      image: 'https://img.icons8.com/color/70/000000/filled-like.png',
      title: 'Terms of Service',
      code: 'terms',
      url: 'https://brankazz.corpo.id/terms',
    },
    {
      id: 4,
      image: 'https://img.icons8.com/color/70/000000/facebook-like.png',
      title: 'Privacy Policy',
      code: 'privacy',
      url: 'https://brankazz.corpo.id/privacy-policy',
    },
    {
      id: 5,
      image: 'https://img.icons8.com/color/70/000000/facebook-like.png',
      title: 'Cek Update',
      code: 'update',
      url: '',
    },
    {
      id: 6,
      image: 'https://img.icons8.com/color/70/000000/shutdown.png',
      title: 'Logout',
      code: 'logout',
      url: '',
    },
  ];

  const [options, setOptions] = useState(data);

  const copyToClipboard = text => {
    console.log(text);
    Clipboard.setString(text);
  };

  const handleRefresh = () => {
    setLoading(true);
    getUser();
    setLoading(false);
  };

  const handleFeatures = async item => {
    if (item.code === 'logout') {
      Alert.alert(
        'Log Out',
        'Apakah Anda yakin ingin keluar?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('Cancel Pressed');
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              console.log('OK Pressed');
              setLoading(true);
              handleLogout();
            },
          },
        ],
        {cancelable: false},
      );
    } else if (item.code === 'terms' || item.code === 'privacy') {
      Linking.openURL(item.url);
    } else if (item.code === 'update') {
      try {
        setLoading(true);
        const userKey = await AsyncStorage.getItem('user-key');
        const userBearerToken = await AsyncStorage.getItem('bearer-token');

        const version = DeviceInfo.getVersion();
        console.log('Got version info:', version);

        console.log(userKey, userBearerToken);

        await check_version(userKey, userBearerToken).then(res => {
          if (res) {
            if (res.status === 200) {
              setLoading(false);

              console.log(res.data.data);

              if (res.data.data.version == version) {
                Alert.alert(
                  'Update Tidak Tersedia',
                  'Versi Anda sudah terbaru v' + res.data.data.version,
                );
              } else {
                Alert.alert(
                  'Update Tersedia',
                  'Versi Anda v' +
                    version +
                    ', silahkan update terlebih dahulu ke v' +
                    res.data.data.version,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        console.log('Cancel Pressed');
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('OK Pressed');
                        Linking.openURL(
                          'https://github.com/dani-ode/brankazz-app/releases/download/v' +
                            res.data.data.version +
                            '/Brankazz.v' +
                            res.data.data.version +
                            '.apk',
                        );
                      },
                    },
                  ],
                  {cancelable: false},
                );
              }

              // checkVersion(res.data.data);
              // setLoading(false);
            }
          } else {
            Alert.alert('Error', 'Periksa Koneksi Anda');
          }
        });
        // Linking.openURL('https://brankazz.corpo.id/update');
      } catch (error) {
        Alert.alert('Gagal Memuat', 'Periksa Koneksi Anda');
      }
    } else {
      navigation.navigate(item.code);
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
    setQratonAmount(formattedValue);
  };

  const ContentThatGoesAboveTheFlatList = () => {
    return (
      <View style={styles.headerContent}>
        <View style={{position: 'relative'}}>
          {user.profile_img ? (
            <Image
              style={styles.avatar}
              source={{
                uri: user.profile_img,
              }}
            />
          ) : (
            <Image
              style={styles.avatar}
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/512px-Windows_10_Default_Profile_Picture.svg.png',
              }}
            />
          )}
          <View style={styles.imageOverlay} />
        </View>

        <Text style={styles.username}>{user.name}</Text>

        <View style={styles.row}>
          <Text style={styles.accountNumber}>ADDRESS ({user.id}) : </Text>
          <TouchableOpacity
            onPress={() => {
              ``;
              copyToClipboard(user.account_number);
            }}>
            <Text style={styles.accountNumber}>{user.account_number}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.row,
            {display: user.account_number == 'NaN' ? 'none' : 'flex'},
          ]}>
          <TouchableOpacity onPress={() => setQratonModal(true)}>
            <Text style={styles.btnQrGenerator}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={20}
                color={theme['color-secondary-800']}
              />{' '}
              Tampilkan QRATON
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const ContentThatGoesBelowTheFlatList = () => {
    return <View style={styles.body}></View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      {/* <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }> */}
      <View>
        {/* <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image
                style={styles.avatar}
                source={{
                  uri: 'https://bootdey.com/img/Content/avatar/avatar7.png',
                }}
              />
              <Text style={styles.username}>{user.name}</Text>
              <Text style={styles.accountNumber}>
                ADDRESS : {user.account_number}
              </Text>
            </View>
          </View> */}

        <View style={styles.body}>
          <View
            style={[
              styles.sectionBox,
              {
                display:
                  user.email_verified_at == null || user.status == 'muted'
                    ? 'flex'
                    : 'none',
              },
            ]}>
            <Text
              style={[
                styles.sectionTitle,
                {display: user.email_verified_at == null ? 'flex' : 'none'},
              ]}>
              - Email Anda ({user.email}) belum di verifikasi!
            </Text>
            <Text
              style={[
                styles.sectionTitle,
                {display: user.status == 'muted' ? 'flex' : 'none'},
              ]}>
              - Akun Anda sedang di review! (1-2 hari kerja), Untuk percepatan
              hubungi admin (085220838947)
            </Text>
          </View>
          <FlatList
            enableEmptySections={true}
            data={options}
            ListHeaderComponent={ContentThatGoesAboveTheFlatList}
            ListFooterComponent={ContentThatGoesBelowTheFlatList}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleFeatures(item);
                  }}>
                  <View style={styles.box}>
                    {/* <Image style={styles.icon} source={{uri: item.image}} /> */}
                    <Text style={styles.title}>{item.title}</Text>
                    {/* <Image
                        style={styles.btn}
                        source={{
                          uri: 'https://img.icons8.com/customer/office/40',
                        }}
                      /> */}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
      {/* <TouchableOpacity
        onPress={() => {
          handleLogout();
        }}>
        <Text>Logout</Text>
      </TouchableOpacity> */}
      {/* </ScrollView> */}

      <Modal
        visible={qratonModal}
        animationType="slide"
        transparent={true} // Set transparent to true
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent]}>
            <View style={styles.checkboxContainer}>
              <View style={styles.row}>
                <CheckBox
                  disabled={false}
                  value={qratonType}
                  style={styles.checkbox}
                  tintColors={{
                    true: theme['color-secondary-800'],
                    false: theme['color-secondary-800'],
                  }}
                  onValueChange={newValue => {
                    setQratonType(newValue), setShowQraton(!newValue);
                  }}
                />
                <Text style={styles.checkboxText}>Tentukan Nominal?</Text>
              </View>
            </View>
            <View style={{display: qratonType ? 'flex' : 'none'}}>
              <TextInput
                keyboardType="numeric"
                style={[styles.input, {paddingHorizontal: 20}]}
                placeholder="Nominal"
                // autoFocus={true}
                value={qratonAmount.toString()}
                placeholderTextColor={theme['color-primary-500']}
                onChangeText={qratonAmount => handleInputChange(qratonAmount)}
                maxLength={20}
              />
              <TextInput
                style={[styles.inputDescription, {paddingHorizontal: 20}]}
                placeholder="Catatan ..."
                placeholderTextColor={theme['color-primary-500']}
                onChangeText={qratonDescription =>
                  setQratonDescription(qratonDescription)
                }
                maxLength={20}
              />
            </View>
            <View
              style={{
                display: showQraton || qratonAmount != 0 ? 'flex' : 'none',
              }}>
              <QRCode
                value={generateQRValue(
                  'QRATON',
                  qratonType,
                  qratonAmount.toString().replace(/\./g, ''),
                  user.account_number,
                  user.name,
                  qratonDescription,
                )}
                size={200}
                color={theme['color-dark-800']}
              />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              // activeOpacity={1} // To prevent touch through
              onPress={() => {
                setQratonModal(false),
                  setQratonType(false),
                  setQratonAmount(0),
                  setQratonDescription('');
                setShowQraton(true);
              }} // Call closeModal function when touched
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme['color-secondary-900']}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme['color-dark-gray-200'],
  },

  sectionBox: {
    margin: 20,
    padding: 20,
    backgroundColor: theme['color-secondary-200'],
    borderRadius: 15,
  },

  sectionTitle: {
    color: theme['color-secondary-700'],
    fontSize: 12,
    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: theme['color-dark-gray-200'],
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: theme['color-primary-600'],
    marginBottom: 10,
  },
  imageOverlay: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 63,
    borderWidth: 1,
    borderColor: theme['color-secondary-600'],
    marginBottom: 10,
    // backgroundColor: theme['color-primary-700'],
    // opacity: 0.4,
  },
  icon: {
    width: 40,
    height: 40,
  },

  username: {
    color: theme['color-dark-500'],
    fontSize: 21,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  accountNumber: {
    color: theme['color-dark-gray-500'],
    fontSize: 15,
    alignSelf: 'center',
    // marginLeft: 10,
    backgroundColor: theme['color-primary-200'],
    // padding: 1,
    // fontWeight: 'bold',
  },

  btnQrGenerator: {
    color: theme['color-secondary-900'],
    fontSize: 15,
    alignSelf: 'center',
    backgroundColor: theme['color-secondary-500'],
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontWeight: 'bold',
    borderColor: theme['color-secondary-900'],
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 10,
  },

  title: {
    fontSize: 15,
    color: theme['color-dark-500'],
    marginLeft: 4,
    paddingVertical: 10,
  },
  btn: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
  },
  box: {
    padding: 5,
    marginBottom: 2,
    backgroundColor: theme['color-primary-100'],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // modal

  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 25,
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    minWidth: 300,
    minHeight: 300,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowColor: theme['color-dark-800'],
    shadowRadius: 20,
    elevation: 3,
  },

  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 25,
  },

  modalText: {
    fontSize: 15,
    marginBottom: 12,
    color: theme['color-dark-200'],
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },

  textValue: {
    textAlign: 'right',
    color: theme['color-dark-500'],
    fontSize: 15,
    marginTop: 5,
  },
  input: {
    height: 45,
    color: theme['color-dark-500'],
    borderColor: theme['color-primary-400'],
    backgroundColor: theme['color-primary-100'],
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 24,
    fontSize: 20,
    zIndex: 100,
    width: 200,
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
    marginBottom: 25,
  },
  checkboxText: {
    color: theme['color-dark-500'],
    marginTop: 6,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme['color-secondary-500'],
  },
});

export default ProfileScreen;
