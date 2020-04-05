import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Route,
	RouteComponentProps,
} from "react-router-dom";
import { withCookies, ReactCookieProps } from "react-cookie";

import "./App.scss";

import Home from "./components/home";
import Navbar from "./components/navbar";
import Conversations from "./components/conversations";
import Conversation from "./components/conversation";

type State = {
	user: string;
	returning: boolean;
};

class App extends Component<ReactCookieProps, State> {
	state: State = {
		user: "Anonymous",
		returning: false,
	};

	componentDidMount() {
		const { cookies } = this.props;
		if (this.state.user === "Anonymous") {
			const user = cookies?.get("fecolab_user");
			if (user) this.setState({ user, returning: true });
			else this.askName();
		}
	}

	askName() {
		const { cookies } = this.props;
		const user = window.prompt("What is your name?", "Anonymous");
		if (user) {
			cookies?.set("fecolab_user", user);
			this.setState({
				user,
			});
		}
	}

	render() {
		const { cookies } = this.props;
		const { user, returning } = this.state;
		return (
			<div className="App">
				<header className="App-header">
					<Router>
						<Navbar
							user={user}
							changeUser={() => this.askName()}
							returning={returning}
						></Navbar>

						<Route
							path="/"
							exact
							render={(props: RouteComponentProps<any>) => (
								<Home {...props} user={user} returning={returning} />
							)}
						/>
						<Route
							path="/conversation"
							exact
							render={(props: RouteComponentProps<any>) => (
								<Conversations {...props} cookies={cookies} user={user} />
							)}
						/>
						<Route
							path="/conversation/:id"
							render={(props: RouteComponentProps<any>) => (
								<Conversation {...props} cookies={cookies} user={user} />
							)}
						/>
					</Router>
				</header>
			</div>
		);
	}
}

export default withCookies(App);
