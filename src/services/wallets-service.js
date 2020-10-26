import config from '../config';

export async function save_bulk_wallets(wallets) {
  
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wallets)
  };
  const response = await fetch(config.api+"/wallets/bulk", requestOptions);
  const data = await response.json();
  return data;

}

export async function get_wallets(req) {
  
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await fetch(config.api+"/wallets/holder?"+ new URLSearchParams(req), requestOptions);
  const data = await response.json();
  console.log(data);
  return data;

}