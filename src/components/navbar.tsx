import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Props } from "../interfaces";

import "./navbar.scss";

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
		const { user } = this.props;
		const { hidden } = this.state;
		return (
			<div>
				<nav className={hidden ? "navBar hidden" : "navBar"}>
					<h3>{user}</h3>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/conversation">Conversations</Link>
						</li>
					</ul>
					<div
						className={hidden ? "navButton" : "navButton open"}
						onClick={() => this.setState({ hidden: !hidden })}
					>
						<div className={hidden ? "bar1" : "bar1 open"}></div>
						<div className={hidden ? "bar2" : "bar2 open"}></div>
						<div className={hidden ? "bar3" : "bar3 open"}></div>
					</div>
					{/* <button
						className="navButton"
						onClick={() => this.setState({ hidden: !hidden })}
					></button> */}
				</nav>
				<div
					className={hidden ? "navOffClick hidden" : "navOffClick"}
					onClick={() => this.setState({ hidden: true })}
				></div>
			</div>
		);
	}
}
