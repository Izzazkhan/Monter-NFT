
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getBonus, addBonus, editBonus, deleteBonus } from '../../redux/bonus/action';
import { connect } from 'react-redux';

function Bonus(props) {

    console.log('propsssssss', props)

    useEffect(() => {
        props.getBonus()
    }, [])


    const editDetails = (data) => {
        console.log('data', data)
        props.history.push('/additional-reward/create', { data })
    }

    const deleteBonus = (id) => {
        // clearData();
        // if (window.confirm("Are you sure?")) {
        //     props.deleteBonus(id, JSON.parse(localStorage.getItem('token')));

        // }
        alert('can not delete')
    }
    
    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Dear Monster Bonus (Additional Reward)</h3>
                        {!props?.bonus?.bonus?.length &&
                            <button className="btn-default" onClick={() => props.history.push('/additional-reward/create')}>ADD New</button>
                        }
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Level 1</th>
                                    <th>Level 2</th>
                                    <th>Level 3</th>
                                    <th>Level 4</th>
                                    <th>Level 5</th>
                                    <th>Level 6</th>
                                    <th>Landing Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {props.bonus.bonus
                                    && props.bonus.bonus.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{data['1']}</td>
                                            <td>{data['2']}</td>
                                            <td>{data['3']}</td>
                                            <td>{data['4']}</td>
                                            <td>{data['5']}</td>
                                            <td>{data['6']}</td>
                                            {
                                                data.message ?
                                                    <td>{`${data['message'].substring(0, 6)}...${data['message'].slice(-6)}`}</td>
                                                    :
                                                    <td></td>
                                            }
                                            <td><button onClick={() => editDetails(data)}>EDIT</button>
                                                <button onClick={() => deleteBonus(data._id)}>DELETE</button>
                                            </td>
                                        </tr>
                                    })}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    bonus: state.BonusReducer
});

export default connect(mapStateToProps, { getBonus, addBonus, editBonus, deleteBonus })(Bonus);

