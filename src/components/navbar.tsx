import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./navbar.scss";

type Props = {
	user: string;
};

type State = {
	user: string;
	hidden: boolean;
};

export default class Navbar extends Component<Props, State> {
	state: State = {
		user: "luc",
		hidden: true,
	};

	render() {
		return (
			<nav className={this.state.hidden ? "navbar hidden" : "navbar"}>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/conversation">Conversations</Link>
					</li>
				</ul>
				<button
					className="navButton"
					onClick={() => this.setState({ hidden: !this.state.hidden })}
				></button>
			</nav>
		);
	}
}
