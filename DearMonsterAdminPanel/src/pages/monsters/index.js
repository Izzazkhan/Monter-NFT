
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getDearMonsters, addDearMonsters, editDearMonsters, deleteDearMonsters } from '../../redux/monsters/action';
import { connect } from 'react-redux';

function Monsters(props) {

    console.log('props', props)

    useEffect(() => {
        props.getDearMonsters();
    }, [])


    const editDetails = (data) => {
        console.log('data', data)
        props.history.push('/monsters/create', { data })
    }

    const deleteDearMonsters = (id) => {
        // clearData();
        if (window.confirm("Are you sure?")) {
            props.deleteDearMonsters(id, JSON.parse(localStorage.getItem('token')))

        }
    }


    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>DearMonsters Profile</h3>
                        <button className="btn-default" onClick={() => props.history.push('/monsters/create')}>ADD New</button>
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Image</th>
                                    <th>Total Rating</th>
                                    <th>Price</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {props.dearMonsters.dearMonsters
                                    && props.dearMonsters.dearMonsters.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{data._id}</td>
                                            <td>{data.title}</td>
                                            <td>{data.cetagory}</td>
                                            {/* <td>{data.img}</td> */}
                                            <td>{data.totalRating}</td>
                                            <td>{data.price}</td>
                                            <td><button onClick={() => editDetails(data)}>EDIT</button>
                                                <button onClick={() => deleteDearMonsters(data._id)}>DELETE</button>
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
    dearMonsters: state.MonsterReducer
});

export default connect(mapStateToProps, { getDearMonsters, addDearMonsters, editDearMonsters, deleteDearMonsters })(Monsters); 