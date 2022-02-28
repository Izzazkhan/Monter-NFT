
import React, { useState, useEffect } from "react"
import "../../App.css";
import { useSelector, useDispatch } from 'react-redux'
import {appEnv, addressList, ProbilityList } from '../../utilities/constant'
import Web3 from 'web3';
import { connectUserSuccess } from '../../redux/WalletAuth/login';
import DearMonster from '../../contracts/DearMonster.json'
import DearMonsterTest from '../../contracts/DearMonsterTest.json'
import axios from 'axios'
import { getProbabilty, addProbability, editProbability, deleteProbability } from '../../redux/probabilty/action';
import { connect } from 'react-redux';

const nftContractAbi = appEnv === 'test' ? DearMonsterTest : DearMonster
const nftContractAddress = appEnv === 'test' ? addressList.nftAddressTest : addressList.nftAddress
const star_mappings = {
    'Star 1': 1,
    'Star 2': 2,
    'Star 3': 3,
    'Star 4': 4,
    'Star 5': 5
};

function SideSetting(props) {
    const dispatch = useDispatch()
    const { userId } = useSelector((state) => state.AuthReducer)

    const [account, setAccount] = useState('')
    const [owner, setOwner] = useState('')
	const [attributes, setAttributes] = useState([]);
    const [state, setState] = useState({
        price: '',
        maxSupply: '',
        maxPurchase: '',
        selectStar: ''
    })
    
    const headers = ['Token ID', 'Wallet'];

    useEffect(async () => {
        if(userId){
            let web3 = window.web3
		
            let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
    
            const owner = await DearMonsterContract.methods.getOwner().call()
            setOwner(owner)
        }
    }, [userId])

    useEffect(() => {
        props.getProbabilty();
    }, [])

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            setState({
                ...state,
                _id: propsData._id,
                price: propsData['price'],
                maxSupply: propsData['maxSupply'],
                maxPurchase: propsData['maxPurchase'],
                selectStar: propsData['selectStar']
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


    const export_csv = (arrayHeader, arrayData, delimiter, fileName) => {
		let header = arrayHeader.join(delimiter) + '\n';
		let csv = header;
		arrayData.forEach(array => {
			csv += array.join(delimiter) + "\n";
		});

		let csvData = new Blob([csv], { type: 'text/csv' });
		let csvUrl = URL.createObjectURL(csvData);

		let hiddenElement = document.createElement('a');
		hiddenElement.href = csvUrl;
		hiddenElement.target = '_blank';
		hiddenElement.download = fileName + '.csv';
		hiddenElement.click();
	}

	useEffect(() => {
		if (attributes && attributes.length > 0) {
			exportToExcelFun()
		}
	}, [attributes])

	const exportToExcel = async () => {

		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable();
		}
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			window.loaded_web3 = true
		}
		else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
		let web3 = window.web3
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)

		var _attributes = await DearMonsterContract.methods.getAttributes().call()
		setAttributes(_attributes)
	}

	const exportToExcelFun = () => {
		if (attributes.length == 0) return
		var star_idx = star_mappings[state.selectStar]
		var csvData = []
		var data1_cnt = 0
		var data2_cnt = 0
		var data3_cnt = 0
		var data4_cnt = 0
		var data5_cnt = 0
		for (let i = 0; i < attributes.length; i++) {
			if (parseInt(attributes[i][5]) === star_idx) {
				csvData.push([i, attributes[i][0]])
			}
			if (parseInt(attributes[i][5]) === 1) data1_cnt += 1
			else if (parseInt(attributes[i][5]) === 2) data2_cnt += 1
			else if (parseInt(attributes[i][5]) === 3) data3_cnt += 1
			else if (parseInt(attributes[i][5]) === 4) data4_cnt += 1
			else if (parseInt(attributes[i][5]) === 5) data5_cnt += 1
		}
		export_csv(headers, csvData, ',', 'export.csv')
		export_csv(['Star level', 'Total Count'],
			[['Star1', data1_cnt], ['Star2', data2_cnt], ['Star3', data3_cnt], ['Star4', data4_cnt], ['Star5', data5_cnt]],
			',', 'summary.csv'
		)
	}

    const editDetails = (data) => {
        props.history.push('/edit-probabilty', { data })
    }

    const deleteProbability = (id) => {
        if (window.confirm("Are you sure?")) {
            props.deleteProbability(id, JSON.parse(localStorage.getItem('token')))

        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
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
                    <div>
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

                    <div className="content-box">
                        <h3>Star level</h3>
                        <div className="row">
                                <div className={`col-md-8`}>
                        <label className="control-label">{`Maximum Purchase`}</label>
                        <select id='selectStar' className='form-control  w-100px' onChange={handleChange}>
										<option>Star 1</option>
										<option>Star 2</option>
										<option>Star 3</option>
										<option>Star 4</option>
										<option>Star 5</option>
									</select>
                        </div>
                        <div className={`col-md-4`}>
                        <button className="btn-default hvr-bounce-in" onClick={exportToExcel}>ADD</button>
                        </div>
                    </div>
                        <br />
                    </div></div> :
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                            <span className="icon"> </span>
                            {'You are not the owner'}
                    </div>
                </div>
            </div>               
        } 

                    <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Probabilty List</h3>
                        {!props.probabilityList.probabilityList.length &&
                        <button className="btn-default" onClick={() => props.history.push('/add-probabilty')}>ADD New</button>
                        } 
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Prob 1</th>
                                    <th>Prob 2</th>
                                    <th>Prob 3</th>
                                    <th>Prob 4</th>
                                    <th>Prob 5</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {props.probabilityList.probabilityList
                                    && props.probabilityList.probabilityList.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{data.prob_1}</td>
                                            <td>{data.prob_2}</td>
                                            <td>{data.prob_3}</td>
                                            <td>{data.prob_4}</td>
                                            <td>{data.prob_5}</td>
                                            <td><button onClick={() => editDetails(data)}>EDIT</button>
                                                <button onClick={() => deleteProbability(data._id)}>DELETE</button>
                                            </td>
                                        </tr>
                                    })}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

                </div>
            </div>

        </>
    )
}

const mapStateToProps = state => ({
    probabilityList: state.ProbabilityReducer
})

export default connect(mapStateToProps, { getProbabilty, addProbability, editProbability, deleteProbability })(SideSetting)