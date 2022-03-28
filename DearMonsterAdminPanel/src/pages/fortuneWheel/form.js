
import React, { useState, useEffect } from "react"
import "../../App.css"
import { addFortuneWheel, editFortuneWheel } from '../../redux/fortuneWheel/action'
import { connect } from 'react-redux'

function FortuneWheelForm(props) {

    const [state, setState] = useState({wheelName: '', isActive: false})
    const [slots, setSlots] = useState([])

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data

            setState({
                ...state,
                _id: propsData._id,
                wheelName: propsData.wheelName,
                isActive: propsData.isActive
            })
            setSlots([...propsData.slots])
        }
    }, [])

    const onChangeSlot = (e, index) => {
        const list = [...slots]
        if (e.target) {
            list[index][e.target.name] = e.target.name === 'probability' ? 
            e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/(\.\d{4}).+/g, '$1') : e.target.value
        }
        setSlots(list)
      }

    const addSlot = () => {
        setSlots([
          ...slots,
          {
            option: "",
            probability: "",
            actionType: '',
            value: ''
          }
        ])
    }

    console.log('slots', slots)

    const removeSlot= (index) => {
        const list = [...slots];
        list.splice(index, 1);
        setSlots(list);
    }

    const handleChange = (e) => {
        if(e.target.name === 'value') {
            setState({ ...state, isActive: e.target.checked })
        } else {
            setState({ ...state, wheelName: e.target.value })
        }
    }

    const onSubmit = () => {
        if(!slots.map(item => item.probability >= 0.0001).every(element => element === true)) {
            alert('Minimum value of probability should be 0.0001')
        }
        else if(slots.reduce((n, {probability}) => Number(n) + Number(probability), 0) != 100) {
            alert('Sum of slots in not 100')
        }
        else if (!state._id) {
            props.addFortuneWheel({...state, slots}, JSON.parse(localStorage.getItem('token')))
            props.history.push('/fortune-wheel')
        } else if (state._id) {
            props.editFortuneWheel({...state, slots}, JSON.parse(localStorage.getItem('token')))
            props.history.push('/fortune-wheel')
        } else {
            alert('Enter Details.');
        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Fortune Wheel</h3>
                        <div className="row">
                            <div className="form-group col-md-4 mb-4">
                                <label className="control-label">{'Wheel Name'}</label>
                                <input type="text" required="required" className="form-control" onChange={handleChange}
                                    name={'wheelName'} value={state.wheelName}
                                    placeholder={`Enter field`}
                                />
                            </div>
                            <div className="form-group col-md-4 mb-4" style={{marginTop: 30}}>
                                <label className="control-label">{'Is Active'}</label>
                                <input type="checkbox"  name={'value'} checked={state.isActive} onChange={handleChange}></input>
                            </div>
                        </div>
                        
                        <div className="row">
                        {slots.map((singleSlot, i) => {
                            return (
                                <div key={i}>
                                    <div className="row">
                                    <div className="form-group col-md-2 mb-2">
                                        <label className="control-label">{'Option'}</label>
                                        <input type="text" required="required" className="form-control" onChange={(e) => onChangeSlot(e, i)}
                                            name={'option'} value={singleSlot.option}
                                            placeholder={`Enter Option`}
                                        />
                                    </div>
                                    <div className="form-group col-md-2 mb-2">
                                        <label className="control-label">{'Probability'}</label>
                                        <input type="text" required="required" className="form-control" onChange={(e) => onChangeSlot(e, i)}
                                            name={'probability'} value={singleSlot.probability}
                                            placeholder={`Enter Probability`}
                                        />
                                    </div>
                                    
                                    <div className="form-group col-md-3 mb-3">
                                        <label className="control-label">{'Action Type'}</label>
                                        <select name='actionType' className='form-control  w-100px' onChange={(e) => onChangeSlot(e, i)} value={singleSlot.actionType}>
										<option value={'BUSD'}>BUSD</option>
										<option value={'Free Spin'}>Free Spin</option>
										<option value={'DMS'}>DMS</option>
										<option value={'Elemental Shard'}>Elemental Shard</option>
										<option value={'Dearmonster Fragment'}>Dearmonster Fragment</option>
										<option value={'Dungeon Ticket'}>Dungeon Ticket</option>
									    </select>
                                    </div>
                                    <div className="form-group col-md-2 mb-2">
                                        <label className="control-label">{'Value'}</label>
                                        <input type="text" required="required" className="form-control" onChange={(e) => onChangeSlot(e, i)}
                                            name={'value'} value={singleSlot.value}
                                            placeholder={`Enter Value`}
                                        />
                                    </div>
                                    <div className="form-group col-md-2 mb-2" style={{marginTop: 16}}>
                                        <div className="col-md-6"><button className="btn-default hvr-bounce-in" onClick={() => removeSlot(i)}>Remove Slot</button></div>
                                    </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="row" >
                            <div className="col-md-6"><button className="btn-default hvr-bounce-in" onClick={addSlot}>Add Slot</button></div>
                            <div className="col-md-6"><button className="btn-default hvr-bounce-in" onClick={onSubmit}>Submit</button></div>
                        </div>
                        
                        </div>

                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    fortuneWheel: state.FortuneWheelReducer
})

export default connect(mapStateToProps, { addFortuneWheel, editFortuneWheel })(FortuneWheelForm)