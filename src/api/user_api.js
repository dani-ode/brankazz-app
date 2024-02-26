import ApiManager from './ApiManager';

const user_login = async (email, password) => {
  try {
    const res = await ApiManager.get('https://brankazz.corpo.id/api/login', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Key': '3c956f3ef687c89695873c277f1098c1',
      },
      params: {
        email: email,
        password: password,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
const user_profile = async (userId, userKey, userBearerToken) => {
  try {
    const res = await ApiManager.get(
      'https://brankazz.corpo.id/api/user/' + userId,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Key': '3c956f3ef687c89695873c277f1098c1',
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

export {user_login, user_profile};
