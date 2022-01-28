import React, { useState, useEffect } from 'react'
import MinionCard from './MinionCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Loading from '../common/Loading';
import axios from 'axios'
import { apiUrl } from '../../utils/constant'

const data = [
	{
		id: '#123212',
		title: 'Monster A',
		img: '/assets/gif/4 Monster characters (1)/1. Monster animated.gif',
		rating: '2',
		totalRating: 3,
		values: {
			Win_Rate: '~70%',
			Reward_Estimated: 'None',
			Exp_Gain: 'A34500',
		},
		price: '3,000',
	},
	{
		id: '#123212',
		title: 'Monster B',
		img: '/assets/gif/4 Monster characters (1)/3. Monster animated.gif',
		rating: '2',
		totalRating: 3,
		values: {
			Win_Rate: '~90%',
			Reward_Estimated: 'None',
			Exp_Gain: 'A34500',
		},
		price: '3,000',
	},
	{
		id: '#123212',
		title: 'Monster C',
		img: '/assets/gif/4 Monster characters (1)/2. Monster animated.gif',
		rating: '2',
		totalRating: 3,
		values: {
			Win_Rate: '~72%',
			Reward_Estimated: 'None',
			Exp_Gain: 'A34500',
		},
		price: '3,000',
	},
	{
		id: '#123212',
		title: 'Monster D',
		img: '/assets/gif/4 Monster characters (1)/4. Monster animated.gif',
		rating: '2',
		totalRating: 3,
		values: {
			Win_Rate: '~50%',
			Reward_Estimated: 'None',
			Exp_Gain: 'A34500',
		},
		price: '3,000',
	},
];

const ChooseMinion = ({ minionFight, loading, status, totalReward, selectedMonster }) => {

	const [minions, setMinions] = useState([])

	useEffect(() => {
		function getMinion() {
			axios.get(`${apiUrl}/api/minion`)
				.then((res) => {
					setMinions(res.data.minions)
				})
				.catch((e) => {
					console.log("Error ----------------")
					console.log(e)
				})
		}
		getMinion()
	}, [])

	useEffect(() => {
		if (minions.length && selectedMonster) {
			const rewardMapped = minions.map(item => {
				let rewardEstimated
				if (item.values) {
					Object.entries(JSON.parse(item.values.Reward_Estimated)).map((item, i) => {
						const field = item[0]
						const value = item[1]
						if (Number(field) === Number(selectedMonster.values.Level)) {
							rewardEstimated = Number(value)
						}
						// else {
						// 	rewardEstimated = 0
						// }
					})
				}
				return {
					...item,
					rewardEstimated
				}
			})
			setMinions(rewardMapped)
		}

	}, [selectedMonster])

	const handleMinionFight = (minion) => {
		minionFight(minion)
	}

	return (
		<div>
			<div className='center mt-9'>
				<h5 className='text-white mt-4 sm-fs-29 fs-21'>CHOOSE A MINION</h5>
			</div>
			<div className='container mb-9  mt-5'>
				<Splide
					className='container'
					options={{
						rewind: true,
						gap: '8rem',
						perPage: data.length == 1 ? 1 : 3,
						pagination: false,
						drag: false,
						perMove: 3,
						breakpoints: {
							1100: {
								perPage: 2,
							},
							680: {
								perPage: 1,
							},
						},
						classes: {
							arrows: '',
							arrow: `splide__arrow text-white ${data.length == 1 ? 'd-none' : ''}`,
							prev: 'splide__arrow--prev your-class-prev border rounded-circle p-2 end-0',
							next: 'splide__arrow--next  border rounded-circle p-2 ',
						},
					}}
				>
					{minions.map((post, index) => {
						return (
							<SplideSlide key={index}>
								<MinionCard post={post} handleFight={() => handleMinionFight(post)} />
							</SplideSlide>
						)
					})}
				</Splide>
			</div>
			{/* {status !== '' &&  */}
			<FightModal loading={loading} status={status} totalReward={totalReward} />
			{/* } */}
		</div>
	);
}


const FightModal = ({ loading, status, totalReward }) => {
	return (
		<div
			className='modal  fade false'
			id='exampleModal'
			tabIndex='-1'
			aria-labelledby='exampleModalLabel'
			aria-hidden='true'
		>
			<div className='modal-dialog'>
				<div className='modal-content bg-dark bg-opacity-75 border-0 py-7 text-white'>
					<div className='modal-body center fs-25'>{loading ? <Loading /> :
						<div>
							<span>{status}</span> <br />
							<span>{totalReward && `${totalReward} Reward has been earned`}</span>
						</div>
					}
					</div>
				</div>
			</div>
		</div>
	);
};


export default ChooseMinion
