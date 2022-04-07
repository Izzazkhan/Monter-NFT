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
    const [loading, setLoading] = useState(false)
    const [displayModal, setDisplayModal] = useState('none')
    const [modalState, setModalState] = useState({title: '', text: ''})
    const [autoSpin, setAutoSpin] = useState({state: false, text: 'Auto Spin'})
	const [earnerData, setEarnerData] = useState({})
	const [sweetAlert, setSweetAlert] = useState({icon: '', title: '', text: '', timer: '', button: ''})
	const [alertFlag, setAlertFlag] = useState(false)

    useEffect(() => {
        if (userId) {
            axios.get(`${apiUrl}/api/spinRecord/${userId}`)
                .then((res) => {
                    if (res.data.spinRecord) {
                        setUpdatedSpinData(res.data.spinRecord)
                        if(res.data.spinRecord.length && res.data.spinRecord[0].no_of_spin < 1) {
                            setAutoSpin({state: false, text: 'Auto Spin' })
                        }
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
            axios.get(`${apiUrl}/api/userEarning/${userId}/owner`)
                .then((response) => {
                    if (response?.data?.earnerData) {
                        setEarnerData(response.data.earnerData)
                    }
                    else {
                        setEarnerData({})
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [userId])

    useEffect(() => {
        if(alertFlag) {
            Swal.fire({
                icon: sweetAlert.icon,
                title: sweetAlert.title,
                text: sweetAlert.text,
                timer: autoSpin.timer,
                button: sweetAlert.button
            })
            if(updatedSpinData.length) {
                if(userId && autoSpin.state && updatedSpinData[0].no_of_spin >= 1) {
                    handleSpinClick1()
                    // setTimeout(() => {
                    //     handleSpinClick1()
                    // }, 1);
                } else {
                    setMustSpin(false)
                }
            }
        }
    }, [alertFlag])

    const spinStoping = () => {
        setMustSpin(!mustSpin)
        setAlertFlag(true)
    }

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
        if (updatedSpinData.length) {
            const noOfspin = updatedSpinData.find(item => item.userId == userId && item.type == buyAs)
            if (noOfspin) {
                if (filterValue != undefined) {
                    spinRecordParams.append('no_of_spin', noOfspin.no_of_spin + Number(filterValue))
                } else {
                    if( spinCost == spinCostData[0].spin_1_cost) {
                        spinRecordParams.append('no_of_spin', noOfspin.no_of_spin + 1)
                    } else if( spinCost == spinCostData[0].spin_5_cost) {
                        spinRecordParams.append('no_of_spin', noOfspin.no_of_spin + 5)
                    } else if( spinCost == spinCostData[0].spin_25_cost) {
                        spinRecordParams.append('no_of_spin', noOfspin.no_of_spin + 25)
                    } else if( spinCost == spinCostData[0].spin_100_cost) {
                        spinRecordParams.append('no_of_spin', noOfspin.no_of_spin + 100)
                    }
                }
                axios.put(`${apiUrl}/api/spinRecord/${userId}/${buyAs}`, spinRecordParams, config)
                    .then((response) => {
                        setSpinRecord(response.data.spinRecord)
                        setSweetAlert({...sweetAlert, icon: 'success', title: 'Spin Record', text: 'Spin record has been updated',  timer: autoSpin.state === true && 2000, button: false })
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
                    if(spinCost == spinCostData[0].spin_1_cost) {
                        spinRecordParams.append('no_of_spin', 1)
                    } else if(spinCost == spinCostData[0].spin_5_cost) {
                        spinRecordParams.append('no_of_spin', 5)
                    } else if(spinCost == spinCostData[0].spin_25_cost) {
                        spinRecordParams.append('no_of_spin', 25)
                    } else if(spinCost == spinCostData[0].spin_100_cost) {
                        spinRecordParams.append('no_of_spin', 100)
                    }
                }
                axios.post(`${apiUrl}/api/spinRecord`, spinRecordParams, config)
                    .then((response) => {
                        setSpinRecord(response.data.spinRecord)
                        setSweetAlert({...sweetAlert, icon: 'success', title: 'Spin Record', text: 'Spin record has been updated', timer: autoSpin.state === true && 2000, button: false })
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
                if(spinCost == spinCostData[0].spin_1_cost) {
                    spinRecordParams.append('no_of_spin', 1)
                } else if(spinCost == spinCostData[0].spin_5_cost) {
                    spinRecordParams.append('no_of_spin', 5)
                } else if(spinCost == spinCostData[0].spin_25_cost) {
                    spinRecordParams.append('no_of_spin', 25)
                } else if(spinCost == spinCostData[0].spin_100_cost) {
                    spinRecordParams.append('no_of_spin', 100)
                }
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
        const updateParams = new URLSearchParams()
        updateParams.append('earnerAddress', userId)
        if (earnerData) {
            if (DMSSlot && DMSSlot.value != undefined) {
                updateParams.append('totalAmount', earnerData.totalAmount + Number(DMSSlot.value))
                axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                    .then((response) => {
                        setEarnerData(response.data.userEarning)
                        setSweetAlert({...sweetAlert, icon: 'success', title: 'Reward Earned', text: `Congratutions! You have won ${DMSSlot.value} DMS!`, timer: autoSpin.state === true && 2000, button: false })
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
            } else if (earnerData.totalAmount - Number(spinCost) > 0) {
                updateParams.append('totalAmount', earnerData.totalAmount - Number(spinCost))
                axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                    .then((response) => {
                        setEarnerData(response.data.userEarning)
                        setSweetAlert({...sweetAlert, icon: 'success', title: 'Reward Deduction', text: `${spinCost} DMS deducted from the ${buyAs} wallet`, timer: autoSpin.state === true && 2000, button: false })
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
                    text: `Rewards cannot be deducted from the ${buyAs} wallet`,
                    timer: autoSpin.state === true && 2000, button: false,
                    buttons: false,
                })
            }
        } else {
            if (DMSSlot && DMSSlot.value != undefined) {
                updateParams.append('totalAmount', Number(DMSSlot.value))
                axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                    .then((response) => {
                        setEarnerData(response.data.userEarning)
                        setSweetAlert({...sweetAlert, icon: 'success', title: 'Reward Earned', text: `Congratutions! You have won ${DMSSlot.value} DMS!`, timer: autoSpin.state === true && 2000, button: false })

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
                setSweetAlert({...sweetAlert, icon: 'error', title: 'Error', text: `Rewards cannot be deducted from the ${buyAs} wallet`, timer: autoSpin.state === true && 2000, button: false })
            }
        }
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
                            setSweetAlert({...sweetAlert, icon: 'success', title: 'Congratulations', text: `You have won ${Number(filterValue.value)} new shards.`, timer: autoSpin.state === true && 2000, button: false })
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
                            setSweetAlert({...sweetAlert, icon: 'success', title: 'User Shard', text: `User shard has been updated with count ${res.data.userShard.count}`, timer: autoSpin.state === true && 2000, button: false })
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
                            setSweetAlert({...sweetAlert, icon: 'success', title: 'BUSD Requested', text: `BUSD request has been updated with amount ${filterValue.value}`, timer: autoSpin.state === true && 2000, button: false })
                            
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
                            setSweetAlert({...sweetAlert, icon: 'success', title: 'BUSD Requested', text: `BUSD request has been created with amount ${filterValue.value}`, timer: autoSpin.state === true && 2000, button: false })
                            
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

    const handleAutoSpin = () => {
        if(updatedSpinData.length && updatedSpinData[0].no_of_spin >= 1) {
            setTimeout(() => {
                handleSpinClick1()
                // setAutoSpin({...autoSpin, state: !autoSpin.state, text: !autoSpin.state ? 'Off Auto Spin' : 'Auto Spin'})
                // setMustSpin(autoSpin.state ? false : true)
            }, 1);
            setAutoSpin({...autoSpin, state: !autoSpin.state, text: !autoSpin.state ? 'Off Auto Spin' : 'Auto Spin'})
            setMustSpin(autoSpin.state ? false : true)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No Spin',
                text: 'No spin in the inventory'
            })
        }
    }

    const handleSpinClick1 = () => {
        setAlertFlag(false)
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
            // console.log('filterVal', filterVal)
            if (filterVal.actionType === 'Free Spin') {
                spinUpdateCall(filterVal)
                setsSpinEnable(true)
            } else if (filterVal.actionType === 'DMS') {
                rewardUpdateCall(filterVal)
                setsSpinEnable(true)
            } else if (filterVal.shardType != null) {
                countUpdateCal(filterVal)
                setsSpinEnable(true)
            } else if (filterVal.actionType === 'BUSD') {
                BUSDRequestCall(filterVal)
                setsSpinEnable(true) 
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
            setsSpinEnable(true)
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
        if (earnerData) {
            if (earnerData.totalAmount > Number(spinCost)) {
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
    }

    return (
        <div>
            <CurrenPageTitle title='Fortune Wheel'></CurrenPageTitle>
            {userId &&
            <>
                <div className='container center mt-8'>
                    <div className='center flex-column'>
                    <section className='mt-5 d-flex align-items-center '>
                        <div className='border border-warning text-white px-4 py-3 p-2 rounded-2 mx-4'>
                            No of spins: {`${updatedSpinData.length ? (updatedSpinData.find(item => item.type === 'owner' 
                            && item.userId == userId) ?
                                updatedSpinData.find(item => item.type === 'owner' && item.userId == userId).no_of_spin : 0) : 0}`}
                        </div>
                        <div className='border border-warning text-white px-4 py-3 p-2 rounded-2 '>
                            User Earnings: {earnerData && Object.keys(earnerData).length > 0 ? Number(earnerData.totalAmount) : 0}
                        </div>
                        </section>
                        

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
                                                                <option value={spinCostData[0].spin_25_cost}>{`25 Spin Cost (${spinCostData[0].spin_25_cost} DMS)`}</option>
                                                                <option value={spinCostData[0].spin_100_cost}>{`100 Spin Cost (${spinCostData[0].spin_100_cost} DMS)`}</option>
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
                {/* <div
                    className={`modal fade false ${displayModal == 'block' && 'show'}`}
                    id={'exampleModalL'}
                    tabIndex='-1'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                    style={{display: displayModal == 'block' && displayModal}}
                >
                    <div className='modal-dialog instructionsBoard'>
                        <div className='modal-content bg-dark bg-opacity-75 border-0 py-7 text-white'>
                            <div className='modal-body center fs-25'>{loading ? <Loading /> :
                                <div>
                                    <span>{modalState.title}</span> <br />
                                    <span>{modalState.text}</span>
                                </div>
                            }
                            </div>
                        </div>
                    </div>
                </div> */}
            </>
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
                                                onStopSpinning={() => spinStoping()}
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
                                                // spinDuration={100}
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
                                <>
                                <div>
                                    {!autoSpin.state ?
                                        <>
                                            {spinEnable ?
                                                <div className={`header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor`} onClick={() => handleSpinClick()}>
                                                    Spin
                                                </div> :
                                                <div className='center mt-6'>
                                                    <Loading />
                                                </div>
                                            }
                                        </> 
                                        : ''
                                    }
                                </div>
                                <div className='mx-4'>
                                    {spinEnable ?
                                        <div className={`header-Connect-btn h-40px center px-4 fs-16 bold cursor`} onClick={() => handleAutoSpin()}>
                                            {autoSpin.text}
                                        </div> 
                                    : '' 
                                    }
                                </div>
                                </>
                            ) : ''}
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FortuneWheel;
