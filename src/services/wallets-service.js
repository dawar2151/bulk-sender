import config from '../config';

export async function save_bulk_wallets(wallets) {
  
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wallets)
  };
  const response = await fetch(config.api+"/wallets/bulk", requestOptions);
  const data = await response.json();
  console.log(data);
  return data;
}