export  function get_addresses(wallets){
    let addresses = [];
    for(let item of wallets){
        addresses.push(item.address);
    }
    return addresses;
}
export  function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}