/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import Routes from './routes';
import SplashScreen from 'react-native-splash-screen';
import {ApplicationProvider} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import {default as theme} from '../theme.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar, Alert} from 'react-native';

// import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

function App(): React.JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2500);

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification();

      let message = JSON.stringify(remoteMessage);
      let messageObject = JSON.parse(message);

      console.log('Remote Message : ', messageObject);
      Alert.alert(
        messageObject.notification.title,
        messageObject.notification.body,
      );
    });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      // Navigate to specific screen
    });

    return unsubscribe;
  });

  const onDisplayNotification = async () => {
    // Request permissions (required for iOS)

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await messaging()
        .getToken()
        .then(token => {
          console.log('FCM Token: ' + token);
        });

      console.log('Authorization status:', authStatus);
    }

    // await notifee.requestPermission();

    // // Create a channel (required for Android)
    // const channelId = await notifee.createChannel({
    //   id: 'default',
    //   name: 'Default Channel',
    // });

    // Display a notification
    // await notifee.displayNotification({
    //   title: 'Notification Title',
    //   body: 'Main body content of the notification',
    //   android: {
    //     channelId,
    //     // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    //     // pressAction is needed if you want the notification to open the app when pressed
    //     pressAction: {
    //       id: 'default',
    //     },
    //   },
    // });
  };
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="#2e3d49" />
      <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </ApplicationProvider>
    </GestureHandlerRootView>
  );
}

export default App;
