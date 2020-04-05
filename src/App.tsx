import React, { Component } from "react";
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

type State = {
	user: string;
};

export default class App extends Component<any, State> {
	state: State = {
		user: "",
	};

	componentDidMount() {
		if (this.state.user === "") {
			const user = window.prompt("What is your name?", "Anonymous");
			if (user)
				this.setState({
					user,
				});
		}
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<Router>
						<Navbar user={this.state.user}></Navbar>

						<Route
							path="/"
							exact
							render={(props: RouteComponentProps<any>) => (
								<Home
									{...props}
									user={this.state.user}
									message="This is home"
								/>
							)}
						/>
						<Route
							path="/conversation"
							exact
							render={(props: RouteComponentProps<any>) => (
								<Conversations {...props} user={this.state.user} />
							)}
						/>
						<Route
							path="/conversation/:id"
							render={(props: RouteComponentProps<any>) => (
								<Conversation {...props} user={this.state.user} />
							)}
						/>
					</Router>
				</header>
			</div>
		);
	}
}
