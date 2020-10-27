import { get_current_account, parseFloatBalance } from "./sm_token";
import config from "../config";

/**
 * Get Ethereum addresses from wallets
 * @param {*} wallets 
 */
export  function get_addresses(wallets){
    let addresses = [];
    for(let item of wallets){
        addresses.push(item.address);
    }
    return addresses;
}
/**
 * Verify id json is valid
 * @param {*} str : string
 */
export  function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
/**
 * Parse ethereum transactions into database object
 * @param {*} txid_bridge : Id transaction sent from connected Metamask account to bridge
 * @param {*} txid : Id transaction sent from bridge to wallets
 * @param {*} bn_total_amount: total amount sent to Bridge smart contract
 * @param {*} amounts : list amount by wallet
 * @param {*} addresses : list address by wallet
 */
export async function parse_transactions(txid_bridge, txid, bn_total_amount, amounts, addresses){
    let bridges = [];
    
    bridges.push({                              // save transaction(connected accout to bridge)
        txid:txid_bridge.blockHash, 
        from:get_current_account(), 
        to: config.sm_bridge,
        token: config.sm_bridge, 
        value: await parseFloatBalance(bn_total_amount)
    })
    for(let i in addresses){
        bridges.push({
            txid:txid.blockHash, 
            from:get_current_account(), 
            to: addresses[i], 
            token: config.sm_bridge,
            value: await parseFloatBalance(amounts[i])
        })
    }
    return bridges;
}