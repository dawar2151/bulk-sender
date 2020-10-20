/* eslint-disable import/first */
import config from "../config";
import Web3 from 'web3';
import parse_abi from './abi_utils';
// Instantiate web3
let web3
const ethEnabled = () => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      return true;
    }
    return false;
  }
if(!ethEnabled()) {  
 web3 = new Web3(config.node_api);
}else{
    web3 = window.web3;
}
// Instantiate smart contracts
let rc20Contract = new web3.eth.Contract(parse_abi(), config.sm_address);

// call smart contract function to save market object
export async function send_amount(recipient, amount){
    
    const data = rc20Contract.methods.transfer(recipient, amount).encodeABI();
    var rawTx = {
        from: window.ethereum.selectedAddress,
        nonce: '0x00',
        to: config.sm_address,
        gas: '0x81B320', // Gas sent with each transaction (default: ~6700000)
        gasPrice: '0x4A817C800',
        value: '0x0',
        chainId: 3,
        data: data
    }
    const txHash = await web3.eth.sendTransaction(rawTx);
    console.log(txHash);
    return txHash;
}

export async function get_balance(address){
    let balance  = await rc20Contract.methods.balanceOf(address).call();
    return balance;
}
export async function get_accounts(){
    return await web3.eth.getAccounts();
}
export function get_current_account(){
    return window.ethereum.selectedAddress;
}
