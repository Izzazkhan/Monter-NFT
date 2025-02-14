// let url = "https://www.dearmonsters.io"
let url = "http://localhost:4000"

export const appEnv = 'test'
// export const appEnv = 'live'

export const addressList = {
    tokenAddress: '0x9bfd1348cf574e3eb2b114cc18374b09ad012c69',
    tokenAddressTest: '0x4a709e2e07edffc8770f268c373fb9f17e316b9f',

    nftAddress: '0xf5ba121b8e4c89e4090feC0E262b8Af17Bedc776',
    nftAddressTest: '0x180b36a4293507bd31f56fd211c7b879f2827286',

    tradingAddress: '0x9Bb677527369922e1cC9d55D49025843b86Ad467',
    tradingAddressTest: '0x51979BBd8dd70A13148dD03Ce37f7cF2b84633E5',

    stakingAddress: '0x06391B145618896EAde2f7Bf8378C4beC7d555d8',
    stakingAddressTest: '0x24daDB85aFEf6c5316c7EBCD7E22b13de92F69A3',

    BUSDTokenAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    BUSDTokenAddressTest: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'
}


export const Register = url + '/api/auth/register'
export const Login = url + '/api/auth/login'
export const resetPassword = url + '/api/auth/resetPassword'
export const Minion = url + '/api/minion'
export const Monster = url + '/api/monster'
export const WithdrawRequest = url + '/api/withdrawRequest'
export const RewardByWallet = url + '/api/userEarning/rewardByWallet'
export const RequestByWallet = url + '/api/withdrawRequest/requestByWallet'
// export const BUSDRequestByWallet = url + '/api/busdRequestByWallet'
export const Bonus = url + '/api/levelBonus'
export const ProbilityList = url + '/api/probabiltyList'
export const FightHistory = url + '/api/fightHistory'
export const CrystalShard = url + '/api/crystalShard'
export const ShardType = url + '/api/shardType'
export const Shards = url + '/api/shards'
export const FortuneWheel = url + '/api/fortuneWheel'
export const SpinCost = url + '/api/spinCost'
export const BUSDRequest = url + '/api/BUSDRequest'
export const BUSDRequestByWallet = url + '/api/BUSDRequest/busdRequestByWallet'

export const WheelHistoryAPI = url + '/api/wheelHistory'


export const uploadsUrl = `${url}/`
