
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getMinions, addMinions, editMinions, deleteMinions } from '../../redux/minions/action';
import { connect } from 'react-redux';
// import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux'

function MinionForm(props) {
    // const dispatch = useDispatch()
    // const selector = useSelector((state) => state)
    // console.log('selectorselector', selector)

    const [state, setState] = useState({
        title: '',
        img: '',
        rating: 0,
        totalRating: 0,
        price: 0,
        Win_Rate: 0,
        Win_Rate_Display: '',
        Reward_Estimated: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        Exp_Gain: 0,
        Lose_Exp_Gain: 0
    })

    // const [imageState, setImageState] = useState({ image: null, imagePreviewUrl: null })


    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            const rewardEstimated = JSON.parse(propsData.values.Reward_Estimated)

            setState({
                ...state,
                _id: propsData._id,
                title: propsData.title,
                img: propsData.img,
                rating: propsData.rating,
                totalRating: propsData.totalRating,
                price: propsData.price,
                Win_Rate: propsData.values.Win_Rate,
                Win_Rate_Display: propsData.values.Win_Rate_Display,
                Reward_Estimated: { 1: rewardEstimated['1'], 2: rewardEstimated['2'], 3: rewardEstimated['3'], 4: rewardEstimated['4'], 5: rewardEstimated['5'] },
                Exp_Gain: propsData.values.Exp_Gain,
                Lose_Exp_Gain: propsData.values.Lose_Exp_Gain
            })
        }
    }, [])
    
    // handleSubmit(e) {
    //     e.preventDefault();
    //     let form = document.forms.itemAdd;
    //     this.props.createItem({
    //         name: form.name.value,
    //         image: this.state.image
    //     });
    //     // Clear the form and state for the next input.
    //     form.name.value = "";
    //     this.state.image = null;
    //     this.state.imagePreviewUrl = null;
    // }

    // const handleImageChange = (e) => {
    //     e.preventDefault()
    //     let reader = new FileReader()
    //     let file = e.target.files[0]
    //     reader.onloadend = () => {
    //         setImageState({ ...imageState, image: file, imagePreviewUrl: reader.result })
    //     }
    //     reader.readAsDataURL(file)
    // }

    // console.log('imageState', imageState)

    // const validateForm = () => {
    //     let isValid = false
    //     if (state.rating >= 0 &&
    //         state.totalRating >= 0 &&
    //         state.price >= 0 &&
    //         state.Win_Rate >= 0 &&
    //         state.Reward_Estimated['1'] >= 0 &&
    //         state.Reward_Estimated['2'] >= 0 &&
    //         state.Reward_Estimated['3'] >= 0 &&
    //         state.Reward_Estimated['4'] >= 0 &&
    //         state.Reward_Estimated['5'] >= 0 &&
    //         state.Lose_Exp_Gain >= 0 &&
    //         state.Exp_Gain >= 0) {
    //         isValid = true
    //     }
    //     return isValid
    // }

    const submitData = () => {

        if (!state._id) {
            props.addMinions(state, JSON.parse(localStorage.getItem('token')))
            // props.history.push('/minions')
        } else if (state._id) {
            props.editMinions(state, JSON.parse(localStorage.getItem('token')))
            props.history.push('/minions')

        } else {
            alert('Enter Minion Details.');
        }
        // clearData()
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const handleRewardChange = (e) => {
        setState({ ...state, Reward_Estimated: { ...state.Reward_Estimated, [e.target.name]: e.target.value } })

    }


    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        if (field !== '_id' && field !== 'Reward_Estimated') {
            return (
                <div className="form-group col-md-6 mb-4" key={i}>
                    <label className="control-label">{field.toUpperCase()}</label>
                    <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        disabled={ field === 'img' ? 'disabled' : ''}
                        placeholder={`Enter ${field}`}
                        type={(field === 'rating' || field === 'totalRating' || field === 'price' || field === 'Win_Rate' ||
                            field === 'Lose_Exp_Gain' || field === 'Exp_Gain') && 'number'}
                    />
                </div>
            )
        }

    });

    const numberInputOnWheelPreventChange = (e) => {
        e.target.blur()
        e.stopPropagation()
        setTimeout(() => {
          e.target.focus()
        }, 0)
      }

    const rewardEstimated = Object.entries(state.Reward_Estimated).map((item, i) => {
        const field = item[0]
        const value = item[1]
        return (
            <div className="form-group col-md-6 mb-4" key={i}>
                <label className="control-label">{`Level ${field}`}</label>
                <input type="text" required="required" className="form-control" onChange={handleRewardChange}
                    name={field} value={value}
                    placeholder={`Enter ${field}`}
                    type='number'
                    onWheel={numberInputOnWheelPreventChange}
                />
            </div>
        )

    })

    const clearData = () => {
        setState({
            title: '', rating: '', totalRating: '', price: '', Win_Rate: '',
            Lose_Exp_Gain: '', Reward_Estimated: { 1: '', 2: '', 3: '', 4: '', 5: '' }, Exp_Gain: ''
        })
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Minions Profile</h3>
                        <div className="row">
                            {InputField}
                        </div>

                        <br />
                        <h3>Rewards Setup</h3>

                        <div className="row">
                            {rewardEstimated}
                        </div>

                        {/* <div className="row">
                            <div className="form-group col-md-6">
                                <label className="control-label">Item Image</label>
                                <input type="file" required="required" className="form-control" onChange={handleImageChange} />
                                <img style={{
                                    marginTop: imageState.imagePreviewUrl && '20px',
                                    height: imageState.imagePreviewUrl && '100px'
                                }} src={imageState.imagePreviewUrl} />
                            </div>
                        </div> */}
                        <div className="row" >
                            <div className="col-md-6">{state._id ? <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
                                <button className="btn-default hvr-bounce-in" onClick={submitData}>ADD</button>}</div>
                            <div className="col-md-6"><button className="btn-default hvr-bounce-in" onClick={clearData}>CLEAR</button></div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    minions: state.MinionsReducer
});

export default connect(mapStateToProps, { getMinions, addMinions, editMinions, deleteMinions })(MinionForm); 