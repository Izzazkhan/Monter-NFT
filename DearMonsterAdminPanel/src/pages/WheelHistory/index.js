
import React, {useState, useEffect} from 'react'
import "../../App.css";
import { getWheelHistory } from '../../redux/wheelHistory/action';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from "react-bootstrap"
import { usePagination } from '../../hooks/userPagination';

function WheelHistory(props) {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState(null)
	const [filterObject, setFilterObject] = useState({})
    const [state, setState] = useState({monsterType: '', rating: 1})
    const [spinCount, setSpinCount] = useState()

	const { pageData, currentPage, previousPage, nextPage, totalPages, doPagination } = usePagination(filteredData != null ? filteredData : data, 30)

    useEffect(() => {
        props.getWheelHistory()
    }, [])

    useEffect(() => {
        setLoading(true)
        setData(props.wheelHistory.wheelHistory)
        doPagination(props.wheelHistory.wheelHistory)
    }, [props])

    useEffect(() => {
        if(data.length) {
            setLoading(false)
        }
    }, [data])

    // useEffect(() => {
    //     setLoading(true)
		// if (Object.keys(filterObject).length > 0) {
		// 	let localFilterData = []
		// 	let filterApplied = false

		// 	if (filterObject.monsterType && filterObject.monsterType != '') {
		// 		let searchDataLocal
		// 		if (filterApplied) {
		// 			searchDataLocal = localFilterData.filter((element) => element.type == filterObject.monsterType)
		// 		} else {
		// 			searchDataLocal = data.filter((element) => element.type == filterObject.monsterType)
		// 			filterApplied = true
		// 		}
		// 		localFilterData = searchDataLocal
		// 	}

        //     if (filterObject.rating && filterObject.rating != '') {
		// 		let searchDataLocal
		// 		if (filterApplied) {
		// 			searchDataLocal = localFilterData.filter((element) => element.rating && element.rating == parseInt(star_mappings[filterObject.rating]))
		// 		} else {
		// 			searchDataLocal = data.filter((element) => element.rating && element.rating == parseInt(star_mappings[filterObject.rating]))
		// 			filterApplied = true
		// 		}
		// 		localFilterData = searchDataLocal
		// 	}

		// 	if (filterApplied) {
		// 		setFilteredData(localFilterData)
		// 		doPagination(localFilterData)
        //         setLoading(false)
		// 	}
		// } else {
		// 	if (data && data.length > 0) {
		// 		setFilteredData(data)
		// 		doPagination(data)
        //         setLoading(false)
		// 	}
		// }
	// }, [filterObject])

    // const onChangeValue = (e) => {
    //     setState({...state, monsterType: e.target.value})
    //     const monsterType = e.target.value
    //     if (monsterType != '') {
	// 		setFilterObject({ ...filterObject, monsterType })
	// 	} else {
	// 		let tempObj = { ...filterObject }
	// 		delete tempObj.monsterType

	// 		setFilterObject(tempObj)
	// 	}
    // }

    // const onChangerating = (e) => {
        // setState({...state, rating: star_mappings[e.target.value]})
        // const rating = e.target.value
        // if (rating != '') {
		// 	setFilterObject({ ...filterObject, rating })
		// } else {
		// 	let tempObj = { ...filterObject }
		// 	delete tempObj.rating

		// 	setFilterObject(tempObj)
		// }
    // }

    const formatDate = (date) => {
        const formatedData = new Date(date);

        let minutes = "";

        if (formatedData.getHours().toString().length === 1) {
            minutes = "0" + formatedData.getHours();
        } else {
            minutes = formatedData.getHours();
        }

        return (
            formatedData.getDate()
                .toString()
                .padStart(2, "0") +
            "-" +
            (formatedData.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            formatedData.getFullYear() +
            " " +
            minutes +
            ":" +
            ("00" + formatedData.getMinutes()).slice(-2)
        );
    };

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Fortune Wheel History</h3>
                        <div className="row">
                            {/* <div className={`col-md-6`}>
                            <label className="control-label">{`Monster Type`}</label>
                            <input type="text" required="required" className="form-control" onChange={onChangeValue}
                            name={'monsterType'} value={state.monsterType}
                            placeholder={`Enter Monster Type`}
                            />
                            </div> */}
                            <div className={`col-md-3`}>
                            <label className="control-label">{`Total spin count per category`}</label>
                            <select name='spinCount' className='form-control  w-100px' onChange={(e) => setSpinCount(e.target.value)}>
                                        <option value='Please select a category'>Select Category</option>
                                        {props.wheelHistory.wheelHistory.filter((a, i) => 
                                            props.wheelHistory.wheelHistory.findIndex((s) => a.name === s.name) === i).map(category => {
                                                return (
                                                    <option value={data.filter(item => item.name === category.name).length}>{category.name}</option>
                                                )
                                        })}
									</select>
                            </div>
                            <div className='col-md-3' style={{marginTop: '30px'}}>
                                <span>{spinCount}</span>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className={`col-md-6`}>
                            <label className="control-label">{`Monster Type`}</label>
                            <input type="text" required="required" className="form-control" onChange={onChangeValue}
                            name={'monsterType'} value={state.monsterType}
                            placeholder={`Enter Monster Type`}
                            />
                            </div>
                            <div className={`col-md-6`}>
                            <label className="control-label">{`Star Rating`}</label>
                            <select name='rating' className='form-control  w-100px' onChange={onChangerating}>
										<option>Star 1</option>
										<option>Star 2</option>
										<option>Star 3</option>
										<option>Star 4</option>
										<option>Star 5</option>
									</select>
                            </div>
                        </div> */}
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Requester Address</th>
                                    <th>Action Type</th>
                                    <th>Value</th>
                                    <th>Created At</th>
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
                                                        {/* <td>{`${data.actionType}`}</td>
                                                        <td>{data.value}</td>
                                                        <td>{(data.probability)}</td> */}
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
                                                        <td>{`${data.requesterAddress}`}</td>
                                                        <td>{`${data.actionType}`}</td>
                                                        <td>{data.value}</td>
                                                        <td>{(formatDate(data.createdAt))}</td>
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
    wheelHistory: state.WheelHistoryReducer
});

export default connect(mapStateToProps, { getWheelHistory })(WheelHistory); 