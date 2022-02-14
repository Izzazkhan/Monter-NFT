import React from 'react';

const MinionCard = ({ className, post, stepImg, handleFight }) => {
	return (
		<div className={`${className}`}>
			<main className='center flex-column'>
				<div>
					<img src={post.img} className='w-md h-lg' />
				</div>
				<div
					className='findDearMonster pt-4 pb-5 '
					style={{ marginTop: '-50px', width: '300px' }}
				>
					<p className='text-center mt-4 fs-18 bold'>{post.title}</p>
					<div className='text-white center flex-column mt-8 fs-15'>

						<div className='mb-5'>
							<span className='me-2'>Win Rate Display:</span>
							{ post.values['Win_Rate_Display'] }
						</div>
						<div className='mb-5'>
							<span className='me-2'>EXP Gain (Win):</span>
							{ post.values['Exp_Gain'] }
						</div>
						<div className='mb-5'>
							<span className='me-2'>EXP Gain (Loss):</span>
							{ post.values['Lose_Exp_Gain'] }
						</div>


						{
							// Object.keys(post.values).map((key, index) => {
							// 	const key2 = key.split('_').join(' ');
							// 	if (key != 'Reward_Estimated') {
							// 		return (
										// <div className='mb-5' key={index}>
										// 	{
										// 		key2 == 'Exp Gain' ?
										// 			<>

										// 				<span className='me-2'>EXP Gain (Win):</span>
										// 				{post.values[key]}

										// 			</>

										// 			:
										// 			''
										// 	}
										// 	{
										// 		key2 == 'Lose Exp Gain' ?
										// 			<>
										// 				<span className='me-2'>EXP Gain (Loss) :</span>
										// 				{post.values[key]}

										// 			</>
										// 			:
										// 			''
										// 	}
										// 	{
										// 		key2 == 'Win Rate Display' ?
										// 			<>
										// 				<span className='me-2'>Win Rate Display:</span>
										// 				{post.values[key]}

										// 			</>
										// 			:
										// 			''
										// 	}
										// </div>
							// 		)
							// 	}
							// })
						}
						{
							post.rewardEstimated &&
							<div className='mb-5'>
								<span className='me-2'>{'Rewards'} :</span>
								<span>{post.rewardEstimated}</span>
							</div>
						}

					</div>
				</div>
			</main>
			<footer className='center mt-5 '>
				<div
					className='header-Connect-btn h-40px center w-100px px-2 bold cursor'
					data-bs-toggle='modal'
					data-bs-target='#exampleModal'
					onClick={() => {
						handleFight()
					}}
				>
					Fight
				</div>
			</footer>
		</div>
	);
};

export default MinionCard;
