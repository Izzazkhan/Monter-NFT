
import React, { useState } from "react"
import axios from 'axios'
import { Login } from "../../utilities/constant";
import ToastNotification from '../../components/Toast'
import Header from '../../layout/Header'
import useToken from '../../hooks/useToken'
// import { useHistory } from 'react-router-dom';

const LoginPage = (props) => {
    // const history = useHistory()
    const { token, setToken } = useToken()
    console.log('loginprosp', token)

    const [state, setState] = useState({ email: '', password: '' })
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [openNotification, setOpenNotification] = useState(false)
    console.log('stateeeee', state)

    const handleLogin = async () => {
        if (state.email && state.password) {
            const params = new URLSearchParams()
            params.append('email', state.email)
            params.append('password', state.password)

            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
                }
            }
            axios
                .post(Login, params, config)
                .then((res) => {
                    console.log('response', res)
                    setSuccessMsg('Logged In Successfully')
                    setOpenNotification(true)
                    setToken(res.data)
                    props.history.push('/dashboard')
                    window.location.reload()
                }).catch((e) => {
                    console.log("Error", e);
                    setErrorMsg('Error while logging, please try again')
                    setOpenNotification(true)
                })

        } else {
            alert('Enter Login Details.');
        }
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        return (
            <div className="form-group col-md-6" key={i}>
                <label className="control-label">{field.toUpperCase()}</label>
                <input type={field === "password" ? "password" : "text"} required="required" className="form-control" onChange={handleChange}
                    name={field} value={value}
                    placeholder={`Enter ${field}`} />
            </div>
        )
    })

    const forgetPassword = () => {
        props.history.push('/forget-password');
    }

    return (
        <>
            <Header />
            <div className="col-lg-12 col-md-12">
                <div className="content-wrapper">
                    <div className="content-box auth-box">
                        <h3>Login User</h3>
                        <div className="row">
                            {InputField}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn-default hvr-bounce-in login-button" onClick={handleLogin}>Login</button> &nbsp;&nbsp;
                            {/* <button className="btn-default hvr-bounce-in login-button" onClick={forgetPassword}>Forget Password</button> */}
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

export default LoginPage
