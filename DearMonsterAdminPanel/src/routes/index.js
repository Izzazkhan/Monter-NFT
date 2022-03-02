
import { useState } from 'react'
import Layout from '../layout/MainLayout'
import Monsters from '../pages/monsters/index'
import Dashboard from '../pages/Dashboard/index'
import MonstersForm from '../pages/monsters/form'
import Minions from '../pages/minions/index'
import MinionsForm from '../pages/minions/form'
import WithdrawRequest from '../pages/withdrawRequest/index'
import AdditionaReward from '../pages/bonus/index'
import SideSetting from '../pages/sideSetting/settingForm'
import ProbabiltyForm from '../pages/sideSetting/probabilityForm'
import AdditionaRewardForm from '../pages/bonus/form'
import FightHistory from '../pages/FightHistory/index'

import NotFound from '../components/NotFound'
import RegistrationPage from '../pages/Authentication/Registeration'
import LoginPage from '../pages/Authentication/Login'
import ForgetPassword from '../pages/ForgetPassword/index'
import useToken from '../hooks/useToken'
// import '../App.css';

import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';


const MainRoutes = (props) => {
    // const { token, setToken } = useToken()

    const [currentUser] = useState(JSON.parse(localStorage.getItem('token')))    // if (!token) {
    //     return <LoginPage setToken={setToken} />
    // }
    console.log('currentUser', currentUser)
    return (
        <Router>
            {currentUser ?
                <Layout>
                    <Switch>
                        <Route exact path={'/'} component={Dashboard} />
                        <Route exact path={'/dashboard'} component={Dashboard} />
                        <Route exact path={'/monsters'} component={Monsters} />
                        <Route exact path={'/monsters/create'} component={MonstersForm} />

                        <Route exact path={'/minions'} component={Minions} />
                        <Route exact path={'/minions/create'} component={MinionsForm} />
                        <Route exact path={'/minions/edit'} component={MinionsForm} />
                        <Route exact path={'/withdraw-request'} component={WithdrawRequest} />
                        <Route exact path={'/fight-history'} component={FightHistory} />
                        <Route exact path={'/additional-reward'} component={AdditionaReward} />
                        <Route exact path={'/side-setting'} component={SideSetting} />
                        <Route exact path={'/add-probabilty'} component={ProbabiltyForm} />
                        <Route exact path={'/edit-probabilty'} component={ProbabiltyForm} />
                        <Route exact path={'/additional-reward/create'} component={AdditionaRewardForm} />
                        <Route exact path={'/additional-reward/edit'} component={AdditionaRewardForm} />
                        <Route path={'/forget-password'} component={ForgetPassword} />
                        {/* <Route path={'/register'} component={RegistrationPage} />
                            <Route path="/login" component={LoginPage} /> */}
                        <Route path="*" component={NotFound} />
                    </Switch>
                </Layout>
                : <Switch>
                    <Route path={'/register'} component={RegistrationPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path={'/'} component={LoginPage} />


                    {/* <Route path={'*'} render={() => (<Redirect to="/login" />)} /> */}
                    <Route path="*" component={NotFound} />
                </Switch>}
        </Router>
    )
}

export default MainRoutes;
