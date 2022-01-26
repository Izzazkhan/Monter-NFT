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
	const [data, setData] = useState([])
	const [filteredData, setFilteredData] = useState(null)
	const [filterObject, setFilterObject] = useState({})


	const [error, setError] = useState('');
	const [filterValues, setFilterValues] = useState();
	const [searchedData, setSearchedData] = useState()
	const { pageData, currentPage, previousPage, nextPage, totalPages, doPagination } = usePagination(data, 6, history.location.pathname);

	useEffect(() => {
		getTradingData()
	}, [])

	useEffect(() => {
		if (Object.keys(filterObject).length > 0) {
			let localFilterData = []
			let filterApplied = false

			if (filterObject.starsArray && filterObject.starsArray.length > 0) {
				data.forEach(item => {
					if (filterObject.starsArray.includes(`${item.rating}`)) {
						localFilterData.push(item)
						filterApplied = true
					}
					else {
						filterApplied = true
					}
				})
			}

			if (filterObject.tokenId && filterObject.tokenId != '') {
				let searchDataLocal
				if (filterApplied) {
					searchDataLocal = localFilterData.filter((element) => element.id == parseInt(filterObject.tokenId))
				} else {
					searchDataLocal = data.filter((element) => element.id == parseInt(filterObject.tokenId))
					filterApplied = true
				}
				localFilterData = searchDataLocal
			}

			if (filterObject.order && filterObject.order != 'all') {
				let sortBy = 'price'
				if (filterApplied) {
					let sortingData = localFilterData.sort((a, b) => {
						if (filterObject.order === 'desc') {
							return +a[sortBy] - +b[sortBy];
						} else if (filterObject.order == 'asc') {
							return +b[sortBy] - +a[sortBy];
						}
						return 0;
					})
					localFilterData = sortingData
				} else {
					filterApplied = true
					let sortingData = data.sort((a, b) => {
						if (filterObject.order === 'desc') {
							return +a[sortBy] - +b[sortBy];
						} else if (filterObject.order == 'asc') {
							return +b[sortBy] - +a[sortBy];
						}
						return 0;
					})
					localFilterData = sortingData
				}

			}

			if (filterApplied) {
				setFilteredData(localFilterData)
				doPagination(localFilterData)
			}
		} else {
			if (data && data.length > 0) {
				setFilteredData(data)
				doPagination(data)
			}
		}
	}, [filterObject])

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
						post.values['Element'] = 'None'
						post.values['Energy'] = item.mintedMonster.values.Energy
						post.values['OwnerID'] = `${item.seller.substring(0, 4)}...${item.seller.slice(-4)}`
						_posts.push(post);
					})
				}
				setData(_posts)
				doPagination(_posts)

			})
			.catch((e) => {
				console.log(e)
			})
	}

	const clearFilterData = () => {
		let tempObj = { ...filterObject }
		delete tempObj.starsArray
		setFilterObject(tempObj)
	}

	const sortData = (order, sortBy = 'price') => {
		if (order != 'all') {
			setFilterObject({ ...filterObject, order })
		} else {
			let tempObj = { ...filterObject }
			delete tempObj.order
			setFilterObject(tempObj)
		}
	}

	const searchData = (tokenId) => {
		if (tokenId != '') {
			setFilterObject({ ...filterObject, tokenId })
		} else {
			let tempObj = { ...filterObject }
			delete tempObj.tokenId

			setFilterObject(tempObj)
		}
	}

	const clearSearchData = () => {
		setFilterObject({})
	}

	const filterDataByStar = (starsArray) => {
		if (starsArray.length > 0) {
			setFilterObject({ ...filterObject, starsArray })
		} else {
			let tempObj = { ...filterObject }
			delete tempObj.starsArray

			setFilterObject(tempObj)
		}
	}



	return (
		<div>
			<CurrenPageTitle title='Trading Post'></CurrenPageTitle>
			<div className='mt-lg-9 mt-7 container '>
				<div className='row  px-md-auto justify-content-center'>
					<div className='col-md-5 col-lg-3 col-12'>
						<FindMonster
							sortData={sortData}
							searchData={searchData}
							clearSearchData={clearSearchData}
							clearFilterData={clearFilterData}
							filterDataByStar={filterDataByStar}
						/>
					</div>
					<div className='col-lg-9 col-md-7 col-12'>
						<div className='px-md-0'>

							{
								filteredData ?
									<section className='row row-cols-lg-3  gx-8 mt-9 	mt-md-0 '>
										{error && filteredData?.length === 0 ? (
											<div className='col-12 center w-100 text-white mt-5'>
												<h3>{error}</h3>
											</div>
										) : (
											filteredData.length > 0 ? filteredData.map((post) => {
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
									:
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

							}


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
