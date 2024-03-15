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

const QrisScreen = () => {
  useEffect(() => {
    requestCameraPermission();

    const interval = setInterval(() => {
      setScanned(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [scanned, setScanned] = useState(false);

  const device = useCameraDevice('back');

  const cameraPermission = Camera.getCameraPermissionStatus();
  const microphonePermission = Camera.getMicrophonePermissionStatus();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0 && !scanned) {
        Vibration.vibrate(); // Vibrate upon successful scan
        setScanned(true);

        if (codes[0].value.substring(0, 2) != '00') {
          Alert.alert('Kode QR tidak valid!');
        } else {
          const {merchantName, location} = extractQRData(codes[0].value);

          Alert.alert(
            'Maaf fitur QRIS masih dibatasi',
            merchantName + ' : ' + location,
          );
          console.log(`Scanned ${codes.length} codes!`);
          console.log(codes[0].value);
        }
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

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Izinkan Brankazz Mengakses Kamera',
          message: 'Go to Settings > Permission Manager > Camera',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
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

  const onBarCodeScanned = ({data}) => {
    console.log(data);
  };

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
