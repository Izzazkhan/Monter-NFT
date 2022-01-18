
import React, { useState } from "react"
import axios from 'axios'
import { Register } from "../../utilities/constant";
import ToastNotification from '../../components/Toast'
import Header from '../../layout/Header'

const RegisterPage = () => {
    const [state, setState] = useState({ firstName: '', lastName: '', email: '', password: '' })
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [openNotification, setOpenNotification] = useState(false)
    console.log('stateeeee', state)

    const submitData = async () => {
        if (state.firstName && state.lastName && state.email && state.password) {
            const params = new URLSearchParams()
            params.append('firstName', state.firstName)
            params.append('lastName', state.lastName)
            params.append('email', state.email)
            params.append('password', state.password)

            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios
                .post(Register, params, config)
                .then((res) => {
                    console.log('response', res)
                    setSuccessMsg('Registration Completed Successfully')
                    setOpenNotification(true)
                }).catch((error) => {
                    console.log("Error", error);
                    setErrorMsg('Error while registering, please try again')
                    setOpenNotification(true)

                })

            // props.addDearMonsters({ ...registerDetail, id: Math.floor(Math.random() * (999 - 100 + 1) + 100) })
            // props.history.push('/')
            // < Redirect to={`/`} />
        } else {
            alert('Enter Registration details');
        }
        // clearData();
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        if (field !== 'id') {
            return (
                <div className="form-group col-md-6" key={i}>
                    <label className="control-label">{field.toUpperCase()}</label>
                    <input  type= { field === "password" ? "password" : "text" } required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        placeholder={`Enter ${field}`} />
                </div>
            )
        }
    })

    const clearData = () => {
        setState({ firstName: '', lastName: '', email: '', password: '' })
    }

    return (
        <>
            <Header />
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>DearMonsters Profile</h3>
                        <div className="row">
                            {InputField}
                        </div>
                        <div className="row" >
                            <div className="col-md-6">
                                <button className="btn-default hvr-bounce-in" onClick={submitData}>Register</button>
                            </div>
                            <div className="col-md-6">
                                <button className="btn-default hvr-bounce-in" onClick={clearData}>CLEAR</button>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>

            <ToastNotification
                setOpenNotification={setOpenNotification}
                msg={errorMsg}
                open={openNotification}
                success={successMsg}
            />
        </>
    )
}

export default RegisterPage
