import React, {useEffect} from 'react';
import {View, Button, Alert} from 'react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Text} from 'react-native-svg';

const PromoScreen = () => {
  //   useEffect(() => {
  //     const unsubscribe = messaging().onMessage(async remoteMessage => {
  //       console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //     });
  //     return unsubscribe;
  //   }, []);
  //   const onDisplayNotification = async () => {
  //     // Request permissions (required for iOS)
  //     await notifee.requestPermission();
  //     // Create a channel (required for Android)
  //     const channelId = await notifee.createChannel({
  //       id: 'default',
  //       name: 'Default Channel',
  //     });
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //     if (enabled) {
  //       await messaging()
  //         .getToken()
  //         .then(token => {
  //           console.log('FCM Token: ' + token);
  //         });
  //       console.log('Authorization status:', authStatus);
  //     }
  //     // Display a notification
  //     await notifee.displayNotification({
  //       title: 'Notification Title',
  //       body: 'Main body content of the notification',
  //       android: {
  //         channelId,
  //         // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //         // pressAction is needed if you want the notification to open the app when pressed
  //         pressAction: {
  //           id: 'default',
  //         },
  //       },
  //     });
  //   };
  return (
    <View>
      {/* <Button
          title="Display Notification"
          onPress={() => onDisplayNotification()}
        /> */}
      <Text>Promo</Text>
    </View>
  );
};

// async function requestUserPermission() {}

export default PromoScreen;
