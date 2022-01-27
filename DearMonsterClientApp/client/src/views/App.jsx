import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Routes } from '../routes'
import Header from '../components/common/Header'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
// import "../../src/style.css";

import { Oval } from 'react-loader-spinner';

const loaderParentStyle = {
	display: "flex",
	top: "0",
	position: "fixed",
	alignItems: "center",
	justifyContent: "center",
	width: "100%",
	height: "100%",
	left: "0",
	background: "#686868e0",
	zIndex: "99999",
}
const loaderStyle = {
	alignItems: "center",
	justifyContent: "center",
	display: "flex",
	flexDirection: "column"
}
const textStyle = {
	fontSize: "25px",
	color: "orange",
	fontWeight: "bold"
}


const App = () => {
	const { loading } = useSelector((state) => state.auth);

	return (
		<div className=''>
			{
				loading ?
					<div style={loaderParentStyle} className='loader-div'>
						<div style={loaderStyle}>
							<Oval color='orange' ariaLabel='loading' />
							<p style={textStyle} > Please wait for the Metamask transaction to be completed </p>
						</div>
					</div>
					:
					''
			}
			<Header />
			<Switch>
				{Routes.map((route, idx) => (
					<Route
						key={idx}
						exact={route.exact}
						path={route.path}
						component={route.component}
					/>
				))}
			</Switch>
		</div>
	);
}

export default App
