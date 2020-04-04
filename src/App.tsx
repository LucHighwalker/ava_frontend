import React from "react";
import {
	BrowserRouter as Router,
	Route,
	RouteComponentProps,
} from "react-router-dom";

import "./App.scss";

import Home from "./components/home";
import Navbar from "./components/navbar";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Router>
					<Navbar user="luc"></Navbar>

					<Route
						path="/"
						exact
						render={(props: RouteComponentProps<any>) => (
							<Home {...props} message="This is home" />
						)}
					/>
				</Router>
			</header>
		</div>
	);
}

export default App;
