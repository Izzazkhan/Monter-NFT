
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getSpinCost, addSpinCost, editSpinCost } from '../../redux/spinCost/action';
import { connect } from 'react-redux';

function SpinCostForm(props) {
    const [spinCost, setSpinCost] = useState({
        spin_1_cost: 0,
        spin_5_cost: 0
    })

    useEffect(() => {
        props.getSpinCost();
    }, [])

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data

            setSpinCost({
                ...spinCost,
                _id: propsData._id,
                spin_1_cost: propsData['spin_1_cost'],
                spin_5_cost: propsData['spin_5_cost']
            })
        }
    }, [])

    const handleSpinCost = (e) => {
        setSpinCost({ ...spinCost, [e.target.name]: e.target.value })
    }

    const submitProbabilty = () => {
            if (!spinCost._id) {
                props.addSpinCost(spinCost, JSON.parse(localStorage.getItem('token')))
                props.history.push('/side-setting')
            } else if (spinCost._id) {
                props.editSpinCost(spinCost, JSON.parse(localStorage.getItem('token')))
                props.history.push('/side-setting')

            } else {
                alert('Enter Spin Cost');
            }
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Spin Cost List</h3>
                        <div className="content-box">
                            <div className="row">
                                <div className={`col-md-3`}>
                                    <label className="control-label">{`1 Spin Cost`}</label>
                                    <input type="text" required="required" className="form-control" onChange={handleSpinCost}
                                        name={'spin_1_cost'} value={spinCost.spin_1_cost}
                                        placeholder={`Enter 1 Spin Cost`}
                                        type='number'
                                    />
                                </div>
                                <div className={`col-md-3`}>
                                    <label className="control-label">{`5 Spin Cost`}</label>
                                    <input type="text" required="required" className="form-control" onChange={handleSpinCost}
                                        name={'spin_5_cost'} value={spinCost.spin_5_cost}
                                        placeholder={`Enter 5 Spin Cost`}
                                        type='number'
                                    />
                                </div>
                                <div className={`col-md-4`}>
                                    <button className="btn-default hvr-bounce-in" onClick={submitProbabilty}>Submit</button>
                                </div>
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    spinCost: state
});

export default connect(mapStateToProps, { getSpinCost, addSpinCost, editSpinCost })(SpinCostForm)