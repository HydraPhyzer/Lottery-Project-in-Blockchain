let Lottery=artifacts.require("./Lottery.sol");

module.exports=function (Deployer){
    Deployer.deploy(Lottery);
}