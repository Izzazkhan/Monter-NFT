import React, { useState, useEffect } from 'react';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector, useDispatch } from 'react-redux';
import { apiUrl } from '../../utils/constant'
import Swal from 'sweetalert2';
import axios from 'axios'
import { Wheel } from 'react-custom-roulette'
import NavLinks from '../../components/fortuneWheel/NavLinks';
import Loading from '../../components/common/Loading';

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
    }
}
const match = { params: { slug: 'owned' } }

const FortuneWheel = (props) => {
    const { userId } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const [owner, setOwner] = useState(userId ? userId : null)
    const [slots, setSlots] = useState([])

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [spinCost, setSpinCost] = useState(0)
    const [buyAs, setBuyAs] = useState('owner')
    const [updatedSpinData, setUpdatedSpinData] = useState([])
    const [spinRecord, setSpinRecord] = useState([])
    const [allShards, setAllShards] = useState([])
    const [spinEnable, setsSpinEnable] = useState(true)
    const [spinCostData, setSpinCostData] = useState([])

    useEffect(() => {
        if (userId) {
            axios.get(`${apiUrl}/api/spinRecord/${userId}`)
                .then((res) => {
                    if (res.data.spinRecord) {
                        setUpdatedSpinData(res.data.spinRecord)
                    }
                })
                .catch((e) => {
                    console.log(e)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Oops, Something went wrong'
                    })
                })
        }
    }, [userId, spinRecord])

    useEffect(() => {
        if (userId) {
            axios.get(`${apiUrl}/api/fortuneWheel`)
                .then((res) => {
                    if (res.data.fortuneWheel.length) {
                        const slotsMapped = res.data.fortuneWheel[0].slots.map(item => {
                            return {
                                ...item,
                                probability: item.probability * 1000000
                            }
                        }).sort((a, b) => b.probability - a.probability)
                        setSlots(slotsMapped)
                    }
                })
                .catch((e) => {
                    console.log(e)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Oops, Something went wrong'
                    })
                })
            axios
                .get(`${apiUrl}/api/shards`)
                .then((res) => {
                    if (res.data.shards.length) {
                        setAllShards(res.data.shards)
                    }
                })
                .catch((e) => {
                    console.log(e)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Oops, Something went wrong'
                    })
                })
            axios
            .get(`${apiUrl}/api/spinCost`)
            .then((res) => {
                if (res.data.spinCost.length) {
                    setSpinCostData(res.data.spinCost)
                    setSpinCost(res.data.spinCost[0].spin_1_cost)
                }
            })
            .catch((e) => {
                console.log(e)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Oops, Something went wrong'
                })
            })
        }
    }, [userId])

    const wheelLogCall = (data, shardType) => {
        if (data && Object.keys(data).length > 0) {
            const updateParams = new URLSearchParams()
            updateParams.append('actionType', data.actionType)
            updateParams.append('value', data.value)
            updateParams.append('probability', data.prob)
            updateParams.append('requesterAddress', userId)
            if (shardType != undefined) {
                updateParams.append('shardType', shardType)
            }
            axios.post(`${apiUrl}/api/wheelHistory`, updateParams, config)
                .then((response) => {
                    console.log('wheel log', response)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const spinUpdateCall = (newValue) => {
        const filterValue = newValue ? Number(newValue.value) - 1 : undefined
        const spinRecordParams = new URLSearchParams()
        spinRecordParams.append('userId', userId)
        spinRecordParams.append('type', buyAs)
        console.log('updatedSpinData', updatedSpinData)
        if (updatedSpinData.length) {
            const noOfspin = updatedSpinData.find(item => item.userId == userId && item.type == buyAs)
            console.log('noOfspin:::', noOfspin)

            if (noOfspin) {

                if (filterValue != undefined) {
                    spinRecordParams.append('no_of_spin', noOfspin.no_of_spin + Number(filterValue))
                } else {
                    spinRecordParams.append('no_of_spin', spinCost == spinCostData[0].spin_1_cost ? noOfspin.no_of_spin + 1 : noOfspin.no_of_spin + 5)
                }
                console.log('spinCost::', spinCost)
                axios.put(`${apiUrl}/api/spinRecord/${userId}/${buyAs}`, spinRecordParams, config)
                    .then((response) => {
                        setSpinRecord(response.data.spinRecord)
                        Swal.fire({
                            icon: 'success',
                            title: 'Spin Record',
                            text: `Spin record has been updated`
                        })
                        if (filterValue) {
                            wheelLogCall(newValue)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Oops, Something went wrong'
                        })
                    })
            } else {
                if (filterValue != undefined) {
                    spinRecordParams.append('no_of_spin', Number(filterValue))
                } else {
                    spinRecordParams.append('no_of_spin', spinCost == spinCostData[0].spin_1_cost ? 1 : 5)
                }
                console.log('spinCost::', spinCost)
                axios.post(`${apiUrl}/api/spinRecord`, spinRecordParams, config)
                    .then((response) => {
                        setSpinRecord(response.data.spinRecord)
                        Swal.fire({
                            icon: 'success',
                            title: 'Spin Record',
                            text: `Spin record has been updated`
                        })
                        if (filterValue) {
                            wheelLogCall(newValue)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Oops, Something went wrong'
                        })
                    })
            }

        } else {
            if (filterValue != undefined) {
                spinRecordParams.append('no_of_spin', filterValue)
            } else {
                spinRecordParams.append('no_of_spin', spinCost == spinCostData[0].spin_1_cost ? 1 : 5)
            }
            axios.post(`${apiUrl}/api/spinRecord`, spinRecordParams, config)
                .then((response) => {
                    setSpinRecord(response.data.spinRecord)
                    wheelLogCall(newValue)
                })
                .catch((error) => {
                    console.log(error)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Oops, Something went wrong'
                    })
                })
        }
    }

    const rewardUpdateCall = (DMSSlot) => {
        axios.get(`${apiUrl}/api/userEarning/${userId}/${buyAs}`)
            .then((response) => {
                const updateParams = new URLSearchParams()
                updateParams.append('earnerAddress', userId)
                if (response?.data?.earnerData) {
                    if (DMSSlot && DMSSlot.value != undefined) {
                        updateParams.append('totalAmount', response.data.earnerData.totalAmount + Number(DMSSlot.value))
                        axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                            .then((response) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Reward Earned',
                                    text: `Congratutions! You have won ${DMSSlot.value} DMS!`
                                })
                                if (DMSSlot) {
                                    wheelLogCall(DMSSlot)
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Oops, Something went wrong'
                                })
                            })
                    } else if (response.data.earnerData.totalAmount - Number(spinCost) > 0) {
                        updateParams.append('totalAmount', response.data.earnerData.totalAmount - Number(spinCost))
                        axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                            .then((response) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Reward Deduction',
                                    text: `${spinCost} DMS deducted from the ${buyAs} wallet`
                                })
                                if (DMSSlot) {
                                    wheelLogCall(DMSSlot)
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Oops, Something went wrong'
                                })
                            })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: `Rewards cannot be deducted from the ${buyAs} wallet`
                        })
                    }
                } else {
                    if (DMSSlot && DMSSlot.value != undefined) {
                        updateParams.append('totalAmount', Number(DMSSlot.value))
                        axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                            .then((response) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Reward Earned',
                                    text: `Congratutions! You have won ${DMSSlot.value} DMS!`
                                })


                                wheelLogCall(DMSSlot)
                            })
                            .catch((error) => {
                                console.log(error)
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Oops, Something went wrong'
                                })
                            })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: `Rewards cannot be deducted from the ${buyAs} wallet`
                        })
                    }
                }
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Oops, Something went wrong'
                })
            })
    }

    const countUpdateCal = (filterValue) => {
        axios.get(`${apiUrl}/api/userShard/${userId}/owner`)
            .then((response) => {
                const filterShard = allShards.find(item => item.shardTypeId === filterValue.shardType)
                let params = new URLSearchParams()
                params.append('userId', userId)
                params.append('shardId', filterShard._id)
                const shardId = response.data.userShards.find(item => item.shardId === filterShard._id)

                if (response?.data?.userShards && shardId && shardId.shardId == filterShard._id) {
                    params.append('count', shardId.count + Number(filterValue.value))
                    axios.put(`${apiUrl}/api/userShard/${userId}/owner/${shardId._id}`, params, config)
                        .then((res) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Congratulations',
                                text: `You have won ${Number(filterValue.value)} new shards.`
                            })
                            wheelLogCall(filterValue, filterShard._id)
                        })
                        .catch((e) => {
                            console.log(e)
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Oops, Something went wrong'
                            })
                        })
                } else {
                    params.append('count', Number(filterValue.value))
                    params.append('type', 'owner')
                    axios.post(`${apiUrl}/api/userShard`, params, config)
                        .then((res) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'User Shard',
                                text: `User shard has been updated with count ${res.data.userShard.count}`
                            })
                            wheelLogCall(filterValue, filterShard._id)
                        })
                        .catch((e) => {
                            console.log(e)
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Oops, Something went wrong'
                            })
                        })
                }
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Oops, Something went wrong'
                })
            })
    }

    const BUSDRequestCall = async (filterValue) => {
        try {
            const getBUSDRequest = await axios.get(`${apiUrl}/api/BUSDRequest/${userId}/owner`)
            if (getBUSDRequest?.data?.BUSDRequest_?.length > 0) {
                const filteredRequest = getBUSDRequest.data.BUSDRequest_.find(item => item.type === 'owner')
                try {
                    if (filteredRequest) {
                        const params = new URLSearchParams()
                        params.append('amount', filteredRequest.amount + Number(filterValue.value))
                        const postRequest = await axios.put(`${apiUrl}/api/BUSDRequest/${userId}/owner/${filteredRequest._id}`, params, config)
                        if (postRequest) {
                            Swal.fire({
                                icon: 'success',
                                title: 'BUSD Requested',
                                text: `BUSD request has been updated with amount ${filterValue.value}`
                            })
                            wheelLogCall(filterValue)
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'BUSD Request',
                            text: 'Oops, Something went wrong, Please contact admin'
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Oops, Something went wrong, Please contact admin'
                    })
                }
            } else {
                try {
                    if (Number(filterValue.value) > 0) {
                        const params = new URLSearchParams()
                        params.append('requesterAddress', userId)
                        params.append('amount', Number(filterValue.value))
                        const postRequest = await axios.post(`${apiUrl}/api/BUSDRequest/owner`, params, config)
                        if (postRequest) {
                            Swal.fire({
                                icon: 'success',
                                title: 'BUSD Requested',
                                text: `BUSD request has been created with amount ${filterValue.value}`
                            })
                            wheelLogCall(filterValue)
                        }
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'BUSD request',
                        text: 'BUSD request failed, please try again'
                    })
                }
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Oops, Something went wrong'
            })
        }
    }

    const handleSpinClick = () => {
        setsSpinEnable(false)
        setTimeout(() => {
            handleSpinClick1()
        }, 1);
    }
    const handleSpinClick1 = () => {
        let tempSpinCount = updatedSpinData.length ? (updatedSpinData.find(item => item.type === 'owner' && item.userId == userId) ?
            updatedSpinData.find(item => item.type === 'owner' && item.userId == userId).no_of_spin : 0) : 0

        // if (true) {
        if (Number(tempSpinCount) > 0) {
            let trackerArray = []
            let indexArray = []
            slots.forEach((item, index) => {
                trackerArray.push({
                    name: item.option, number: index + 1, value: item.value,
                    shardType: item.shardType, actionType: item.actionType, prob: item.probability, _id: item._id
                })
                for (let i = 1; i <= item.probability; i++) {
                    indexArray.push(index + 1)
                }
            })
            // console.log('indexArray', indexArray)
            var random = Math.floor(Math.random() * 100000000)   // 0 to 99999999

            let myValue = indexArray[random]   // 0 to 99999
            // console.log('myValue', myValue)
            // console.log('trackerArray', trackerArray)
            let filterVal = trackerArray.find(item => item.number == myValue)
            // let filterVal = trackerArray[5]
            // console.log('filterVal', filterVal)
            if (filterVal.actionType === 'Free Spin') {
                setTimeout(() => {
                    spinUpdateCall(filterVal)
                    setsSpinEnable(true)
                }, 11000);
            } else if (filterVal.actionType === 'DMS') {
                setTimeout(() => {
                    rewardUpdateCall(filterVal)
                    setsSpinEnable(true)
                }, 11000);
            } else if (filterVal.shardType != null) {
                setTimeout(() => {
                    countUpdateCal(filterVal)
                    setsSpinEnable(true)
                }, 11000);
            } else if (filterVal.actionType === 'BUSD') {
                setTimeout(() => {
                    BUSDRequestCall(filterVal)
                    setsSpinEnable(true)
                }, 11000);
            }

            let index = slots.findIndex(item => item.option === filterVal.name)
            setPrizeNumber(index)
            setMustSpin(true)

            if (filterVal.actionType !== 'Free Spin') {
                const spinRecordParams = new URLSearchParams()
                spinRecordParams.append('userId', userId)
                spinRecordParams.append('type', buyAs)
                if (updatedSpinData.length) {
                    const noOfspin = updatedSpinData.find(item => item.userId == userId && item.type == buyAs)
                    if (noOfspin) {
                        spinRecordParams.append('no_of_spin', noOfspin.no_of_spin - 1)
                        axios.put(`${apiUrl}/api/spinRecord/${userId}/${buyAs}`, spinRecordParams, config)
                            .then((response) => {
                                setSpinRecord(response.data.spinRecord)
                            })
                            .catch((error) => {
                                console.log(error)
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Oops, Something went wrong'
                                })
                            })
                    }
                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No Spin',
                text: 'No spin in the inventory'
            })
        }
    }

    const handleConnect = async () => {
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{
                eth_accounts: {}
            }]
        });
        let web3 = window.web3
        // Load account
        let accounts = await web3.eth.getAccounts()
        setOwner(accounts[0])
        dispatch(connectUserSuccess(accounts[0]))
    }

    // const handleBuyAs = (e) => {
    //     setBuyAs(e.target.value)
    // }

    const buySpinsHandler = () => {

        axios.get(`${apiUrl}/api/userEarning/${userId}/${buyAs}`)
            .then((response) => {

                if (response?.data?.earnerData) {
                    if (response.data.earnerData.totalAmount > Number(spinCost)) {
                        rewardUpdateCall()
                        spinUpdateCall()
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Buy Spin',
                            text: 'User earning is not enough to buy spin'
                        })
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Buy Spin',
                        text: 'User earning is not enough to buy spin'
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Oops, Something went wrong'
                })
            })

    }

    return (
        <div>
            <CurrenPageTitle title='Fortune Wheel'></CurrenPageTitle>
            {userId &&
                <div className='container center mt-8'>
                    <div className='center flex-column'>
                        <div className='border border-warning text-white p-2 rounded-2'>
                            No of spins: {`${updatedSpinData.length ? (updatedSpinData.find(item => item.type === 'owner' 
                            && item.userId == userId) ?
                                updatedSpinData.find(item => item.type === 'owner' && item.userId == userId).no_of_spin : 0) : 0}`}
                        </div>
                        <section className='mt-5'>
                            <div className='header-Connect-btn py-3 w-190px center bold fs-13 cursor'
                                data-bs-toggle='modal'
                                data-bs-target='#BuySpin'>
                                Buy Spin
                            </div>
                            <div className='modal fade' id={`BuySpin`} tabIndex='-1' aria-labelledby='BuySpinLabel' aria-hidden='true' >
                                <div className='modal-dialog modal-lg'>
                                    <div style={{ padding: "35px" }} className='instructionsBoard modal-content py-3 bg-dark text-white shadow-lg'>

                                        <div className='modal-header center p-4 border-bottom-0' style={{ border: "none" }}> <h3 style={{ color: "black" }}>Spin Cost</h3>
                                        </div>
                                        <div className='modal-body p-4'>
                                            <p className='mb-4' style={{ fontSize: "17px", fontWeight: "400", color: "black" }}>

                                            </p>
                                            <div className='align-items-center d-flex justify-content-between mb-4' >
                                                <div> <h4 style={{ color: "black", fontSize: "15px", marginLeft: '25px' }}>Select Spin Cost</h4> </div>
                                                <div className='d-flex align-items-center w-60 text-black'>
                                                    <select
                                                        className='form-select w-75 mt-1'
                                                        onChange={(e) => {
                                                            setSpinCost(e.target.value);
                                                        }}
                                                    >
                                                        {spinCostData.length && 
                                                            <>
                                                                <option value={spinCostData[0].spin_1_cost}>{`1 Spin Cost (${spinCostData[0].spin_1_cost} DMS)`}</option>
                                                                <option value={spinCostData[0].spin_5_cost}>{`5 Spin Cost (${spinCostData[0].spin_5_cost} DMS)`}</option>
                                                            </>
                                                        }
                                                    </select>
                                                </div>
                                            </div>

                                            {/* <div className='align-items-center d-flex justify-content-between mb-4' >
                                                    <div> <h4 style={{ color: "black", fontSize: "15px", marginLeft: '25px' }}>Select Buyer</h4> </div>
                                                    <div className='d-flex align-items-center w-60 text-black'>
                                                        <select
                                                            className='form-select w-75 mt-1'
                                                            onChange={handleBuyAs}
                                                        >
                                                            <option value={'owner'}>Owner</option>
                                                            <option value={'scholar'}>Scholar</option>
                                                        </select>
                                                    </div>
                                                </div> */}

                                            <div className='align-items-center d-flex justify-content-between mb-4' >
                                                <div></div>
                                                <div className='d-flex align-items-center w-60 text-black'>
                                                    <h4 style={{ color: "black", fontSize: "15px" }}>{`${spinCost} DMS will be deducted from ${buyAs} Wallet`}</h4>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='modal-footer border-top-0 mb-5'>
                                            <div className='header-Connect-btn h-40px center w-100px px-2 bold cursor'
                                                onClick={buySpinsHandler}
                                                data-bs-dismiss='modal'
                                            >
                                                Buy Spins
                                            </div>
                                            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            }
            {/* {userId && <NavLinks match={match} />} */}
            <div className='container center mt-6'>
                <div className={`${userId} py-2 w-md-lg2 w-md2 mb-8`}>
                    <div className='center flex-column'>
                        <footer className='center flex align-items-center pb-4 mb-4'>
                            {userId ? (
                                <div>
                                    {slots.length ?
                                        <div className={`wheel-wrapper  ${mustSpin ? 'rotate' : ''} `}>
                                            <Wheel
                                                mustStartSpinning={mustSpin}
                                                onStopSpinning={() => setMustSpin(!mustSpin)}
                                                prizeNumber={prizeNumber}
                                                data={slots}
                                                outerBorderColor='#E0E1DE'
                                                outerBorderWidth='15'
                                                innerBorderColor='#051746'
                                                innerBorderWidth='40'
                                                radiusLineColor='#b1b1b1'
                                                radiusLineWidth='2'
                                                backgroundColors={['#123796', '#36AC03', '#C3430C', '#EECE0A', '#912862']}
                                                textColors={['#ffffff']}
                                                fontSize='13'
                                            />
                                            <span className="inner-first">SPIN</span>
                                            <span className="inner-second"></span>

                                        </div> :
                                        <div className='container'>
                                            <div className='center'>
                                                <div>
                                                    <p className='text-white mt-4 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
                                                        Coming Soon
                                                    </p>
                                                </div>
                                            </div>
                                        </div>}

                                </div>
                            ) : (
                                <div className='container'>
                                    <div className='center'>
                                        <div>
                                            <p className='text-white mt-4 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
                                                Please connect for Fortune Wheel
                                            </p>
                                            <div
                                                onClick={handleConnect}
                                                className={` header-Connect-btn h-40px w-sm mx-auto  mt-5 center bold cursor`}
                                            >
                                                Connect
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </footer>
                    </div>

                    <div className='center fs-19 flex-column'>
                        <footer className='center mt-2 flex align-items-center pb-4 mb-4'>
                            {userId && slots.length ? (
                                <div>
                                    {spinEnable ?
                                        <div className={`header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor`} onClick={() => handleSpinClick()}>
                                            Spin
                                        </div> :
                                        <div className='center mt-6'>
                                            <Loading />
                                        </div>
                                    }
                                </div>
                            ) : ''}
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FortuneWheel;
