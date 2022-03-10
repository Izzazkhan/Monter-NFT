
import React, {useState, useEffect} from 'react'
import "../../App.css";
import { getWithdrawRequest } from '../../redux/fightHistory/action';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from "react-bootstrap"
import { usePagination } from '../../hooks/userPagination';


const star_mappings = {
    'Star 1': 1,
    'Star 2': 2,
    'Star 3': 3,
    'Star 4': 4,
    'Star 5': 5
}

function WithdrawRequest(props) {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [winRate, setWinRate] = useState(0)
    const [filteredData, setFilteredData] = useState(null)
	const [filterObject, setFilterObject] = useState({})
    const [state, setState] = useState({monsterType: '', rating: 1})

	const { pageData, currentPage, previousPage, nextPage, totalPages, doPagination } = usePagination(filteredData != null ? filteredData : data, 30)

    useEffect(() => {
        props.getWithdrawRequest()
    }, [])

    useEffect(() => {
        setLoading(true)
        const lastFights = props.fightHistory.fightHistory.slice(0, 500) // last 500 fights
        const filtered = lastFights.length && lastFights.filter(item => item.fightStatus === 'win')
        const calculatedWinRate = (filtered.length / lastFights.length) * 100
        setWinRate(calculatedWinRate)
        setData(props.fightHistory.fightHistory)
        doPagination(props.fightHistory.fightHistory)
    }, [props])

    useEffect(() => {
        if(data.length) {
            setLoading(false)
        }
    }, [data])

    useEffect(() => {
        setLoading(true)
		if (Object.keys(filterObject).length > 0) {
			let localFilterData = []
			let filterApplied = false

			if (filterObject.monsterType && filterObject.monsterType != '') {
				let searchDataLocal
				if (filterApplied) {
					searchDataLocal = localFilterData.filter((element) => element.type == filterObject.monsterType)
				} else {
					searchDataLocal = data.filter((element) => element.type == filterObject.monsterType)
					filterApplied = true
				}
				localFilterData = searchDataLocal
			}

            if (filterObject.rating && filterObject.rating != '') {
				let searchDataLocal
				if (filterApplied) {
					searchDataLocal = localFilterData.filter((element) => element.rating && element.rating == parseInt(star_mappings[filterObject.rating]))
				} else {
					searchDataLocal = data.filter((element) => element.rating && element.rating == parseInt(star_mappings[filterObject.rating]))
					filterApplied = true
				}
				localFilterData = searchDataLocal
			}

			if (filterApplied) {
				setFilteredData(localFilterData)
				doPagination(localFilterData)
                setLoading(false)
			}
		} else {
			if (data && data.length > 0) {
				setFilteredData(data)
				doPagination(data)
                setLoading(false)
			}
		}
	}, [filterObject])

    const onChangeValue = (e) => {
        setState({...state, monsterType: e.target.value})
        const monsterType = e.target.value
        if (monsterType != '') {
			setFilterObject({ ...filterObject, monsterType })
		} else {
			let tempObj = { ...filterObject }
			delete tempObj.monsterType

			setFilterObject(tempObj)
		}
    }

    const onChangerating = (e) => {
        setState({...state, rating: star_mappings[e.target.value]})
        const rating = e.target.value
        if (rating != '') {
			setFilterObject({ ...filterObject, rating })
		} else {
			let tempObj = { ...filterObject }
			delete tempObj.rating

			setFilterObject(tempObj)
		}
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Fight History</h3>
                        <div className="row">
                            <div className={`col-md-6`}>
                            <label className="control-label">{`Monster Type`}</label>
                            <input type="text" required="required" className="form-control" onChange={onChangeValue}
                            name={'monsterType'} value={state.monsterType}
                            placeholder={`Enter Monster Type`}
                            />
                            </div>
                            <div className={`col-md-6`}>
                            <label className="control-label">{`Star Rating`}</label>
                            {/* <input type="text" required="required" className="form-control" onChange={onChangeValue}
                            name={'rating'} value={state.rating}
                            placeholder={`Enter Star Rating`}
                            /> */}
                            <select name='rating' className='form-control  w-100px' onChange={onChangerating}>
										<option>Star 1</option>
										<option>Star 2</option>
										<option>Star 3</option>
										<option>Star 4</option>
										<option>Star 5</option>
									</select>
                            </div>
                        </div>
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Monster</th>
                                    <th>Minion</th>
                                    <th>Type</th>
                                    <th>Fight Status</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {loading ? <Spinner animation="border" /> :
                                filteredData ?
                                <>
										{filteredData?.length === 0 ? (
											<div className='text-center'>
												<h3>{'No Data'}</h3>
											</div>
										) : (
											pageData.length > 0 ? pageData.map((data, index) => {
												return (
													<tr key={(index + 1)}>
                                                        <td>{`${data.monster.title}`}</td>
                                                        <td>{data.minion.title}</td>
                                                        <td>{(data.type)}</td>
                                                        <td>{(data.fightStatus)}</td>
                                                    </tr>
												);
											}) : ""
										)}
									</> : 
                                    <>
                                    {data?.length === 0 ? (
											<div className='text-center'>
												<h3>{'No Data'}</h3>
											</div>
										) : (
											pageData.length > 0 ? pageData.map((data, index) => {
												return (
													<tr key={(index + 1)}>
                                                        <td>{`${data.monster.title}`}</td>
                                                        <td>{data.minion.title}</td>
                                                        <td>{(data.type)}</td>
                                                        <td>{(data.fightStatus)}</td>
                                                    </tr>
												);
											}) : ""
										)}
                                    </>
                                
                                }

                            </tbody>
                        </table>
                        {pageData?.length == 0 ? (
							''
						) : (
                            <div className="row">
                                <div className='col-md-4'>
                                <img
									src='/assets/imgs/ArrowLeft.png'
                                    style={{cursor: 'pointer'}}
									onClick={previousPage}
								/>
                                </div>
                                <div className='col-md-4'>
                                <p className='col-md-2'>
									{currentPage}/{totalPages}
								</p>
                                </div>
                                <div className='col-md-4'>
                                <img src='/assets/imgs/ArrowRight.png' 
                                    style={{cursor: 'pointer'}}
                                    className='col-md-4' onClick={nextPage} />
                                </div>
                                
                                </div>
							
						)}
                    </div>
                </div>
            </div>


        
        </>
    )
}

const mapStateToProps = state => ({
    fightHistory: state.FightHistoryReducer
});

export default connect(mapStateToProps, { getWithdrawRequest })(WithdrawRequest); 