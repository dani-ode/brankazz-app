import React, {useState} from 'react';
import {TextInput} from 'react-native';

const AmountInput = ({onAmountChange}) => {
  //   const [amount, setAmount] = useState('');
  //   // Function to format the amount
  //   const formatAmount = value => {
  //     // Remove non-digit characters
  //     let formattedValue = value.replace(/\D/g, '');
  //     // Format the number with commas
  //     formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //     return formattedValue;
  //   };
  //   // Function to handle input change
  //   const handleInputChange = text => {
  //     const formattedValue = formatAmount(text);
  //     setAmount(formattedValue);
  //     onAmountChange(formattedValue); // Call the callback function with the formatted value
  //   };
  //   return (
  //     <TextInput
  //       keyboardType="numeric"
  //       value={amount}
  //       onChangeText={handleInputChange}
  //       placeholder="Enter amount"
  //       style={{borderWidth: 1, borderColor: 'gray', padding: 10}}
  //     />
  //   );
};

export default AmountInput;
