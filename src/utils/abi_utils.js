
import ABI from '../ERC20_TX.json';
import Bridge_ABI from '../Bridge.json';
//Parse ABI
export  function parse_abi(){
    let parsed = JSON.parse(JSON.stringify(ABI));
    let abi = parsed.abi;
    return abi
}
export  function parse_bridge_abi(){
    let parsed = JSON.parse(JSON.stringify(Bridge_ABI));
    let abi = parsed.abi;
    return abi
}