import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./navbar.scss";

type Props = {
	user: string;
};

type State = {
	hidden: boolean;
};

export default class Navbar extends Component<Props, State> {
	state: State = {
		hidden: true,
	};

	componentDidMount() {
		setTimeout(() => {
			this.setState({ hidden: false });
		}, 250);
	}

	render() {
		return (
			<div>
				<nav className={this.state.hidden ? "navbar hidden" : "navbar"}>
					<h3>{this.props.user}</h3>
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
				<div
					className={this.state.hidden ? "navOffClick hidden" : "navOffClick"}
					onClick={() => this.setState({ hidden: true })}
				></div>
			</div>
		);
	}
}
