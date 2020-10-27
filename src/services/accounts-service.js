import config from '../config';
import { get_current_account } from '../utils/sm_token';
/**
 * save connected Metamask account address
 */
export async function save_master_account() {
  const body = {address:get_current_account() }
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  const response = await fetch(config.api+"/accounts", requestOptions);
  return response;
}
