
import React, {useState, useEffect} from 'react'
import "../../App.css";
import { getWithdrawRequest, getFigthHistoryBySearch } from '../../redux/fightHistory/action';

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
    const [data, setData] = useState([])
    const [limit] = useState(30);
    const [skip, setSkip] = useState(0);
    const [searchLimit] = useState(30);
    const [searchSkip, setSearchSkip] = useState(0);
    const [filteredData, setFilteredData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [state, setState] = useState({monsterType: '', rating: 1})

    useEffect(() => {
        props.getWithdrawRequest(limit, skip)
    }, [skip, limit])

    useEffect(() => {
        if (searchSkip != 0) {
            props.getFigthHistoryBySearch(state.monsterType, searchLimit, searchSkip)
        }
    }, [searchSkip, searchLimit])

    useEffect(() => {
        if (state.monsterType != '') {
            setFilteredData(props.fightHistory.fightHistory)
        } else {
            setFilteredData(null)
            setData(props.fightHistory.fightHistory)
        }

    }, [props, searchSkip, searchLimit])

    useEffect(() => {
        if (data.length) {
            setLoading(false)
        }
    }, [data])

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

    const onChangeValue = (e) => {
        setState({...state, monsterType: e.target.value})
        if(e.target.value != '') {
            props.getFigthHistoryBySearch(e.target.value, searchLimit, searchSkip)
        } else {
            props.getWithdrawRequest(limit, skip)
        }
    }

    // const onChangerating = (e) => {
    //     setState({...state, rating: star_mappings[e.target.value]})
    //     const rating = e.target.value
    //     if (rating != '') {
	// 		setFilterObject({ ...filterObject, rating })
	// 	} else {
	// 		let tempObj = { ...filterObject }
	// 		delete tempObj.rating

	// 		setFilterObject(tempObj)
	// 	}
    // }

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
                            {/* <div className={`col-md-6`}>
                            <label className="control-label">{`Star Rating`}</label>
                            <select name='rating' className='form-control  w-100px' onChange={onChangerating}>
										<option>Star 1</option>
										<option>Star 2</option>
										<option>Star 3</option>
										<option>Star 4</option>
										<option>Star 5</option>
									</select>
                            </div> */}
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

                                { loading ? <Spinner animation="border" /> :
                                    filteredData ?
                                        <>
                                            {filteredData?.length === 0 ? (
                                                <div className='text-center'>
                                                    <h3>{'No Data'}</h3>
                                                </div>
                                            ) : (
                                                filteredData.length > 0 ? filteredData.map((data, index) => {
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
                                        :
                                        <>
                                            {data?.length === 0 ? (
                                                <div className='text-center'>
                                                    <h3>{'No Data'}</h3>
                                                </div>
                                            ) : (
                                                data.length > 0 ? data.map((data, index) => {
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
                        {filteredData && filteredData?.length == 0 ? (
                            ''
                        ) : (filteredData && filteredData.length) ?

                            <div className="row">
                                <div className='col-md-4'>
                                    {(searchSkip / limit) + 1 != 1 &&
                                        <img
                                            src='/assets/imgs/ArrowLeft.png'
                                            style={{ cursor: 'pointer' }}
                                            onClick={previousSearchPage}
                                        />}
                                </div>
                                <div className='col-md-4'>
                                    <p className='col-md-2'>
                                        {(searchSkip / limit) + 1}/{Math.ceil(props.fightHistory.count / limit)}
                                    </p>
                                </div>
                                <div className='col-md-4'>
                                    {(searchSkip / limit) + 1 != Math.ceil(props.fightHistory.count / limit) &&
                                        <img src='/assets/imgs/ArrowRight.png'
                                            style={{ cursor: 'pointer' }}
                                            className='col-md-4' onClick={nextSearchPage} />
                                    }

                                </div>

                            </div> : data?.length == 0 ? '' : (
                                <div className="row">
                                    <div className='col-md-4'>
                                        {(skip / limit) + 1 != 1 &&
                                            <img
                                                src='/assets/imgs/ArrowLeft.png'
                                                style={{ cursor: 'pointer' }}
                                                onClick={previousPage}
                                            />}
                                    </div>
                                    <div className='col-md-4'>
                                        <p className='col-md-2'>
                                            {(skip / limit) + 1}/{Math.ceil(props.fightHistory.count / limit)}
                                        </p>
                                    </div>
                                    <div className='col-md-4'>
                                        {(skip / limit) + 1 != Math.ceil(props.fightHistory.count / limit) &&
                                            <img src='/assets/imgs/ArrowRight.png'
                                                style={{ cursor: 'pointer' }}
                                                className='col-md-4' onClick={nextPage} />
                                        }

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

export default connect(mapStateToProps, { getWithdrawRequest, getFigthHistoryBySearch })(WithdrawRequest); 