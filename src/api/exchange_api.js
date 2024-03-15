import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';

const ask_list = async (userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get('/api/exchange/ask', {
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

const bid_list = async (seller_account, userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get(
      '/api/exchange/bid/' + seller_account + '',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Key': BRANKAZZ_ACCESS_KEY,
          'User-Key': userKey,
          Authorization: 'Bearer ' + userBearerToken,
        },
      },
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

export {ask_list, bid_list};
