import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import NavLinks from '../../components/Inventory/NavLinks';
import PostCard from '../../components/Inventory/PostCard';
import { usePagination } from '../../hooks/usePagination';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserAction, connectUserSuccess } from './../../store/actions/auth/login';
import Web3 from 'web3';
import DearMonster from '../../contracts/DearMonster.json';
import data from "../../data/Post.json";
import axios from 'axios'

const Inventory = ({ match }) => {
	const [posts, setPosts] = React.useState([]);
	const { userId } = useSelector((state) => state.auth);
	const [account, setAccount] = useState();
	const [paths, setPaths] = useState([]);
	const [attributes, setAttributes] = useState([]);
	const dispatch = useDispatch();
	const history = useHistory();
	const { pageData, currentPage, previousPage, nextPage, totalPages, doPagination } =
		usePagination(posts, 6, history.location.pathname);

	const handleConnect = () => {
		dispatch(connectUserAction());
	};

	useEffect(() => {
		getConnection();
	}, [window.web3])

	const getConnection = async () => {
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
		getCave();
	}, [])

	const getCave = async () => {
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
		getData(accounts[0]);
	};

	function getData(owner) {
		let _posts = []
		axios.get('http://1a2f-119-155-21-243.ngrok.io/api/mintedMonster/ownerItems/' + owner)
			.then((res) => {
				if (res.data.mintedMonster && res.data.mintedMonster.length > 0) {
					res.data.mintedMonster.forEach(item => {
						let post = {}
						post['mintedId'] = item._id
						post['monsterId'] = item.monster._id
						post['id'] = item.tokenId
						post['title'] = item.monster.title
						post['img'] = item.monster.img
						post['rating'] = item.rating
						post['totalRating'] = item.monster.totalRating
						post['values'] = {}
						post.values['Level'] = item.values.Level
						post.values['EXP'] = item.values.EXP
						post.values['Element'] = item.values.Element
						post.values['Energy'] = item.values.Energy
						// post.values['Price'] = "48000"
						post.values['OwnerID'] = `${owner.substring(0, 4)}...${owner.slice(-4)}`
						_posts.push(post);
					})
				}
				setPosts(_posts)
				doPagination(_posts);
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})
	}

	// useEffect(() => {
	// 	if (posts.length > 0)
	// 	  return
	// 	getData();
	// }, [attributes])


	// useEffect(() => {
	// 	getData();
	// }, [])

	return (
		<div>
			<CurrenPageTitle title='Inventory'></CurrenPageTitle>
			<NavLinks match={match} />
			{posts.length > 0 ? '' :
				<div className='container'>
					<div className='center'>
						{account ? (
							<p className='text-white  mt-9 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
								You Don't have any inventory
							</p>
						) : (
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
						)}
					</div>
				</div>
			}
			<div className='container mt-10 px-md-auto px-8'>
				<div className='row row-cols-lg-3 row-cols-md-2 gx-10'>
					{pageData.map((post) => {
						return (
							<PostCard account={account} post={post} stepImg='/assets/imgs/droganBord.png' className='mb-9' />
						);
					})}
				</div>
				{pageData.length == 0 ? (
					''
				) : (
					<footer className='center pb-8 pt-4'>
						<img
							src='/assets/imgs/ArrowLeft.png '
							className='cursor'
							onClick={previousPage}
						/>
						<p className='text-white fs-22 mx-5'>
							{currentPage}/{totalPages}
						</p>
						<img src='/assets/imgs/ArrowRight.png' className='cursor' onClick={nextPage} />
					</footer>
				)}
			</div>
		</div>
	);
};

export default Inventory;
