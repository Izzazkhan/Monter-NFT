
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
    const { userId } = useSelector((state) => state.AuthReducer);
    const [state, setState] = useState({
        price: ''
    })


    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            console.log('props ==', props)


            setState({
                ...state,
                _id: propsData._id,
                price: propsData['price']
            })
        }
    }, [])

    console.log('state =====', state)





    const submitData = async () => {

        if (!state._id) {
            // props.addBonus(state, JSON.parse(localStorage.getItem('token')))
            // props.history.push('/additional-reward')
            if (!userId) return

		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		// let networkId = await web3.eth.net.getId()
		// let DearMonsterNetwork = DearMonster.networks[networkId]
		// let DearMonsterContract = new web3.eth.Contract(DearMonster.abi, DearMonsterNetwork.address)
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
        console.log('acountssssss', accounts, state.price)

		await DearMonsterContract.methods.setPrice(parseInt(state.price)).send({ from: accounts[0] });

        } else if (state._id) {
            // props.editBonus(state, JSON.parse(localStorage.getItem('token')))
            // props.history.push('/additional-reward')

        } else {
            alert('Enter Monster Details.');
        }
        clearData()
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }


    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        console.log(field)
        if (field !== '_id') {
            return (
                <div className={`form-group ${field === 'message' ? 'col-md-12' : 'col-md-6'}`} key={i}>
                    <label className="control-label">{`Price`}</label>
                    <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        placeholder={`Enter ${field}`}
                    />
                </div>
            )
        }

    });


    const clearData = () => {
        setState({
            price: ''
        })
    }

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
        console.log('accounts', accounts)
		// setAccount(accounts[0]);

		dispatch(connectUserSuccess(accounts[0]))
    }

    return (
        <>
        {userId ?
          <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Price to set</h3>
                        <div className="row">
                            {InputField}
                        </div>
                        <div className="row" style={{ justifyContent: 'center', width: '200px', marginTop: '10px', marginLeft: '0px' }}>
                            {state._id ? <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
                                <button className="btn-default hvr-bounce-in" onClick={submitData}>ADD</button>
                                }
                        </div>
                        {/* <div className="row" style={{ justifyContent: 'center', width: '200px' }}>
                            <button className="btn-default hvr-bounce-in" onClick={clearData}>CLEAR</button>
                        </div> */}
                        <br />
                    </div>
                </div>
            </div>

            :

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
                                    
        } 
            
        </>
    )
}


export default SideSetting