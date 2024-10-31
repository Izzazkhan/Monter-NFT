import React, { useState, useEffect } from 'react';
import FindMonster from '../../components/TradingPost/FindMonster';
import PostCard from '../../components/postCard/PostCard';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import axios from 'axios'
import { apiUrl } from '../../utils/constant';

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
    }
}

const TradingPost = ({ }) => {
	const [data, setData] = useState([])
	const [filteredData, setFilteredData] = useState([])
    const [limit] = useState(30);
	const [skip, setSkip] = useState(0);
    const [searchLimit] = useState(30);
    const [searchSkip, setSearchSkip] = useState(0);
	const [count, setCount] = useState(0)
	const [searchCount, setSearchCount] = useState(0)

	const [starArray, setStarArray] = useState([])
	const [tokenId, setTokenId] = useState('')
	const [order, setOrder] = useState('')

	const [error, setError] = useState('')
	useEffect(() => {
		getTradingData(skip, limit)
	}, [skip, limit])

    useEffect(() => {
        // if (searchSkip != 0) {
            filterData(tokenId, starArray, order)
        // }
    }, [searchSkip, searchLimit])

    const nextPage = () => {
        setSkip(skip + limit)
    }

    const previousPage = () => {
        setSkip(skip - limit)
    }

    const nextSearchPage = () => {
        setSearchSkip(searchSkip + searchLimit)
    }

    const previousSearchPage = () => {
        setSearchSkip(searchSkip - searchLimit)
    }

    const filterData = (tokenId, starArray, order) => {
        const typedStarArray = starArray.map(star => Number(star))
        
		let formData = new URLSearchParams()
        const params = {
            tokenId: tokenId != '' ? Number(tokenId) : tokenId,
            starArray: typedStarArray,
            order: order
        }
        formData.append("data", JSON.stringify(params))
        axios.post(`${apiUrl}/api/tradeItem/allInTrade?limit=${searchLimit}&skip=${searchSkip}`, formData, config)
        .then((res) => {
            // console.log('filter response', res)
            if(res.data.count) {
                setSearchCount(res.data.count)
            }
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
            setFilteredData(_posts)
        })
        .catch((e) => {
            console.log(e)
            setError(e)
        })
    }

	const getTradingData = async (skip, limit) => {
		axios.get(`${apiUrl}/api/tradeItem/allInTrade?limit=${limit}&skip=${skip}`)
			.then((res) => {
                if(res.data.count) {
					setCount(res.data.count)
				}
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
			})
			.catch((e) => {
				console.log(e)
                setError(e)
			})
	}

	const clearFilterData = () => {
        setStarArray([])
        filterData(tokenId, [], order)
	}

	const sortData = (order) => {
        setOrder(order)
        filterData(tokenId, starArray, order)
		// if (order != 'all') {
		// 	setFilterObject({ ...filterObject, order })
		// } else {
		// 	let tempObj = { ...filterObject }
		// 	delete tempObj.order
		// 	setFilterObject(tempObj)
		// }
	}

	const searchData = (tokenId) => {
        setTokenId(tokenId)
        filterData(tokenId, starArray, order)
	}

	const clearSearchData = () => {
        setTokenId('')
        filterData('', starArray, order)
	}

	const filterDataByStar = (starsArray) => {
        setStarArray(starsArray)
        filterData(tokenId, starsArray, order)
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
								(tokenId != '' || starArray.length > 0 || order != '') ?
                                <>
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
                                </>
                                :
                                <>
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
                                </>
							}
						</div>
						{
                        (tokenId != '' || starArray.length > 0 || order != '') ?
                        (
                            <>
                            {filteredData.length > 0 ?
                                <footer className='center pb-8 pt-4'>
                                    <img
                                        src='/assets/imgs/ArrowLeft.png '
                                        className={'cursor'}
                                        onClick={(searchSkip / searchLimit) + 1 != 1 ? previousSearchPage : undefined}
                                    />
                                    <p className='text-white fs-22 mx-5'>
                                        {(searchSkip / searchLimit) + 1}/{Math.ceil(searchCount / searchLimit)}
                                    </p>
                                    <img src='/assets/imgs/ArrowRight.png' 
                                        className={'cursor'}
                                        onClick={(searchSkip / searchLimit) + 1 != Math.ceil(searchCount / searchLimit) ? nextSearchPage : undefined} 
                                    />
                                </footer> : ""
                            }
                            </>
                        )
                        : (
                            <>
                            {data.length > 0 ?
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
                                        onClick={(skip / limit) + 1 != Math.ceil(count / limit) ? nextPage  : undefined} 
                                    />
                                </footer> : ""
                            }
                            </>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TradingPost;
