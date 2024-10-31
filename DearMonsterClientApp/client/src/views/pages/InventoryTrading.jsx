import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import NavLinks from '../../components/Inventory/NavLinks';
import PostCard from '../../components/Inventory/PostCardTrading';
import { usePagination } from '../../hooks/usePagination';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess } from '../../store/actions/auth/login';
import Web3 from 'web3';
import DearMonster from '../../contracts/DearMonster.json';
import data from "../../data/Post.json";
import axios from 'axios'
import { apiUrl } from '../../utils/constant';

const match = {params : { slug: 'trading' }}

const Inventory = () => {
	const [posts, setPosts] = React.useState([]);
	const { userId } = useSelector((state) => state.auth);
	const [account, setAccount] = useState();
	const dispatch = useDispatch();
	const [limit] = useState(30);
	const [skip, setSkip] = useState(0);
	const [count, setCount] = useState(0);

	const handleConnect = async () => {
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
	};

	useEffect(() => {
		setAccountFun();
	}, [window.web3])

	const setAccountFun = async () => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			window.loaded_web3 = true
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}

		let web3 = window.web3
		// Load account
		let accounts = await web3.eth.getAccounts()
		setAccount(accounts[0]);
	};

	useEffect(() => {
		getCave(skip, limit);
	}, [userId, skip, limit])


	const getCave = async (skip, limit) => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			window.loaded_web3 = true
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}

		let web3 = window.web3
		// Load account
		let accounts = await web3.eth.getAccounts()
		setAccount(accounts[0]);
		getData(accounts[0], skip, limit);

	};

	const nextPage = () => {
        setSkip(skip + limit)
    }

    const previousPage = () => {
        setSkip(skip - limit)
    }

	function getData(owner, skip, limit) {
		let _posts = []
		axios.get(`${apiUrl}/api/tradeItem/inTradeItems/${owner}?limit=${limit}&skip=${skip}`)
			.then((res) => {
				if(res.data.count) {
					setCount(res.data.count)
				}
				if (res.data.tradeItems && res.data.tradeItems.length > 0) {
					res.data.tradeItems.forEach(item => {
						let post = {}
						post['onSale'] = true
						post['tradeId'] = item._id
						post['monsterId'] = item.monster._id
						post['mintedId'] = item.mintedMonster._id
						post['id'] = item.mintedMonster.tokenId
						post['rating'] = item.mintedMonster.rating
						post['title'] = item.monster.title
						post['img'] = item.monster.img
						post['totalRating'] = item.monster.totalRating
						post['values'] = {}
						post.values['Level'] = item.mintedMonster.values.Level
						post.values['EXP'] = item.mintedMonster.values.EXP
						post.values['Element'] = 'None'
						post.values['Energy'] = item.mintedMonster.values.Energy
						post['price'] = item.price
						post.values['OwnerID'] = `${item.seller.substring(0, 4)}...${item.seller.slice(-4)}`
						_posts.push(post);
					})
				}
				setPosts(_posts)
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})
	}

	return (
		<div>
			<CurrenPageTitle title='Inventory'></CurrenPageTitle>
			<NavLinks match={match} />
			{
				userId ?
					<div className='container'>
						<div className='center'>
							{
								posts.length < 1 ? (
									<p className='text-white  mt-9 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
										You Don't have any item in trading
									</p>
								) :
									''
							}

						</div>
					</div>
					:
					(
						<div className='container'>
							<div className='center'>
								<div>
									<p className='text-white  mt-9 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
										Please connect to see Inventory
									</p>
									<div
										onClick={handleConnect}
										className={` header-Connect-btn h-40px w-sm mx-auto  mt-5 center bold cursor`}
									>
										Connect
									</div>
								</div>
							</div>
						</div>
					)
			}
			{
				userId ?
					<div className='container mt-10 px-md-auto px-8'>
						<div className='row row-cols-lg-3 row-cols-md-2 gx-10'>
							{posts.map((post) => {
								return (
									<PostCard getData={getData} account={account} post={post} stepImg='/assets/imgs/droganBord.png' className='mb-9' />
								);
							})}
						</div>
						{posts.length == 0 ? (
							''
						) : (
							<footer className='center pb-8 pt-4'>
								<img
									src='/assets/imgs/ArrowLeft.png '
									className={'cursor'}
									onClick={(skip / limit) + 1 != 1 ? previousPage : undefined}
								/>
								<p className='text-white fs-22 mx-5'>
									{(skip / limit) + 1}/{Math.ceil(count / limit)}
								</p>
								<img src='/assets/imgs/ArrowRight.png' 
									className={'cursor'}
									onClick={(skip / limit) + 1 != Math.ceil(count / limit) ? nextPage : undefined} 
								/>
							</footer>
						)}
					</div>
					:
					''
			}
		</div>
	);
};

export default Inventory;
