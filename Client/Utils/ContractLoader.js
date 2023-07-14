export let ContractLoader=async(Name,WEB3)=>{
    let Data=await fetch(`./Contracts/${Name}.json`);
    let Res=await Data.json();
    let Contract=new WEB3.eth.Contract(Res.abi,Res.networks["5777"].address)
    return Contract
}