/* eslint-disable import/first */
import config from "../config";
import Web3 from 'web3';
import {parse_bridge_abi, parse_abi} from './abi_utils';
import { ethers } from "ethers";
const Tx = require('ethereumjs-tx').Transaction
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
let rc20Bridge = new web3.eth.Contract(parse_bridge_abi(), config.sm_bridge);
let rc20Contract = new web3.eth.Contract(parse_abi(), config.sm_address);

// Send amount to all addresses
export async function send_amount(recipient, amount){

    const data = rc20Bridge.methods.bulkSend(recipient, amount).encodeABI();
    var rawTx = {
      from: window.ethereum.selectedAddress,
      nonce: '0x00',
      to: config.sm_bridge,
      gas: '0x81B320', // Gas sent with each transaction (default: ~6700000)
      gasPrice: '0x4A817C800',
      value: '0x0',
      data: data
  }
  const txHash = await web3.eth.sendTransaction(rawTx);
  return txHash;
}
// send amount to bridge SC
export async function send_amount_sc(recipient, amount){
    
  const data = rc20Contract.methods.transfer(recipient, amount).encodeABI();
    var rawTx = {
        from: window.ethereum.selectedAddress,
        nonce: '0x00',
        to: config.sm_address,
        gas: '0x81B320', // Gas sent with each transaction (default: ~6700000)
        gasPrice: '0x4A817C800',
        value: '0x0',
        data: data
    }
    const txHash = await web3.eth.sendTransaction(rawTx);
    return txHash;
}
// get balance address's token balance
export async function get_balance(address){
    let balance  = await rc20Contract.methods.balanceOf(address).call();
    return balance;
}
// get all connected accounts
export async function get_accounts(){
    return await web3.eth.getAccounts();
}
export function get_current_account(){
    return window.ethereum.selectedAddress;
}
export async function generate_wallets(nbr_address){
    let wallets = [];
    let wallet;
    for(let i = 1; i <= nbr_address; i++){
      wallet =  ethers.Wallet.createRandom();
      wallets.push(
        {
          address: wallet.address,
          privateKey: wallet.privateKey
        }
      );
    }
    return wallets;
}
