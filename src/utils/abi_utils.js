
import ABI from '../ERC20_TX.json';
//Parse ABI
export default function parse_abi(){
    let parsed = JSON.parse(JSON.stringify(ABI));
    let abi = parsed.abi;
    console.log(abi);
    return abi
}