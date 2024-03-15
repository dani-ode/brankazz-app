import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';

import {default as theme} from '../../../theme.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {bid_list} from '../../api/exchange_api';
import 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Text} from '@ui-kitten/components';

const BidQueue = ({route}) => {
  const {account_number, ask_quantity, ask_price, user_name} = route.params;

  const [bids, setBids] = useState([['-', '-', '-']]);

  useEffect(() => {
    getBidList();
  }, []);

  const [tableHead, setTableHead] = useState([
    'Tanggal',
    'ID Transaksi',
    'Status',
  ]);

  const getBidList = async () => {
    const userKey = await AsyncStorage.getItem('user-key');
    const userBearerToken = await AsyncStorage.getItem('bearer-token');

    try {
      await bid_list(account_number, userKey, userBearerToken).then(res => {
        if (res.status === 200) {
          const bid_list = res.data.data;

          setBids(
            bid_list.map(item => [item.date, item.order_id, item.status]),
          );
          console.log(bid_list);
          // setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const snapPoints = useMemo(() => ['25%', '80%'], []);
  // ref
  const bottomSheetRef = useRef();

  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    // <GestureHandlerRootView>
    <View style={styles.container}>
      <Table
        style={styles.table}
        borderStyle={{
          borderWidth: 2,
          borderColor: theme['color-secondary-600'],
        }}>
        <Row data={tableHead} style={styles.head} />
        <Rows data={bids} textStyle={styles.text} />
      </Table>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetView style={styles.contentContainer}>
          <Text>Pilih Metode Pembayaran</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    // backgroundColor: 'grey',
    backgroundColor: theme['color-primary-500'],
  },
  table: {backgroundColor: theme['color-primary-100']},
  head: {height: 40, backgroundColor: theme['color-secondary-500']},
  text: {margin: 6, color: theme['color-dark-500']},
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default BidQueue;
