import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

import {default as theme} from '../../../../../theme.json';
import {Card} from '@ui-kitten/components';
import Clipboard from '@react-native-clipboard/clipboard';

const BankTransfer = ({deposit, navigation}) => {
  if (deposit.status != 'pending' && deposit.payment_method != 'bank_tranfer') {
    return <></>;
  }

  function formatCurrency(amount) {
    amount = Number(amount)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+\b)/g, '$1.');
    return amount;
  }
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>Nama Bank</Text>
        <Text style={styles.value}>{deposit.provider_name.toUpperCase()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Nama Akun</Text>
        <Text style={styles.value}>{deposit.dest_acc_name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Nomor REK.</Text>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(deposit.dest_acc_number);
          }}>
          <Text style={styles.value}>{deposit.dest_acc_number}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Nominal</Text>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(deposit.amount);
          }}>
          <Text style={styles.value}>Rp {formatCurrency(deposit.amount)}</Text>
        </TouchableOpacity>
      </View>
      <Card
        style={{marginTop: 15, backgroundColor: theme['color-dark-gray-200']}}>
        <Text style={styles.labelNote}>Penting! :</Text>
        <Text style={styles.valueNote}>
          Silahkan transfer pada nomor rekening diatas, pastikan nominal sama
          dengan nominal yang ditampilkan.
        </Text>
        <Text style={styles.valueNote}>
          biasanya status akan update paling lambat 15 menit setelah anda
          transfer.
        </Text>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  labelNote: {
    fontSize: 12,
    color: theme['color-dark-gray-400'],
    marginTop: 8,
  },
  valueNote: {
    fontSize: 12,
    color: theme['color-dark-gray-400'],
    marginTop: 8,
  },
});

export default BankTransfer;
