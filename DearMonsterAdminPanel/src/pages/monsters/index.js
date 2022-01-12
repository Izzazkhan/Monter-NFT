
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
            props.deleteDearMonsters(id);

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
                                    <th>Name</th>
                                    <th>Element</th>
                                    <th>Level</th>
                                    <th>Experience</th>
                                    <th>Stars</th>
                                    <th>Energy</th>
                                    <th>Image</th>
                                    <th>Action(s)</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {props.dearMonsters.dearMonsters
                                    && props.dearMonsters.dearMonsters.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{(index + 1)}</td>
                                            <td>{data.name}</td>
                                            <td>{data.element}</td>
                                            <td>{data.level}</td>
                                            <td>{data.exp}</td>
                                            <td>{data.star}</td>
                                            <td>{data.energy}</td>
                                            <td>{data.image}</td>

                                            <td><button onClick={() => editDetails(data)}>EDIT</button>
                                                <button onClick={() => deleteDearMonsters(data.id)}>DELETE</button>
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