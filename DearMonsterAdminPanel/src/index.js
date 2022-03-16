import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/index'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from "redux-thunk";
import MonsterReducer from './redux/monsters/reducer'
import MinionsReducer from './redux/minions/reducer'
import WithdrawRequestReducer from './redux/withdrawRequest/reducer'
import BonusReducer from './redux/bonus/reducer'
import AuthReducer from './redux/WalletAuth/reducer'
import ProbabilityReducer from './redux/probabilty/reducer'
import FightHistoryReducer from './redux/fightHistory/reducer'
import RewardByWalletReducer from './redux/rewardByWallet/reducer'
import CrystalShardReducer from './redux/crystalShard/reducer'

import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
const rootReducer = combineReducers({
  MonsterReducer,
  MinionsReducer,
  WithdrawRequestReducer,
  BonusReducer,
  AuthReducer,
  ProbabilityReducer,
  FightHistoryReducer,
  RewardByWalletReducer,
  CrystalShardReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();