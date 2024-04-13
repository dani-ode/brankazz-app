import ApiManager from './ApiManager';

import {BRANKAZZ_ACCESS_KEY} from '@env';
import {BRANKAZZ_ADMIN_KEY} from '@env';

const MAX_RETRIES = 3;

const check_version = async (userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get('/api/appinit/check-version', {
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

export {check_version};
