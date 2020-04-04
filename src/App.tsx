import React from "react";
import {
	BrowserRouter as Router,
	Route,
	RouteComponentProps,
} from "react-router-dom";

import "./App.scss";

import Home from "./components/home";
import Navbar from "./components/navbar";
import Conversations from "./components/conversations";
import Conversation from "./components/conversation";

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
					<Route
						path="/conversation"
						exact
						render={(props: RouteComponentProps<any>) => (
							<Conversations {...props} user="luc" />
						)}
					/>
					<Route
						path="/conversation/:id"
						render={(props: RouteComponentProps<any>) => (
							<Conversation {...props} user="luc" />
						)}
					/>
				</Router>
			</header>
		</div>
	);
}

export default App;
