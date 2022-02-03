
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getBonus, addBonus, editBonus, deleteBonus } from '../../redux/bonus/action';
import { connect } from 'react-redux';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

function BonusForm(props) {
    // const dispatch = useDispatch()
    // const selector = useSelector((state) => state)
    // console.log('selectorselector', selector)

    const [state, setState] = useState({
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: ''
    })


    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            console.log('props ==', props)


            setState({
                ...state,
                _id: propsData._id,
                1: propsData['1'],
                2: propsData['2'],
                3: propsData['3'],
                4: propsData['4'],
                5: propsData['5'],
                6: propsData['6'],

            })
        }
    }, [])

    console.log('state =====', state)




    // const validateForm = () => {
    //     let isValid = false
    //     if (state['1'] && state['2'] && state['3'] && state['4'] && state['5'] && state['6']
    //     ) {
    //         isValid = true
    //     }
    //     return isValid
    // }

    const submitData = () => {

        if (!state._id) {
            props.addBonus(state, JSON.parse(localStorage.getItem('token')))
            props.history.push('/additional-reward')
        } else if (state._id) {
            props.editBonus(state, JSON.parse(localStorage.getItem('token')))
            props.history.push('/additional-reward')

        } else {
            alert('Enter Monster Details.');
        }
        clearData()
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
                    <label className="control-label">{`Additional Reward in % for level ${field}`}</label>
                    <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        placeholder={`Enter ${field}`}
                        type='number'
                    />
                </div>
            )
        }

    });


    const clearData = () => {
        setState({
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',

        })
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Additional Reward</h3>
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
                            {state._id ? <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
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
    bonus: state.BonusReducer
});

export default connect(mapStateToProps, { getBonus, addBonus, editBonus, deleteBonus })(BonusForm); 