/* eslint-disable import/first */
import config from "../config";
import Web3 from 'web3';
import parse_abi from './abi_utils';
import { ethers, Wallet } from "ethers";
const Tx = require('ethereumjs-tx').Transaction
// Instantiate web3
let web3
web3 = new Web3(config.node_api);
// Instantiate smart contracts
let rc20Contract = new web3.eth.Contract(parse_abi(), config.sm_address);

// call smart contract function to save market object
export async function send_amount(recipient, amount){
    
    let nonce = await web3.eth.getTransactionCount(config.account_address);
    const data = rc20Contract.methods.transfer(recipient, amount).encodeABI();
    const privateKey = Buffer.from(config.private_key,'hex');
    var rawTx = {
        from: config.account_address,
        nonce: nonce,
        to: config.sm_address,
        gas: config.gas, // Gas sent with each transaction (default: ~6700000)
        gasPrice: config.gasPrice,
        value: '0x0',
        data: data
    }
    // Initiate an sign transaction
    let tx = new Tx(rawTx, { chain: 'mainnet', hardfork: 'istanbul' });
    tx.sign(privateKey);
    let serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex')
    
    // Broadcast the transaction
    const receipt = await web3.eth.sendSignedTransaction(raw);
    console.log(receipt);
    return receipt;
}

export async function get_balance(address){
    let balance  = await rc20Contract.methods.balanceOf(address).call();
    return balance;
}
export async function get_accounts(){
    return await web3.eth.getAccounts();
}
export function get_current_account(){
    return config.account_address;
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
