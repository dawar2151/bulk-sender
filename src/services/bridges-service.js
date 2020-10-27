import config from '../config';

/**
 * Save list of transactions
 * @param {any[]} bridges - list of bridges(transactions received and sent from bridge smart contracts)
 */
export async function save_bulk_bridges(bridges) {
  
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bridges)
  };
  const response = await fetch(config.api+"/bridges/bulk", requestOptions);
  const data = await response.json();
  return data;

}