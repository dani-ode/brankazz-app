import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';

const transaction_lists = async (
  first_date,
  end_date,
  userKey,
  userBearerToken,
) => {
  try {
    const res = await ApiManager.get('transaction', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: 'Bearer ' + userBearerToken,
      },
      params: {
        first_date: first_date,
        end_date: end_date,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
const deposit_lists = async (
  first_date,
  end_date,
  userKey,
  userBearerToken,
) => {
  try {
    const res = await ApiManager.get('deposits', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: 'Bearer ' + userBearerToken,
      },
      params: {
        first_date: first_date,
        end_date: end_date,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export {transaction_lists, deposit_lists};
