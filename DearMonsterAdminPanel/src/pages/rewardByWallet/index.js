import React, {useState, useEffect} from 'react'
import "../../App.css";
import { getRewardByWallet } from '../../redux/rewardByWallet/action';
import { connect } from 'react-redux';
function WithdrawRequest(props) {
    
    const [walletAddress, setWalletAddress] = useState('')
    const [ownerReward, setOwnerReward] = useState([])
    const [scholarReward, setScholarReward] = useState([])


    const onChangeWallet = (e) => {
        setWalletAddress(e.target.value)
        props.getRewardByWallet(e.target.value)
    }

    useEffect(() => {
        if(props.rewardByWallet.rewardByWallet.length) {
            const ownerReward = props.rewardByWallet.rewardByWallet.find(item => item.type === 'owner')
            setOwnerReward(ownerReward)
            if(ownerReward){
                setOwnerReward(ownerReward)

            }
            const scholarReward = props.rewardByWallet.rewardByWallet.find(item => item.type === 'scholar')
            if(scholarReward){
                setScholarReward(scholarReward)
            }
        }
        else {
            setOwnerReward([])
            setScholarReward([])
        }
    }, [props])

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Rewards By Wallet Address</h3>
                        <div className="row">
                            <div className={`col-md-12`}>
                            <label className="control-label">{`Wallet Address`}</label>
                            <input type="text" required="required" className="form-control" onChange={onChangeWallet}
                            name={'walletAddress'} value={walletAddress}
                            placeholder={`Enter Wallet Address`}
                            />
                            </div>
                        </div>
                        <div className="row" style={{marginTop: 20}}>
                            <div className={`col-md-6`}>
                                <h3>Owner Rewards</h3>
                                <span>{ownerReward == undefined || ownerReward.length == 0 ? 'No Owner Reward' : ownerReward.totalAmount}</span>
                            </div>
                            <div className={`col-md-6`}>
                                <h3>Scholar Rewards</h3>
                                <span>{scholarReward == undefined || scholarReward.length == 0 ? 'No Scholar Reward' : scholarReward.totalAmount}</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    rewardByWallet: state.RewardByWalletReducer
});

export default connect(mapStateToProps, { getRewardByWallet })(WithdrawRequest); 