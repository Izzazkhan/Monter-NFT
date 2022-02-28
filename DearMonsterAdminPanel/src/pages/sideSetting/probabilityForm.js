
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getProbabilty, addProbability, editProbability, deleteProbability } from '../../redux/probabilty/action';
import { connect } from 'react-redux';

function ProbabilityList(props) {
    const [numberList, setNumberList] = useState({
        prob_1: 45,
        prob_2: 37,
        prob_3: 11,
        prob_4: 6,
        prob_5: 1
    })

    useEffect(() => {
        props.getProbabilty();
    }, [])

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data

            setNumberList({
                ...numberList,
                _id: propsData._id,
                prob_1: propsData['prob_1'],
                prob_2: propsData['prob_2'],
                prob_3: propsData['prob_3'],
                prob_4: propsData['prob_4'],
                prob_5: propsData['prob_5']
            })
        }
    }, [])

    const handleProbilityList = (e) => {
        setNumberList({ ...numberList, [e.target.name]: e.target.value })
    }

    const submitProbabilty = () => {

        if (Number(numberList.prob_1) < 0.1 || Number(numberList.prob_2) < 0.1 ||
            Number(numberList.prob_3) < 0.1 || Number(numberList.prob_4) < 0.1 || Number(numberList.prob_5) < 0.1) {
            alert('No value can be less than 0.1')
        }
        else if (Number(numberList.prob_1) + Number(numberList.prob_2) + Number(numberList.prob_3)
            + Number(numberList.prob_4) + Number(numberList.prob_5) !== 100) {
            alert('Sum of all the probabilities should be equal to 100')
        }
        else {
            if (!numberList._id) {
                props.addProbability(numberList, JSON.parse(localStorage.getItem('token')))
                props.history.push('/side-setting')
            } else if (numberList._id) {
                props.editProbability(numberList, JSON.parse(localStorage.getItem('token')))
                props.history.push('/side-setting')

            } else {
                alert('Enter Probabilites');
            }
        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Probabilty List</h3>
                        <div className="content-box">
                            <div className="row">
                                <div className={`col-md-3`}>
                                    <label className="control-label">{`Maximum Purchase`}</label>
                                    <input type="text" required="required" className="form-control" onChange={handleProbilityList}
                                        name={'prob_1'} value={numberList.prob_1}
                                        placeholder={`Enter Maximum Purchase`}
                                        type='number'
                                    />
                                </div>
                                <div className={`col-md-3`}>
                                    <label className="control-label">{`Maximum Purchase`}</label>
                                    <input type="text" required="required" className="form-control" onChange={handleProbilityList}
                                        name={'prob_2'} value={numberList.prob_2}
                                        placeholder={`Enter Maximum Purchase`}
                                        type='number'
                                    />
                                </div>
                                <div className={`col-md-3`}>
                                    <label className="control-label">{`Maximum Purchase`}</label>
                                    <input type="text" required="required" className="form-control" onChange={handleProbilityList}
                                        name={'prob_3'} value={numberList.prob_3}
                                        placeholder={`Enter Maximum Purchase`}
                                        type='number'
                                    />
                                </div>
                                <div className={`col-md-3`}>
                                    <label className="control-label">{`Maximum Purchase`}</label>
                                    <input type="text" required="required" className="form-control" onChange={handleProbilityList}
                                        name={'prob_4'} value={numberList.prob_4}
                                        placeholder={`Enter Maximum Purchase`}
                                        type='number'
                                    />
                                </div>
                                <div className={`col-md-3`}>
                                    <label className="control-label">{`Maximum Purchase`}</label>
                                    <input type="text" required="required" className="form-control" onChange={handleProbilityList}
                                        name={'prob_5'} value={numberList.prob_5}
                                        placeholder={`Enter Maximum Purchase`}
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
    probabilityList: state
});

export default connect(mapStateToProps, { getProbabilty, addProbability, editProbability, deleteProbability })(ProbabilityList)