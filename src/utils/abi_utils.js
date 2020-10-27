
import ABI from '../ERC20_TX.json';
import Bridge_ABI from '../Bridge.json';
/**
 * Parse RC20 ABI(Application binary interface)
 */
export  function parse_abi(){
    let parsed = JSON.parse(JSON.stringify(ABI));
    let abi = parsed.abi;
    return abi
}
/**
 * Parse bridge ABI(Application binary interface)
 */
export  function parse_bridge_abi(){
    let parsed = JSON.parse(JSON.stringify(Bridge_ABI));
    let abi = parsed.abi;
    return abi
}