import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';

// const transaction_create = async (
//   dest_number,
//   product_sku_code,
//   category,
//   product_type,
//   for_type,
//   amount,
//   userKey,
//   userBearerToken,
// ) => {
//   try {
//     const config = {
//       headers: {
//         'Access-Key': BRANKAZZ_ACCESS_KEY,
//         'User-Key': userKey,
//         Authorization: `Bearer ${userBearerToken}`,
//       },
//     };

//     const bodyParameters = {
//       dest_number: dest_number,
//       product_sku_code: product_sku_code,
//       product_category: category,
//       product_brand: product_type,
//       product_type: for_type,
//       amount: amount,
//     };

//     console.log(bodyParameters);

//     const res = await ApiManager.post(
//       '/api/transaction',
//       bodyParameters,
//       config,
//     );
//     return res;
//   } catch (error) {
//     console.error(error);
//   }
// };
const deposit_show = async (id, userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get('/api/deposit/' + id, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: 'Bearer ' + userBearerToken,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export {deposit_show};
