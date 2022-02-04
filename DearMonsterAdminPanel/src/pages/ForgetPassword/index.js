
import React, { useState } from "react"
import axios from 'axios'
import { resetPassword } from "../../utilities/constant";
import ToastNotification from '../../components/Toast'

function ChangePassword(props) {
    const [state, setState] = useState({ password: '', newPassword: '', confirmPassword: '' })
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [openNotification, setOpenNotification] = useState(false)

    const handleForgetPassword = async () => {
        if (state.confirmPassword !== state.newPassword) {
            alert('Passwords do not match');
        }
        else if (state.confirmPassword && state.newPassword) {
            const params = new URLSearchParams()
            params.append('email', JSON.parse(localStorage.getItem('token')).user.email)
            params.append('password', state.password)
            params.append('newPassword', state.newPassword)
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`,
                    // "Token": `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            }
            axios
                .post(resetPassword, params, config)
                .then((res) => {
                    console.log('response', res)
                    setSuccessMsg('Password Reset Successfully')
                    setOpenNotification(true)
                    // setToken(res.data)
                    // props.history.push('/dashboard')
                    // window.location.reload()
                }).catch((e) => {
                    console.log("Error", e);
                    setErrorMsg('Error while resetting password, please try again')
                    setOpenNotification(true)
                })

        } else {
            alert('Enter Details');
        }
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        console.log(field)
        // if (field === 'newPassword') {
        //     field = 'New Password'
        // }
        // else if (field === 'confirmPassword') {
        //     field = 'Confirm Password'
        // }
        return (
            <div className="form-group col-md-12" key={i}>
                <label className="control-label">{field === "newPassword" ? 'New Password' : field === 'confirmPassword' ? 'Confirm Password' : 'Previous Password'}</label>
                <input type={"password"} required="required" className="form-control" onChange={handleChange}
                    name={field} value={value}
                    placeholder={`Enter ${field === "newPassword" ? 'New Password' : field === 'confirmPassword' ? 'Confirm Password' : 'Previous Password'}`} />
            </div>
        )
    })





    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Change Password</h3>
                        <div className="row">
                            {InputField}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button className="btn-default hvr-bounce-in login-button" onClick={handleForgetPassword}>Change Password</button>&nbsp;&nbsp;
                        </div>

                    </div>
                </div>
                <ToastNotification
                    setOpenNotification={setOpenNotification}
                    msg={errorMsg}
                    open={openNotification}
                    success={successMsg}
                />
            </div>
        </>
    )
}



export default ChangePassword