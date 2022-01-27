import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import data from "../../data/Post.json";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';
import { apiUrl } from '../../utils/constant'
import axios from 'axios'
const ChooseDearMonster = ({ handleonSelect, updateMonsterAfterFight }) => {

	const [monsters, setMonsters] = useState([])
	const [updateMonsterAfterEnergyChange, setUpdateMonsterAfterEnergyChange] = useState(false)


	useEffect(() => {
		function getDearMonster() {
			let monsters = []
			const account = '0x7ACf46627094FA89339DB5b2EB862F0E8Ea4D9fc'
			axios.get(`${apiUrl}/api/mintedMonster/ownerItems/` + account)
				.then((res) => {
					// console.log('response::', res)
					if (res.data.mintedMonster && res.data.mintedMonster.length > 0) {
						res.data.mintedMonster.forEach(item => {
							// if (item.tradeitem.length < 1) {
							let singleMonster = {}
							singleMonster['mintedId'] = item._id
							singleMonster['monsterId'] = item.monster._id
							singleMonster['id'] = item.tokenId
							singleMonster['title'] = item.monster.title
							singleMonster['img'] = item.monster.img
							singleMonster['rating'] = item.rating
							singleMonster['totalRating'] = item.monster.totalRating
							singleMonster['values'] = {}
							singleMonster.values['Level'] = item.values.Level
							singleMonster.values['EXP'] = item.values.EXP
							singleMonster.values['Element'] = 'None'
							singleMonster.values['Energy'] = item.values.Energy
							singleMonster.values['Price'] = item.monster.price
							singleMonster['createdAt'] = item.createdAt
							singleMonster.values['UpdateTime'] = item.values.UpdateTime
							singleMonster.values['OwnerID'] = `${account.substring(0, 4)}...${account.slice(-4)}`
							monsters.push(singleMonster);
							// }
						})
					}
					setMonsters(monsters)
				})
				.catch((e) => {
					console.log("Error ----------------")
					console.log(e)
				})
		}
		getDearMonster()
	}, [updateMonsterAfterEnergyChange, updateMonsterAfterFight])

	// console.log('monsters::', monsters)

	const onSelect = (monster) => {
		handleonSelect(monster)
	}

	return (
		<div>
			<div className='center'>
				<p className='text-white mt-9 sm-fs-29 fs-21 whiteSpace-nowrap'>
					CHOOSE A DEARMONSTER
				</p>
			</div>
			<div className='mt-6'>
				<div className=''>
					<Splide
						className='container'
						options={{
							rewind: true,
							gap: '8rem',
							perPage: 3, // monsters.length == 1 ? 1 : 3,
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
								arrow: `splide__arrow text-white ${monsters.length == 1 ? 'd-none' : ''}`,
								prev: 'splide__arrow--prev your-class-prev border rounded-circle p-2 end-0',
								next: 'splide__arrow--next  border rounded-circle p-2 ',
							},
						}}
					>
						{monsters.map((post, i) => {
							return (
								<SplideSlide key={i}>
									<PostCard

										post={post}
										stepImg='/assets/imgs/droganBord.png'
										handleSelect={() => onSelect(post)}
										updateMonsterAfterEnergyChange={updateMonsterAfterEnergyChange}
										setUpdateMonsterAfterEnergyChange={setUpdateMonsterAfterEnergyChange}
									/>
								</SplideSlide>
							);
						})}
					</Splide>
				</div>
			</div>
		</div>
	);
}

export default ChooseDearMonster
