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
let rc20Contract;

// Send amount to all addresses
export async function send_amount(token ,recipient, amounts){

    const data = rc20Bridge.methods.bulkSendMultiple(token, recipient, amounts).encodeABI();
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
export async function send_amount_sc(token, recipient, amount){
  rc20Contract = new web3.eth.Contract(parse_abi(), token);  
  const data = rc20Contract.methods.transfer(recipient, amount).encodeABI();
    var rawTx = {
        from: window.ethereum.selectedAddress,
        nonce: '0x00',
        to: token,
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
  // to update
    rc20Contract = new web3.eth.Contract(parse_abi(), '0xcfad14fb38212397c9ea6e228a4a81dc288df24b'); 
    let balance  = await rc20Contract.methods.balanceOf(address).call();
    return balance;
}
export async function get_decimals(token){
  rc20Contract = new web3.eth.Contract(parse_abi(), token); 
  let decimals = await rc20Contract.methods.decimals().call();
  return decimals;
}
export async function get_name(token){
  rc20Contract = new web3.eth.Contract(parse_abi(), token); 
  let decimals = await rc20Contract.methods.name().call();
  return decimals;
}
export async function get_symbol(token){
  rc20Contract = new web3.eth.Contract(parse_abi(), token); 
  let decimals = await rc20Contract.methods.symbol().call();
  return decimals;
}
export async function get_totalSupply(token){
  rc20Contract = new web3.eth.Contract(parse_abi(), token); 
  let decimals = await rc20Contract.methods.totalSupply().call();
  return decimals;
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
export function validate_address(address){
  if(ethers.utils.isAddress(address)){
    return true;
  }
  return false;
}
export function getBigNumber(_amount, _decimals){
  let decimals = web3.utils.toBN(_decimals);
  let amount = web3.utils.toBN(_amount);
  // calculate ERC20 token amount
  let value = amount.mul(web3.utils.toBN(10).pow(decimals));
  return value;
}