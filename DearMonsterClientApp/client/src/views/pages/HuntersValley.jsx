import React, { useEffect, useState } from 'react';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector } from 'react-redux';
import { connectUserSuccess, updateUserBalance, startLoading, stopLoading } from '../../store/actions/auth/login';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import { notification } from "../../utils/notification";
import Swal from 'sweetalert2';
import axios from 'axios'

// import data from "../../data/Post.json";
import { CSVLink } from 'react-csv';
import detectEthereumProvider from '@metamask/detect-provider';

import { apiUrl, appEnv, addressList } from '../../utils/constant'

import DearMonster from '../../contracts/DearMonster.json';
import DMSToken from "../../contracts/DMSToken.json";
import DearMonsterTest from '../../contracts/DearMonsterTest.json';
import DMSTokenTest from "../../contracts/DMSTokenTest.json";


const tokenContractAbi = appEnv === 'test' ? DMSTokenTest : DMSToken
const nftContractAbi = appEnv === 'test' ? DearMonsterTest : DearMonster

const tokenContractAddress = appEnv === 'test' ? addressList.tokenAddressTest : addressList.tokenAddress
const nftContractAddress = appEnv === 'test' ? addressList.nftAddressTest : addressList.nftAddress


const HuntersValley = () => {
	const { userId } = useSelector((state) => state.auth);
	const { balance } = useSelector((state) => state.auth);
	const [quantity, setQuantity] = useState();
	const [price, setPrice] = useState(14800);
	const [caveLimit, setCaveLimit] = useState(30);
	const [purchaseLimit, setPurchaseLimit] = useState(10);
	const [account, setAccount] = useState();
	const [isOwner, setIsOwner] = useState(false);
	const [path, setPath] = useState([]);
	const [monsterIdsState, setMonsterIds] = useState([]);
	const [attributes, setAttributes] = useState([]);
	const [ratings, setRatings] = useState([]);
	const [numberList, setNumberList] = useState([]);
	const [data, setData] = useState([]);
	const dispatch = useDispatch();
	const headers = ['Token ID', 'Wallet'];


	useEffect(() => {

		let localNumberlist = []

		axios.get(`${apiUrl}/api/probabiltyList`)
			.then((res) => {
				let prob_1 = res.data.probabiltyList[0].prob_1
				let prob_2 = res.data.probabiltyList[0].prob_2
				let prob_3 = res.data.probabiltyList[0].prob_3
				let prob_4 = res.data.probabiltyList[0].prob_4
				let prob_5 = res.data.probabiltyList[0].prob_5

				const prob_1_10 = prob_1 * 10
				const prob_2_10 = prob_2 * 10
				const prob_3_10 = prob_3 * 10
				const prob_4_10 = prob_4 * 10
				const prob_5_10 = prob_5 * 10

				for (let i = 0; i < 1000; i++) {
					if (i < prob_1_10) { localNumberlist[i] = 1 }
					else if (i >= prob_1_10 && i < (prob_1_10 + prob_2_10)) { localNumberlist[i] = 2 }
					else if (i >= (prob_1_10 + prob_2_10) && i < (prob_1_10 + prob_2_10 + prob_3_10)) { localNumberlist[i] = 3 }
					else if (i >= (prob_1_10 + prob_2_10 + prob_3_10) && i < (prob_1_10 + prob_2_10 + prob_3_10 + prob_4_10)) { localNumberlist[i] = 4 }
					else { localNumberlist[i] = 5 }
				}
				setNumberList([...localNumberlist])
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})

		getMonstersData()
	}, [])

	const getMonstersData = () => {
		axios.get(`${apiUrl}/api/monster/monsterList`)
			.then((res) => {
				setData(res.data.monsters)
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})

	}

	useEffect(() => {
		if (data.length > 0) {
			setQuantity(1)
			getPath(1)
		}
	}, [data])

	const star_mappings = {
		'Star 1': 1,
		'Star 2': 2,
		'Star 3': 3,
		'Star 4': 4,
		'Star 5': 5
	};

	const handleConnect = async () => {
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
	};

	const updateBalance = (bal) => {
		dispatch(updateUserBalance(bal));
	}

	useEffect(async () => {

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
		// Load account
		let accounts = await web3.eth.getAccounts()
		setAccount(accounts[0]);

		// let networkId = await web3.eth.net.getId()
		// let DearMonsterNetwork = DearMonster.networks[networkId]
		// let DearMonsterContract = new web3.eth.Contract(DearMonster.abi, DearMonsterNetwork.address)

		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
		var _owner = await DearMonsterContract.methods.owner().call()

		setIsOwner(_owner === accounts[0])
		// setIsOwner(_owner === accounts[0] || accounts[0] === '0xd7EeFFb68C815FFc8D0E77abdd2F5c8Ec65b58C7')

		var maxSupply = await DearMonsterContract.methods.getMaxSupply().call()
		var maxPurchaseLimit = await DearMonsterContract.methods.getMaxPurchaseLimit().call()
		var _price = await DearMonsterContract.methods.getPrice().call()
		setPurchaseLimit(maxPurchaseLimit)
		setPrice(_price)
		setTimeout(() => {
			if (document.getElementById('maxcavenumber') !== null)
				document.getElementById('maxcavenumber').value = maxSupply
			if (document.getElementById('maxpurchasecount') !== null)
				document.getElementById('maxpurchasecount').value = maxPurchaseLimit
			if (document.getElementById('caveprice') != null)
				document.getElementById('caveprice').value = _price
			if (document.getElementById('caveprice_common') !== null)
				document.getElementById('caveprice_common').innerText = _price
		}, 500)
	}, [window.web3, userId])

	const handlePriceChange = async (e) => {
		if (!userId) return

		const value = document.getElementById('caveprice').value
		setPrice(value);

		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		// let networkId = await web3.eth.net.getId()
		// let DearMonsterNetwork = DearMonster.networks[networkId]
		// let DearMonsterContract = new web3.eth.Contract(DearMonster.abi, DearMonsterNetwork.address)
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
		await DearMonsterContract.methods.setPrice(parseInt(value)).send({ from: accounts[0] });
	}

	const handleCaveLimitChange = async (e) => {
		if (!userId) return

		const value = document.getElementById('maxcavenumber').value
		setCaveLimit(value);

		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		// let networkId = await web3.eth.net.getId()
		// let DearMonsterNetwork = DearMonster.networks[networkId]
		// let DearMonsterContract = new web3.eth.Contract(DearMonster.abi, DearMonsterNetwork.address)
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
		await DearMonsterContract.methods.setMaxSupply(parseInt(value)).send({ from: accounts[0] });
	}

	const handleMaxPurchaseCount = async (e) => {
		if (!userId) return

		const value = document.getElementById('maxpurchasecount').value
		setPurchaseLimit(value);

		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		// let networkId = await web3.eth.net.getId()
		// let DearMonsterNetwork = DearMonster.networks[networkId]
		// let DearMonsterContract = new web3.eth.Contract(DearMonster.abi, DearMonsterNetwork.address)
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
		await DearMonsterContract.methods.setMaxPurchaseLimit(parseInt(value)).send({ from: accounts[0] });
	}

	const handleQuantityChange = (e) => {
		const { value } = e.target;
		setQuantity(value);
		getPath(value)
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

		var star_key = document.getElementById("select-star").value;
		var star_idx = star_mappings[star_key]
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

	const handlePurchase = async () => {

		dispatch(startLoading(true))
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
		getPath(quantity)
		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		setAccount(accounts[0]);

		if (true) {
			let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
			let DMSTokenContract = new web3.eth.Contract(tokenContractAbi.abi, tokenContractAddress)


			var isMaxSupply = await DearMonsterContract.methods.checkMaxSupply().call()
			var price = await DearMonsterContract.methods.getPrice().call()
			// var maxSupply = await DearMonsterContract.methods.getMaxSupply().call()
			// var totalSupply = await DearMonsterContract.methods.totalSupply().call()

			// todo : uncomment this !!!!!
			if (isMaxSupply) {
				dispatch(stopLoading(false))

				let notify = notification({
					type: 'error',
					message: 'Not enough NFTs!',
				});
				notify();
				return
			}

			// var _owner = await DearMonsterContract.methods.owner().call()
			DMSTokenContract.methods.balanceOf(accounts[0]).call().then(async function (balance) {

				// var tokensOfOwner = await DearMonsterContract.methods.tokensOfOwner(accounts[0]).call()
				// console.log('=========== tokenOfOwner =========', tokensOfOwner)

				var _amount = Number(quantity * price * 10 ** 18);
				var amount = _amount.toLocaleString('fullwide', { useGrouping: false })
				if (_amount >= balance) {
					let notify = notification({
						type: 'error',
						message: 'Insufficient fund!',
					});
					dispatch(stopLoading(false))
					notify();
					return
				}


				try {
					console.log('amountttt', amount)
					await DMSTokenContract.methods.approve(DearMonsterContract._address, web3.utils.toBN(amount.toString())).send({ from: accounts[0] });
					await DearMonsterContract.methods.mintDearMonster(path, ratings, web3.utils.toBN(amount.toString())).send({ from: accounts[0] });

					let tokensOfOwnerFromContract = await DearMonsterContract.methods.tokensOfOwner(account).call();
					let latestIds = tokensOfOwnerFromContract.slice((tokensOfOwnerFromContract.length - quantity), tokensOfOwnerFromContract.length)

					latestIds.forEach(async (item, index) => {
						let attributesByIndex = await DearMonsterContract.methods.attributes(item).call();

						let params = new URLSearchParams()
						params.append('owner', attributesByIndex['owner'])
						params.append('tokenId', parseInt(item))
						params.append('rating', parseInt(attributesByIndex['star']))
						params.append('monsterId', monsterIdsState[index])


						params.append('values.Level', attributesByIndex['level'])
						params.append('values.EXP', attributesByIndex['exp'])
						params.append('values.Element', attributesByIndex['element'])
						params.append('values.Energy', attributesByIndex['energy'])

						const config = {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
							}
						}
						axios.post(`${apiUrl}/api/mintedMonster`, params, config)
							.then((res) => {
								dispatch(stopLoading(false))
								Swal.fire({
									icon: 'success',
									title: 'Cave Minted Successfully',
									text: 'Please check Inventory for minted Cave!'
								})

								let newParams = new URLSearchParams()
								newParams.append('name', 'Minted Monster')
								newParams.append('type', 'CaveMinting')
								newParams.append('activityDetails.mintedMonsterId', res.data.mintedMonster_._id)
								axios.post(`${apiUrl}/api/activity`, newParams, config)
									.then((res) => {
										console.log('Activity has been created')
									})
									.catch((e) => {
										console.log(e)
									})

							})
							.catch((e) => {
								dispatch(stopLoading(false))
								Swal.fire({
									icon: 'error',
									title: 'Error',
									text: 'Something went wrong, Please contact admin!'
								})
								console.log(e)
							})
					})
				} catch (e) {
					dispatch(stopLoading(false))
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Transaction was rejected from Metamask'
					})
					console.log("Error ----------------")
					console.log(e)
				}
				// setAttributes(_attributes)
				updateBalance(balance + 1111)
			})
		}
	}

	function getPath(items) {
		let paths = [];
		let _ratings = [];
		let monsterIds = [];

		// for (let i = 0; i < items; i++) {
		// 	let rand = parseInt(Math.random() * 600);
		// 	let randCheck = randomizer()

		// 	if (randCheck == 5) {
		// 		paths[i] = rand % 2 ? data[18].img : data[21].img;
		// 		monsterIds[i] = rand % 2 ? data[18]._id : data[21]._id;
		// 		_ratings[i] = 5;
		// 	} else if (randCheck == 4) {
		// 		paths[i] = rand % 2 ? data[0].img : data[24].img;
		// 		monsterIds[i] = rand % 2 ? data[0]._id : data[24]._id;
		// 		_ratings[i] = 4;
		// 	} else if (randCheck == 3) {
		// 		paths[i] = rand % 2 ? data[6].img : data[12].img;
		// 		monsterIds[i] = rand % 2 ? data[6]._id : data[12]._id;
		// 		_ratings[i] = 3;
		// 	} else if (randCheck == 2) {
		// 		paths[i] = rand % 2 ? data[3].img : data[9].img;
		// 		monsterIds[i] = rand % 2 ? data[3]._id : data[9]._id;
		// 		_ratings[i] = 2;
		// 	} else {
		// 		paths[i] = rand % 2 ? data[15].img : data[27].img;
		// 		monsterIds[i] = rand % 2 ? data[15]._id : data[27]._id;
		// 		_ratings[i] = 1;
		// 	}
		// }

		for (let i = 0; i < items; i++) {
			let rand = parseInt(Math.random() * 600);
			let randCheck = randomizer()

			if (randCheck == 5) {
				paths[i] = rand % 2 ? data[1].img : data[2].img;
				monsterIds[i] = rand % 2 ? data[1]._id : data[2]._id;
				_ratings[i] = 5;
			} else if (randCheck == 4) {
				paths[i] = rand % 2 ? data[3].img : data[4].img;
				monsterIds[i] = rand % 2 ? data[3]._id : data[4]._id;
				_ratings[i] = 4;
			} else if (randCheck == 3) {
				paths[i] = rand % 2 ? data[2].img : data[4].img;
				monsterIds[i] = rand % 2 ? data[2]._id : data[4]._id;
				_ratings[i] = 3;
			} else if (randCheck == 2) {
				paths[i] = rand % 2 ? data[4].img : data[1].img;
				monsterIds[i] = rand % 2 ? data[4]._id : data[1]._id;
				_ratings[i] = 2;
			} else {
				paths[i] = rand % 2 ? data[2].img : data[3].img;
				monsterIds[i] = rand % 2 ? data[2]._id : data[3]._id;
				_ratings[i] = 1;
			}
		}

		setPath(paths)
		setRatings(_ratings)
		setMonsterIds(monsterIds)
	}

	const randomizer = () => {
		var idx = Math.floor(Math.random() * numberList.length);
		return numberList[idx]
	}

	return (
		<div>
			<CurrenPageTitle title="Hunter's Valley"></CurrenPageTitle>
			<div className='container center mt-6'>
				<div className='discoveryCaveBg py-2 w-md-lg2 w-md2 mb-8'>
					<div className='center'>
						<img src='/assets/gif/Cave Animated.gif' alt='' className='w-75 mt-7' />
					</div>
					<div className='center fs-19 flex-column text-white'>
						<p className='mt-2 mb-6'>Discovery Cave</p>
						<div className='d-flex justify-content-between w-60 mb-4'>
							<p>Price</p>
							{isOwner ?
								<div className='d-flex align-items-center'>
									<img src='/assets/imgs/coin.png' className='w-30px me-1' />
									<img src='/assets/imgs/apply.png' className='cursor w-30px me-1' onClick={handlePriceChange} />
									<input
										type='number'
										name=''
										className='form-control  w-100px'
										placeholder='1 to 1000000'
										id='caveprice'
										min='1'
										max='1000000'
										defaultValue="14800"
									/>
								</div>
								:
								<div className='d-flex align-items-center'>
									<img src='/assets/imgs/coin.png' className='w-30px me-1' />
									<p id='caveprice_common'>14,800</p>
								</div>
							}
						</div>
						{isOwner ?
							<div className='d-flex justify-content-between w-60 mb-4'>
								<p>Cave limit</p>
								<div className='d-flex align-items-center'>
									<img src='/assets/imgs/apply.png' className='cursor w-30px me-1' onClick={handleCaveLimitChange} />
									<input
										type='number'
										name=''
										className='form-control  w-100px'
										placeholder='30 to 100'
										id='maxcavenumber'
										min='30'
										max='100'
										defaultValue="30"
									/>
								</div>
							</div>
							: ''}

						{isOwner ?
							<div className='d-flex justify-content-between w-60 mb-4'>
								<p>Purchase limit</p>
								<div className='d-flex align-items-center'>
									<img src='/assets/imgs/apply.png' className='cursor w-30px me-1' onClick={handleMaxPurchaseCount} />
									<input
										type='number'
										name=''
										className='form-control  w-100px'
										placeholder='10 to 100'
										id='maxpurchasecount'
										min='10'
										max='100'
										defaultValue="10"
									/>
								</div>
							</div>
							: ''}
						{isOwner ?
							<div className='d-flex justify-content-between w-60 mb-4'>
								<p>Star level</p>
								<div className='d-flex align-items-center'>
									{/* <CSVLink >Export to CSV</CSVLink> */}
									<img src='/assets/imgs/download_1.png' className='cursor w-30px me-1' onClick={exportToExcel} />
									<select id='select-star' className='form-control  w-100px'>
										<option>Star 1</option>
										<option>Star 2</option>
										<option>Star 3</option>
										<option>Star 4</option>
										<option>Star 5</option>
									</select>
								</div>
							</div>
							: ''}

						<div className='d-flex justify-content-between mb-6 w-60 align-items-center'>
							<p>Select quantity</p>
							<input
								type='number'
								name='quantity'
								className='form-control  w-100px'
								placeholder={purchaseLimit}
								id='quantity'
								min='1'
								max={purchaseLimit}
								value={quantity}
								onChange={handleQuantityChange}
							/>
						</div>
					</div>
					<footer className='center mt-6 flex align-items-center pb-4 mb-4'>
						{userId ? (
							<div>
								<div className='header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor'
									onClick={handlePurchase}
								>
									Purchase
								</div>
								{/* <div className='header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor'
									// style='margin-top: 15px;'
									onClick={handlePurchase}
								>
									Purchase
								</div>	 */}
							</div>
						) : (
							<div
								className='header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor'
								onClick={handleConnect}
							>
								Connect
							</div>
						)}
					</footer>
				</div>

			</div>
		</div>
	);
};

export default HuntersValley;
