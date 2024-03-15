import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';

const user_by_number = async (number, userKey, userBearerToken) => {
  try {
    console.log(number, userKey, userBearerToken);
    const res = await ApiManager.get('/api/user-name-by-account-number', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Key': BRANKAZZ_ACCESS_KEY,
        'User-Key': userKey,
        Authorization: 'Bearer ' + userBearerToken,
      },
      params: {
        account_number: number,
      },
    });

    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
  }
};

export {user_by_number};
