import React, { useState, useEffect } from 'react'
import "../../App.css";
import axios from 'axios'
import { getWheelHistory, getWheelHistoryByWallet } from '../../redux/wheelHistory/action';
import { WheelHistoryAPI } from '../../utilities/constant'
import { connect } from 'react-redux';
import { Spinner } from "react-bootstrap"

function WheelHistory(props) {
    const [walletAddress, setWalletAddress] = useState('')
    const [userAddress, setUserAddress] = useState('')
    const [data, setData] = useState([])
    const [limit] = useState(30);
    const [skip, setSkip] = useState(0);
    const [searchLimit] = useState(30);
    const [searchSkip, setSearchSkip] = useState(0);
    const [filteredData, setFilteredData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [spinCount, setSpinCount] = useState()
    const [spinCountByUser, setSpinCountByUser] = useState()
    const [allCategories, setAllCategories] = useState([])

    useEffect(() => {
        props.getWheelHistory(limit, skip)
    }, [skip, limit])

    useEffect(() => {
        axios
        .get(`${WheelHistoryAPI}/getAllCategories`)
        .then((res) => {
            setAllCategories(res.data.filteredCategories)
        })
        .catch((e) => {
            console.log("error: ", e);
        })
    }, [])

    useEffect(() => {
        if (walletAddress != '') {
            props.getWheelHistoryByWallet(walletAddress, searchLimit, searchSkip)
        }
    }, [searchSkip, searchLimit])

    useEffect(() => {
        if (walletAddress != '') {
            setFilteredData(props.wheelHistory.wheelHistory)
        } else {
            setFilteredData(null)
            setData(props.wheelHistory.wheelHistory)
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
    
    const onCategoryChange = (e) => {
        axios
        .get(`${WheelHistoryAPI}/${e.target.value}`)
        .then((res) => {
            setSpinCount(res.data.wheelHistory.length)
        })
        .catch((e) => {
            console.log("error: ", e);
        })
    }

    const onChangeWallet = (e) => {
        setUserAddress(e.target.value)
        axios
        .get(`${WheelHistoryAPI}/spinCountByUser/${e.target.value}`)
        .then((res) => {
            setSpinCountByUser(res.data.count)
        })
        .catch((e) => {
            console.log("error: ", e);
        })
    }

    const rewardGainByWallet = (e) => {
        setWalletAddress(e.target.value)
        if (e.target.value != '') {
            props.getWheelHistoryByWallet(e.target.value, limit, skip)
        } else {
            props.getWheelHistory(limit, skip)

        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Wheel History</h3>
                        <div className="row">
                            <div className={`col-md-5`}>
                            <label className="control-label">{`Total spin count per category`}</label>
                            <select name='spinCount' className='form-control  w-100px' onChange={onCategoryChange}>
                                <option value='Please select a category'>Select Category</option>
                                {allCategories.map(category => {
                                        return (
                                            <option value={category.name}>{category.name}</option>
                                        )
                                })}
                            </select>
                            </div>
                            <div className='col-md-1' style={{marginTop: '30px'}}>
                                <span>{spinCount}</span>
                            </div>
                            <div className="col-md-5">
                                <label className="control-label">{'Total spin count for user'}</label>
                                <input type="text" required="required" className="form-control" onChange={onChangeWallet}
                                    name={'userAddress'} value={userAddress}
                                    placeholder={`Enter Wallet Address`}
                                />
                            </div>
                            <div className='col-md-1' style={{marginTop: '30px'}}>
                                <span>{spinCountByUser}</span>
                            </div>

                            <div className="col-md-12" style={{marginTop: '30px'}}>
                                <label className="control-label">{'Reward gained for user'}</label>
                                <input type="text" required="required" className="form-control" onChange={rewardGainByWallet}
                                    name={'walletAddress'} value={walletAddress}
                                    placeholder={`Enter Wallet Address`}
                                />
                            </div>
                            {/* <div className='col-md-3' style={{marginTop: '30px'}}>
                                <span>{spinCountByUser}</span>
                            </div> */}

                        </div>
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Requester Address</th>
                                    <th>Action Type</th>
                                    <th>{filteredData && filteredData.length ? 'Reward gained' : 'Value'}</th>
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
                                                filteredData.length > 0 ? filteredData.map((data, index) => {
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
                        {filteredData && filteredData?.length == 0 ? (
                            ''
                        ) : (filteredData && filteredData.length) ?

                            <div className="row">
                                <div className='col-md-4'>
                                    {(searchSkip / searchLimit) + 1 != 1 &&
                                        <img
                                            src='/assets/imgs/ArrowLeft.png'
                                            style={{ cursor: 'pointer' }}
                                            onClick={previousSearchPage}
                                        />}
                                </div>
                                <div className='col-md-4'>
                                    <p className='col-md-2'>
                                        {(searchSkip / searchLimit) + 1}/{Math.ceil(props.wheelHistory.count / searchLimit)}
                                    </p>
                                </div>
                                <div className='col-md-4'>
                                    {(searchSkip / searchLimit) + 1 != Math.ceil(props.wheelHistory.count / searchLimit) &&
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
                                            {(skip / limit) + 1}/{Math.ceil(props.wheelHistory.count / limit)}
                                        </p>
                                    </div>
                                    <div className='col-md-4'>
                                        {(skip / limit) + 1 != Math.ceil(props.wheelHistory.count / limit) &&
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
    wheelHistory: state.WheelHistoryReducer
});

export default connect(mapStateToProps, { getWheelHistory, getWheelHistoryByWallet })(WheelHistory); 