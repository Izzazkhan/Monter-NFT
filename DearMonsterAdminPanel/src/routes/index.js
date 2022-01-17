
import { useState } from 'react'
import Layout from '../layout/MainLayout'
import Monsters from '../pages/monsters/index'
import Dashboard from '../pages/Dashboard/index'
import MonstersForm from '../pages/monsters/form'
import Minions from '../pages/minions/index'
import MinionsForm from '../pages/minions/form'
import NotFound from '../components/NotFound'
import RegistrationPage from '../pages/Authentication/Registeration'
import LoginPage from '../pages/Authentication/Login'
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
                        {/* <Route path={'/register'} component={RegistrationPage} />
                            <Route path="/login" component={LoginPage} /> */}
                        <Route path="*" component={NotFound} />
                    </Switch>
                </Layout>
                : <Switch>
                    <Route path={'/register'} component={RegistrationPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="*" component={NotFound} />
                </Switch>}
        </Router>
    )
}

export default MainRoutes;
