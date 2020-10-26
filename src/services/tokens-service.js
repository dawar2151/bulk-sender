import config from '../config';

export async function save_token(token) {
  
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(token)
  };
  const response = await fetch(config.api+"/tokens", requestOptions);
  const data = await response.json();
  console.log(data);
  return data;
}
