
let xurl = "http://34.234.236.236"
let url = "https://www.dearmonsters.io"
// let url = "http://localhost:4000"
// export const appEnv = 'test'
export const appEnv = 'live'

export const addressList = {
    tokenAddress: '0x9bfd1348cf574e3eb2b114cc18374b09ad012c69',
    tokenAddressTest: '0x4a709e2e07edffc8770f268c373fb9f17e316b9f',

    nftAddress: '0xf5ba121b8e4c89e4090feC0E262b8Af17Bedc776',
    nftAddressTest: '0x180b36a4293507bd31f56fd211c7b879f2827286',

    tradingAddress: '0x9Bb677527369922e1cC9d55D49025843b86Ad467',
    tradingAddressTest: '0x51979BBd8dd70A13148dD03Ce37f7cF2b84633E5'
}


export const Register = url + '/api/auth/register'
export const Login = url + '/api/auth/login'
export const resetPassword = url + '/api/auth/resetPassword'
export const Minion = url + '/api/minion'
export const Monster = url + '/api/monster'
export const WithdrawRequest = url + '/api/withdrawRequest'
export const RewardByWallet = url + '/api/withdrawRequest/rewardByWallet'
export const Bonus = url + '/api/levelBonus'
export const ProbilityList = url + '/api/probabiltyList'
export const FightHistory = url + '/api/fightHistory'