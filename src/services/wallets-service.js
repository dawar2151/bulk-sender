import config from '../config';

/**
 * Save list of wallets
 * @param {any[]} wallets - list of wallets
 */
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
/**
 * get wallets by holder
 * @param {*} wallet - get Wallets by holder
 */
export async function get_wallets(wallet) {
  
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await fetch(config.api+"/wallets/holder?"+ new URLSearchParams(wallet), requestOptions);
  const data = await response.json();
  return data;

}