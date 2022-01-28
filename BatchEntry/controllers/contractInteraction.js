const Web3 = require("web3");
const Monster = require('../models/monster');
const MintedMonster = require('../models/mintedMonster');

const tokenContractAbi = require("../contractAbi/contractAbi.json");
const NETWORK_URL = "https://bsc-dataseed.binance.org/";
const walletAddress = "0xBeABfD1B125949EF10D07f5D2cEd622178BaAB23";
const contractAddress = "0xf5ba121b8e4c89e4090feC0E262b8Af17Bedc776";

const metaMaskConnection = async () => {
  try {
    const web3 = new Web3(NETWORK_URL);
    let contract;
    contract = await new web3.eth.Contract(tokenContractAbi, contractAddress);


    for(let i = 0 ; i < 1010 ; i++){
    // for(let i = 0 ; i < 1 ; i++){

      let response = await contract.methods.attributes(i).call({ from: walletAddress })


      console.log("===== response ======");
      console.log(response);
      console.log("===== response ======");


      let monster = await Monster.findOne({ img: response['element'] })

      console.log("========== " + i + " ==========")
      console.log(monster)
      console.log("========== " + i + " ==========")


      let tempMonsterObject = {}
      tempMonsterObject.owner = response['owner']
      tempMonsterObject.tokenId = i
      tempMonsterObject.rating = parseInt(response['star'])
      tempMonsterObject.monsterId = monster._id

      let subObj = {}

      subObj.Level = response['level']
      subObj.EXP = response['exp']
      subObj.Element = response['element']
      subObj.Energy = response['energy']

      tempMonsterObject.values = { ...subObj }


      console.log("===================")
      console.log(tempMonsterObject)

      const newMintedMonster = new MintedMonster({...tempMonsterObject});
      const mintedMonster_ = await newMintedMonster.save();

    }

  } catch (e) {
    console.log(e);
  }
};

module.exports = { metaMaskConnection };
