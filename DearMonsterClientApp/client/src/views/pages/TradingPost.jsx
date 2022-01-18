import React, { useState, useEffect } from 'react';
import FindMonster from '../../components/TradingPost/FindMonster';
import PostCard from '../../components/postCard/PostCard';
import { useHistory } from 'react-router';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import jsonData from '../..//data/Post.json';
import { usePagination } from '../../hooks/usePagination';
import { getTradeItemsAction } from './../../store/actions/auth/tradeItem';
import { useSelector } from 'react-redux';
import { getTradItems } from '../../store/actions/auth/login';
import { useDispatch } from 'react-redux';
import { baseUrl } from "../../config/config"
import axios from 'axios'
import { apiUrl } from '../../utils/constant';

const TradingPost = ({ }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [filterValues, setFilterValues] = useState({});
	const [error, setError] = useState('');
	const [data, setData] = useState([])
	const [searchedData, setSearchedData] = useState([])
	const { pageData, currentPage, previousPage, nextPage, totalPages, doPagination } = usePagination(data, 6, history.location.pathname);

	useEffect(() => {
		getTradingData();
	}, [])

	const getTradingData = async () => {
		axios.get(`${apiUrl}/api/tradeItem/allInTrade`)
			.then((res) => {
				let _posts = []
				if (res.data.tradeItems && res.data.tradeItems.length > 0) {
					res.data.tradeItems.forEach(item => {
						let post = {}
						post['onSale'] = true
						post['onTrading'] = true
						post['tradeId'] = item._id
						post['seller'] = item.seller
						post['price'] = item.price
						post['monsterId'] = item.monster._id
						post['title'] = item.monster.title
						post['img'] = item.monster.img
						post['totalRating'] = item.monster.totalRating
						post['values'] = {}
						post['id'] = item.mintedMonster.tokenId
						post['owner'] = item.mintedMonster.owner
						post['rating'] = item.mintedMonster.rating
						post['mintedId'] = item.mintedMonster._id
						post.values['Level'] = item.mintedMonster.values.Level
						post.values['EXP'] = item.mintedMonster.values.EXP
						post.values['Element'] = item.mintedMonster.values.Element
						post.values['Energy'] = item.mintedMonster.values.Energy
						post.values['OwnerID'] = `${item.seller.substring(0, 4)}...${item.seller.slice(-4)}`
						_posts.push(post);
					})
				}
				setData(_posts)
				doPagination(_posts);
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})
	}

	const sortData = (order, sortBy) => {
		console.log('sort data', order, sortBy, data)
		const sortingData = data.sort((a, b) => {
			if (order === 'desc') {
				return +a[sortBy] - +b[sortBy];
			} else if (order == 'asc') {
				return +b[sortBy] - +a[sortBy];
			}
			return 0;
		})
		setData(sortingData)
		doPagination(sortingData);
	}

	const filterData = (filteringValues) => {
		const filterData = searchedData.length ? searchedData : data

		const filteredRating = filterData.filter(item =>
			filteringValues.rating.filter(rating => rating !== item.rating.toString()).length == 0
		)
		console.log('filteredRating: ', filteredRating, data)
		if (filteredRating.length) {
			setData(filteredRating)
			doPagination(filteredRating)
		}
		else if (filteredRating.length === 0) {
			setData([])
			doPagination([])
		}
		else {
			getTradingData()
		}

		setFilterValues(filteringValues)
	}

	const clearFilterData = () => {
		setFilterValues({})
		doPagination(data)
	}

	const searchData = (searchValue) => {
		// console.log('search value', searchValue, data)
		const searchData = data.filter((element) => element.id.toString() === searchValue);
		// console.log('searchData: ', searchData)
		if (searchData.length > 0) {
			setSearchedData(searchData)
			setData(searchData)
			doPagination(searchData);
		}
		else {
			console.log('heloo ===================')
			setSearchedData([])
			getTradingData()
		}
	}

	const clearSearchData = () => {
		// doPagination(data);
		getTradingData()
	};


	// console.log('=== data ===', data)

	return (
		<div>
			<CurrenPageTitle title='Trading Post'></CurrenPageTitle>
			<div className='mt-lg-9 mt-7 container '>
				<div className='row  px-md-auto justify-content-center'>
					<div className='col-md-5 col-lg-3 col-12'>
						<FindMonster
							filterData={filterData}
							sortData={sortData}
							searchData={searchData}
							clearSearchData={clearSearchData}
							clearFilterData={clearFilterData}
						/>
					</div>
					<div className='col-lg-9 col-md-7 col-12'>
						<div className='px-md-0'>


							<section className='row row-cols-lg-3  gx-8 mt-9 	mt-md-0 '>
								{error && data?.length === 0 ? (
									<div className='col-12 center w-100 text-white mt-5'>
										<h3>{error}</h3>
									</div>
								) : (
									data.length > 0 ? data.map((post) => {
										return (
											<PostCard
												post={post}
												stepImg='/assets/imgs/droganBord.png'
												className='mb-9'
											/>
										);
									}) : ""
								)}
							</section>
						</div>
						{'error' && pageData?.length == 0 ? (
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
			</div>
		</div>
	);
};

export default TradingPost;
