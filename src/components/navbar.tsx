import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Props } from "../interfaces";

import "./navbar.scss";

interface NavProps extends Props {
	changeUser: Function;
	returning: boolean;
}

type State = {
	hidden: boolean;
};

export default class Navbar extends Component<NavProps, State> {
	state: State = {
		hidden: false,
	};

	componentDidMount() {
		setTimeout(() => {
			this.setState({ hidden: true });
		}, 500);
	}

	render() {
		const { user } = this.props;
		const { hidden } = this.state;
		return (
			<div>
				<nav className={hidden ? "navBar hidden" : "navBar"}>
					<div className="user">
						<span onClick={() => this.props.changeUser()}>change user</span>
						<h3>Welcome{this.props.returning ? " back" : ""},</h3>
						<h3>{user}</h3>
					</div>
					<ul>
						<li>
							<Link to="/">
								<span>Home</span>
							</Link>
						</li>
						<li>
							<Link to="/conversation">
								<span>Conversation</span>
							</Link>
						</li>
					</ul>
					<div
						className={hidden ? "navButton" : "navButton open"}
						onClick={() => this.setState({ hidden: !hidden })}
					>
						<div className={hidden ? "bar1" : "bar1 open"} />
						<div className={hidden ? "bar2" : "bar2 open"} />
						<div className={hidden ? "bar3" : "bar3 open"} />
					</div>
				</nav>
				<div
					className={hidden ? "navOffClick hidden" : "navOffClick"}
					onClick={() => this.setState({ hidden: true })}
				></div>
			</div>
		);
	}
}
