import config from '../config';

/**
 * save token
 * @param {*} token : an RC20 token
 */
export async function save_token(token) {
  
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(token)
  };
  const response = await fetch(config.api+"/tokens", requestOptions);

  return response;

}
