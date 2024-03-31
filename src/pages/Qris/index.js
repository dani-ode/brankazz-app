// 'use strict';

import React, {useEffect, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  Vibration,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

import {default as theme} from '../../../theme.json';
import {user_profile} from '../../api/user_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Layout} from '@ui-kitten/components';

const QrisScreen = ({navigation}) => {
  useEffect(() => {
    requestCameraPermission();

    getUser();

    const interval = setInterval(() => {
      getUser();
      setScanned(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [scanned, setScanned] = useState(false);

  const [user, setUser] = useState({});

  const [cameraDevice, setCameraDevice] = useState(false);

  const device = useCameraDevice('back');

  const cameraPermission = Camera.getCameraPermissionStatus();
  const microphonePermission = Camera.getMicrophonePermissionStatus();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0 && !scanned) {
        Vibration.vibrate(); // Vibrate upon successful scan
        setScanned(true);

        if (codes[0].value.substring(0, 2) == '00') {
          const {merchantName, location} = extractQRData(codes[0].value);

          Alert.alert(
            'Maaf fitur QRIS masih dibatasi',
            merchantName + ' : ' + location,
          );
          console.log(`Scanned ${codes.length} codes!`);
        } else if (codes[0].value.substring(0, 6) == 'QRATON') {
          const {
            standard,
            type,
            amount,
            accountNumber,
            accountName,
            description,
          } = extractQratonData(codes[0].value);

          let formattedAmount = amount.replace(/\D/g, '');

          // Format the number with commas
          formattedAmount = formattedAmount.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          );

          navigation.navigate('ServiceTransferCheckout', {
            user_balance: user.balance,
            category: 'e_money',
            brand: 'kampua',
            type: 'transfer',
            number: accountNumber,
            partner_name: accountName,
            amount_code: type,
            set_amount: formattedAmount,
            set_description: description,
          });
        } else {
          Alert.alert('Kode QR tidak valid!');
        }
        console.log(codes[0].value);
      }
      return;
    },
  });

  function extractQRData(qrCodeData) {
    let currentIndex = 0;
    let merchantName = '';
    let location = '';

    while (currentIndex < qrCodeData.length) {
      const qrID = qrCodeData.substr(currentIndex, 2);
      const qrIDLength = parseInt(qrCodeData.substr(currentIndex + 2, 2), 10);
      const qrIDValue = qrCodeData.substr(currentIndex + 4, qrIDLength);

      if (qrID === '59') {
        merchantName = qrIDValue;
      } else if (qrID === '60') {
        location = qrIDValue;
      }

      if (qrID === '26' || qrID === '51') {
        let nestedIndex = 0;

        while (nestedIndex < qrIDValue.length) {
          const nestedQRID = qrIDValue.substr(nestedIndex, 2);
          const nestedQRIDLength = parseInt(
            qrCodeData.substr(currentIndex + 2, 2),
            10,
          );
          const nestedQRIDValue = qrIDValue.substr(
            nestedIndex + 4,
            nestedQRIDLength,
          );

          if (nestedQRID === '59') {
            merchantName = nestedQRIDValue;
          } else if (nestedQRID === '60') {
            location = nestedQRIDValue;
          }

          nestedIndex += 2 + 2 + nestedQRIDLength;
        }
      }

      currentIndex += 2 + 2 + qrIDLength;
    }

    return {merchantName, location};
  }

  // extract qraton
  const extractQratonData = qrValue => {
    const standard = qrValue.substring(0, 6);
    const type = qrValue.substring(6, 8);
    const amountLength = parseInt(qrValue.substring(8, 10), 10);
    const amount = qrValue.substring(10, 10 + amountLength);
    const accountNumberLength = parseInt(
      qrValue.substring(10 + amountLength, 10 + amountLength + 2),
      10,
    );
    const accountNumber = qrValue.substring(
      10 + amountLength + 2,
      10 + amountLength + 2 + accountNumberLength,
    );
    const accountNameLength = parseInt(
      qrValue.substring(
        10 + amountLength + 2 + accountNumberLength,
        10 + amountLength + 2 + accountNumberLength + 2,
      ),
      10,
    );
    const accountName = qrValue.substring(
      10 + amountLength + 2 + accountNumberLength + 2,
      10 + amountLength + 2 + accountNumberLength + 2 + accountNameLength,
    );
    const descriptionLength = parseInt(
      qrValue.substring(
        10 + amountLength + 2 + accountNumberLength + 2 + accountNameLength,
        10 + amountLength + 2 + accountNumberLength + 2 + accountNameLength + 2,
      ),
      10,
    );
    const description = qrValue.substring(
      10 + amountLength + 2 + accountNumberLength + 2 + accountNameLength + 2,
    );

    return {
      standard,
      type,
      amount,
      accountNumber,
      accountName,
      description,
    };
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        // {
        //   title: 'Izinkan Brankazz Mengakses Kamera',
        //   message: 'Go to Settings > Permission Manager > Camera',

        // },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setCameraDevice(true);
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onBarCodeScanned = ({data}) => {
    console.log(data);
  };

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
        if (res.status === 200) {
          setUser(res.data.data);
        } else {
          AsyncStorage.clear();
          navigation.replace('Login');
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!cameraPermission) {
    return (
      <Text>
        We need your permission to use the camera. Please grant in your
        settings.
      </Text>
    );
  }
  const NoCameraDeviceError = () => {
    return <Text>Fitur ini tidak tersedia pada perangkat Anda!</Text>;
  };

  if (!cameraDevice) {
    // requestCameraPermission();
    return (
      // <Layout>
      <>
        <Text style={{textAlign: 'center', marginTop: 20}}>Loading...</Text>
        <Text style={{textAlign: 'center', margin: 20}}>
          Brankazz memerlukan izin Anda untuk menggunakan kamera. Silakan
          izinkan di pengaturan Anda, atau pada menu pop-up.
        </Text>
      </>
      // </Layout>
    );
  }

  if (device == null) return <NoCameraDeviceError />;
  return (
    // return <Text>Qris</Text>;
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        // ref={cameraRef}
        // onBarCodeScanned={handleBarCodeScanned}

        //just one try
        onBarCodeScanned={codeScanner ?? onBarCodeScanned}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      {/* <View style={styles.warapper} /> */}

      {/* <Text>Qris</Text> */}

      {/* Overlay Wrapper */}
      <View style={styles.overlayWrapper}>
        {/* Frame */}
        <View style={styles.frame} />
        {/* Text or any other content */}
        <Text style={styles.overlayText}>
          Tempatkan Kode QR di dalam bingkai
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // warapper: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
  // },
  overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  frame: {
    borderWidth: 2,
    borderColor: theme['color-primary-500'],
    width: 250,
    height: 250,
  },
  overlayText: {
    marginTop: 10,
    color: '#FFF',
    // fontSize: 18,
  },
});

export default QrisScreen;
