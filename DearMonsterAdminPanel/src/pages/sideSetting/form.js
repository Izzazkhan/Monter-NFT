
import React, { useState, useEffect } from "react"
import "../../App.css";
import { useSelector, useDispatch } from 'react-redux'
import {appEnv, addressList } from '../../utilities/constant'
import Web3 from 'web3';
import { connectUserSuccess } from '../../redux/WalletAuth/login';
import DearMonster from '../../contracts/DearMonster.json'
import DearMonsterTest from '../../contracts/DearMonsterTest.json'

const nftContractAbi = appEnv === 'test' ? DearMonsterTest : DearMonster
const nftContractAddress = appEnv === 'test' ? addressList.nftAddressTest : addressList.nftAddress


function SideSetting(props) {
    const dispatch = useDispatch()
    // const selector = useSelector((state) => state)
    // console.log('selectorselector', selector)
    const { userId } = useSelector((state) => state.AuthReducer)

    const [account, setAccount] = useState('')
    const [owner, setOwner] = useState('')

    const [state, setState] = useState({
        price: '',
        maxSupply: '',
        maxPurchase: ''
    })

    useEffect(async () => {
        if(userId){
            let web3 = window.web3
		
            let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
    
            const owner = await DearMonsterContract.methods.getOwner().call()
            setOwner(owner)
        }
    }, [userId])


    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            setState({
                ...state,
                _id: propsData._id,
                price: propsData['price'],
                maxSupply: propsData['maxSupply'],
                maxPurchase: propsData['maxPurchase']
            })
        }
    }, [])

    const handlePriceChange = async () => {

        if (!userId) return

		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)

		await DearMonsterContract.methods.setPrice(parseInt(state.price)).send({ from: accounts[0] });
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleCaveLimitChange = async (e) => {
		if (!userId) return

		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
		await DearMonsterContract.methods.setMaxSupply(parseInt(state.maxSupply)).send({ from: accounts[0] });
	}

    const handleMaxPurchaseCount = async (e) => {
		if (!userId) return

		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
		await DearMonsterContract.methods.setMaxPurchaseLimit(parseInt(state.maxPurchase)).send({ from: accounts[0] });
	}


    console.log('statestate', state)


    const connectWallet = async () => {
        if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			window.loaded_web3 = true
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}

		await window.ethereum.request({
			method: "wallet_requestPermissions",
			params: [{
				eth_accounts: {}
			}]
		});
		let web3 = window.web3
		// Load account
		let accounts = await web3.eth.getAccounts()
		setAccount(accounts[0]);

		dispatch(connectUserSuccess(accounts[0]))
    }

    return (
        <>
        {!userId ?
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <button className="btn-default" onClick={connectWallet}>
                                <span className="icon"> </span>
                                        {'Connect Wallet'}
                            </button>
                    </div>
                </div>
            </div>
            :
            userId && account === owner ?
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Price to set</h3>
                        <div className="row">
                                <div className={`col-md-8`}>
                        <label className="control-label">{`Price`}</label>
                        <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={'price'} value={state.price}
                        placeholder={`Enter Price`}
                        type='number'
                        />
                        </div>
                        <div className={`col-md-4`}>
                        <button className="btn-default hvr-bounce-in" onClick={handlePriceChange}>ADD</button>
                        </div>
                    </div>
                        <br />
                    </div>

                    <div className="content-box">
                        <h3>Maximum Supply</h3>
                        <div className="row">
                                <div className={`col-md-8`}>
                        <label className="control-label">{`Maximum Supply`}</label>
                        <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={'maxSupply'} value={state.maxSupply}
                        placeholder={`Enter Maximum Supply`}
                        type='number'
                        />
                        </div>
                        <div className={`col-md-4`}>
                        <button className="btn-default hvr-bounce-in" onClick={handleCaveLimitChange}>ADD</button>
                        </div>
                    </div>
                        <br />
                    </div>

                    <div className="content-box">
                        <h3>Maximum Purchase Limit</h3>
                        <div className="row">
                                <div className={`col-md-8`}>
                        <label className="control-label">{`Maximum Purchase`}</label>
                        <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={'maxPurchase'} value={state.maxPurchase}
                        placeholder={`Enter Maximum Purchase`}
                        type='number'
                        />
                        </div>
                        <div className={`col-md-4`}>
                        <button className="btn-default hvr-bounce-in" onClick={handleMaxPurchaseCount}>ADD</button>
                        </div>
                    </div>
                        <br />
                    </div>
                </div>
            </div>

             :
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                            <span className="icon"> </span>
                            {'You are not the owner'}
                    </div>
                </div>
            </div>               
        }   
        </>
    )
}


export default SideSetting