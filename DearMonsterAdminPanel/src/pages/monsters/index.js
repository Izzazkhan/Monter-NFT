
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getDearMonsters, addDearMonsters, editDearMonsters, deleteDearMonsters } from '../../redux/monsters/action';
import { connect } from 'react-redux';
import { usePagination } from '../../hooks/userPagination';
import { Spinner } from "react-bootstrap"

function Monsters(props) {

    const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const { pageData, currentPage, previousPage, nextPage, totalPages, doPagination } = usePagination(data, 30)

    useEffect(() => {
        props.getDearMonsters();
    }, [])

    useEffect(() => {
        setData(props.dearMonsters.dearMonsters)
        doPagination(props.dearMonsters.dearMonsters)
    }, [props])

    useEffect(() => {
        if(data.length) {
            setLoading(false)
        }
    }, [data])


    const editDetails = (data) => {
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
                            { loading ?  <Spinner animation="border" /> :
								data ?
									<>
										{data?.length === 0 ? (
											<div className='text-center'>
												<h3>{'No Data'}</h3>
											</div>
										) : (
											pageData.length > 0 ? pageData.map((data, index) => {
												return (
													<tr key={(index + 1)}>
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
												);
											}) : ""
										)}
									</>
									:
									<>
										
									</>

							}

                            </tbody>
                        </table>
                        {pageData?.length == 0 ? (
							''
						) : (
                            <div className="row">
                                <div className='col-md-4'>
                                <img
									src='/assets/imgs/ArrowLeft.png'
                                    style={{cursor: 'pointer'}}
									onClick={previousPage}
								/>
                                </div>
                                <div className='col-md-4'>
                                <p className='col-md-2'>
									{currentPage}/{totalPages}
								</p>
                                </div>
                                <div className='col-md-4'>
                                <img src='/assets/imgs/ArrowRight.png' 
                                    style={{cursor: 'pointer'}}
                                    className='col-md-4' onClick={nextPage} />
                                </div>
                                
                                </div>
							
						)}
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