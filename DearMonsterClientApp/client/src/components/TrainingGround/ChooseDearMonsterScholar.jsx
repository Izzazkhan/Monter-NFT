import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import data from "../../data/Post.json";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';
import { apiUrl } from '../../utils/constant'
import axios from 'axios'
import { useSelector } from 'react-redux';
import Loading from '../common/Loading';

const ChooseDearMonster = ({ handleonSelect, selectedMonster, updateMonsterAfterFight, userId }) => {

	const [monsters, setMonsters] = useState([])
	const [loading, setLoading] = useState(true)
	const [updateMonsterAfterEnergyChange, setUpdateMonsterAfterEnergyChange] = useState(false)

	useEffect(() => {
		function getDearMonster() {
			let monsters = []
			axios.get(`${apiUrl}/api/scholarship/scholarItems/` + userId)
				.then((res) => {
					if (res.data.mintedMonster && res.data.mintedMonster.length > 0) {
						res.data.mintedMonster.forEach(item => {
							let singleMonster = {}
							let level
							if (Number(item.values.EXP) < 450) {
								level = '1'
							}
							if (Number(item.values.EXP) >= 450 && Number(item.values.EXP) < 1200) {
								level = '2'
							}
							else if (Number(item.values.EXP) >= 1200 && Number(item.values.EXP) < 3000) {
								level = '3'
							}
							else if (Number(item.values.EXP) >= 3000 && Number(item.values.EXP) < 8000) {
								level = '4'
							}
							else if (Number(item.values.EXP) >= 8000 && Number(item.values.EXP) < 15000) {
								level = '5'
							}
							else if (Number(item.values.EXP) >= 15000) {
								level = '6'
							}

							if(item.scholarshipsItems.assigned) {
								singleMonster['mintedId'] = item._id
								singleMonster['owner'] = item.owner
								singleMonster['monsterId'] = item.monster._id
								singleMonster['id'] = item.tokenId
								singleMonster['title'] = item.monster.title
								singleMonster['img'] = item.monster.img
								singleMonster['rating'] = item.rating
								singleMonster['totalRating'] = item.monster.totalRating
								singleMonster['values'] = {}
								singleMonster['scholarshipsItems'] = item.scholarshipsItems
								singleMonster.values['Level'] = level
								singleMonster.values['EXP'] = item.values.EXP
								singleMonster.values['Element'] = 'None'
								singleMonster.values['Energy'] = item.values.Energy
								singleMonster.values['Price'] = item.monster.price
								singleMonster['createdAt'] = item.createdAt
								singleMonster.values['UpdateTime'] = item.values.UpdateTime
								singleMonster.values['Owner_Share'] = item.scholarshipsItems.profitShare.Manager_Share
								singleMonster.values['OwnerID'] = `${userId.substring(0, 4)}...${userId.slice(-4)}`
								monsters.push(singleMonster);
							}

						})
					}
					setMonsters(monsters)
					setLoading(false)
				})
				.catch((e) => {
					console.log("Error ----------------")
					console.log(e)
					setLoading(false)
				})
		}
		getDearMonster()
	}, [updateMonsterAfterEnergyChange, updateMonsterAfterFight, userId])

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
				{loading ? <div className='center mt-6'><Loading /></div> :
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
										prev: 'splide__arrow--prev your-class-prev border rounded-circle p-2',
										next: 'splide__arrow--next  border rounded-circle p-2 ',
									},
								}}
							>
								{monsters.map((post, i) => {
									return (
										<SplideSlide key={i}>
											<PostCard
												selectedMonster={selectedMonster}
												post={post}
												stepImg='/assets/imgs/droganBord.png'
												handleSelect={() => onSelect(post)}
												updateMonsterAfterEnergyChange={updateMonsterAfterEnergyChange}
												setUpdateMonsterAfterEnergyChange={setUpdateMonsterAfterEnergyChange}
												type={'scholarMonster'}
											/>
										</SplideSlide>
									);
								})}
							</Splide>
						</div>
					</div>
				}
			</div>
	);
}

export default ChooseDearMonster