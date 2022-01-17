
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getMinions, addMinions, editMinions, deleteMinions } from '../../redux/minions/action';
import { connect } from 'react-redux';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

function MinionForm(props) {
    // const dispatch = useDispatch()
    // const selector = useSelector((state) => state)
    // console.log('selectorselector', selector)

    const [state, setState] = useState({
        title: '',
        img: '',
        rating: '',
        totalRating: '',
        price: '',
        Win_Rate: '',
        Reward_Estimated: '',
        Exp_Gain: ''
    })

    // const [imageState, setImageState] = useState({ image: null, imagePreviewUrl: null })

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            setState({
                ...state,
                _id: propsData._id,
                title: propsData.title,
                img: propsData.img,
                rating: propsData.rating,
                totalRating: propsData.totalRating,
                price: propsData.price,
                Win_Rate: propsData.values.Win_Rate,
                Reward_Estimated: propsData.values.Reward_Estimated,
                Exp_Gain: propsData.values.Exp_Gain,
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

    const validateForm = () => {
        let isValid = false
        if (state.title && state.img && state.rating && state.totalRating && state.price && state.Win_Rate && state.Reward_Estimated && state.Exp_Gain) {
            isValid = true
        }
        return isValid
    }

    const submitData = () => {
        if (props.location.state && validateForm()) {
            props.editMinions(state)
            // dispatch(editMinions(state))
        }
        else if (validateForm()) {
            props.addMinions(state)
            props.history.push('/minions')
        }
        else {
            alert('Enter Complete Minion Details');
        }
        clearData();
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        if (field !== '_id') {
            return (
                <div className="form-group col-md-6" key={i}>
                    <label className="control-label">{field.toUpperCase()}</label>
                    <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        placeholder={`Enter ${field}`}
                    // type='number'
                    />
                </div>
            )
        }

    });

    const clearData = () => {
        setState({ title: '', img: '', rating: '', totalRating: '', price: '', Win_Rate: '', Reward_Estimated: '', Exp_Gain: '' })
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
                        <div className="row" style={{ justifyContent: 'center', width: '200px' }}>
                            {state.id ? <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
                                <button className="btn-default hvr-bounce-in" onClick={submitData}>ADD</button>}
                        </div>
                        <div className="row" style={{ justifyContent: 'center', width: '200px' }}>
                            <button className="btn-default hvr-bounce-in" onClick={clearData}>CLEAR</button>
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