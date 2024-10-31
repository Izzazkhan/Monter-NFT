import React, { useState } from 'react'

const FindMonster = ({
	sortData,
	searchData,
	clearSearchData,
	clearFilterData,
	filterDataByStar
}) => {
	const [rating, setRating] = useState([]);
	const [levels, setLevels] = useState([]);
	const [isSearch, setIsSearch] = useState(false);
	const [isFilter, setIsFilter] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const addRating = (e) => {
		let localRating = Number(e.target.value) + 1
		localRating = localRating.toString()
		setRating(rating.concat(localRating));
	};
	const removeRating = (e) => {
		let localRating = Number(e.target.value) + 1
		localRating = localRating.toString()
		const newRating = rating.filter((rating) => rating !== localRating);
		setRating(newRating);
	};

	// const addLevels = (e) => {
	// 	setLevels(levels.concat(e.target.value));
	// };

	// const removeLevels = (e) => {
	// 	const newLevels = levels.filter((level) => level !== e.target.value);
	// 	setLevels(newLevels);
	// };


	const handleFiltering = (e) => {
		e.preventDefault()
		filterDataByStar(rating)
		setIsFilter(true);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setSearchValue(e.target.value);
		searchData(e.target.value);
		if (e.target.value) {
			setIsSearch(true);
		} else {
			setIsSearch(false);
		}
	};

	const clearFilter = () => {
		const updatedArray = starData.map(element => ({ ...element, checked: false }))
		setStarData(updatedArray)
		clearFilterData()
	}

	const [starData, setStarData] = useState([{ id: 0, checked: false }, { id: 1, checked: false }, { id: 2, checked: false },
	{ id: 3, checked: false }, { id: 4, checked: false }])

	const handleCheckbox = (e) => {
		if (e.target.checked) {
			addRating(e);
		} else {
			removeRating(e);
		}

		const updatedArray = starData.map(item => {
			if (item.id === Number(e.target.value)) {
				item.checked = !item.checked;
			}
			return item
		})
		setStarData(updatedArray)
	}

	return (
		<div className='findDearMonster py-6'>
			<div className='px-5'>
				<div className='mt-8 center fw-bold fw-24 bold'>Find Your DearMonster</div>
			</div>
			<section className='center flex-column mt-9'>
				<div className='mb-3 w-75 position-relative'>
					<input
						type='text'
						className='form-control'
						id='exampleFormControlInput1'
						placeholder='Search by ID'
						value={searchValue}
						onChange={handleSearch}
					/>
					<div className='translate-right-middle end-5 mt-1'>
						{isSearch ? (
							<i
								className='fas fa-times'
								onClick={() => {
									clearSearchData();
									setIsSearch(false);
									setSearchValue('');
								}}
							></i>
						) : (
							<i className='fas fa-search'></i>
						)}
					</div>
				</div>
				<div></div>
				<select
					className='form-select w-75 mt-1'
					onChange={(e) => {
						sortData(e.target.value);
					}}
				>
					<option selected value='all'>
						Sort by All
					</option>
					<option value='asc'>Top Price</option>
					<option value='desc'>Lowest Price</option>
				</select>
			</section>
			<div className='ps-8 mt-6'>
				<p className='text-white mb-5'>Star Rating</p>
				{
					starData.map((star, i) => {
						return (
							<div className='mb-4'>
								<div className='form-check'>
									<input
										className='form-check-input p-2'
										type='checkbox'
										value={star.id}
										onChange={handleCheckbox}
										checked={star.checked}
										id={star.id}
									/>
									<label className='form-check-label ms-3' for={i}>
										{[...Array(i + 1).keys()].map((star, i) => {
											return <img src='/assets/imgs/star.png' alt='' className='me-2' />;
										})}
									</label>
								</div>
							</div>
						);
					})
				}
			</div >
			{/* <section className='ps-8 mt-6 text-white'>
				<p>Level</p>

				<div className='row w-85 mt-5'>
					{[...Array(3).keys()].map((star, i) => {
						return (
							<div className='col-4 mb-3'>
								<div className='form-check'>
									<input
										className='form-check-input p-2'
										type='checkbox'
										value={i + 1}
										onChange={(e) => {
											if (e.target.checked) {
												addLevels(e);
											} else {
												removeLevels(e);
											}
										}}
										id={i}
									/>
									<label className='form-check-label ms-2' for={i}>
										{i + 1}
									</label>
								</div>
							</div>
						);
					})}
				</div>
			</section> */}

			< footer className='mt-6' >
				<div
					className='filterCheckBtn  w-140px mx-auto py-3 center bold cursor'
					onClick={handleFiltering}
				>
					Filter
				</div>
				{
					isFilter && (
						<button
							className='btn center mx-auto mt-5 btn-outline-secondary'
							onClick={() => {
								setRating([])
								setIsFilter(false)
								clearFilter()
							}}
						>
							Clear Filter
						</button>
					)
				}
			</footer >
		</div >
	);
};




export default FindMonster
