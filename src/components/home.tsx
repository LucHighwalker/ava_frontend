import React, { Component } from "react";

import { Props } from "../interfaces";

import "./home.scss";

interface HomeProps extends Props {
	returning: boolean;
}

type State = {
	info: {
		author: {
			email: string;
			name: string;
		};
		frontend: {
			url: string;
		};
		language: string;
		sources: {
			backend: string;
			frontend: string;
		};
		answers: {
			1: string;
			2: string;
			3: string;
		};
	} | null;
};

export default class Home extends Component<HomeProps, State> {
	state: State = {
		info: null,
	};
	componentDidMount() {
		fetch("https://safe-anchorage-85606.herokuapp.com/info")
			.then((res) => res.json())
			.then((res) => this.setState({ info: { ...res } }));
	}

	render() {
		const { info } = this.state;
		return (
			<div className="home">
				<p>
					Welcome{this.props.returning ? " back" : ""}, {this.props.user}
				</p>
				<br />
				{info ? (
					<div>
						<p>
							This site was written in React and {info?.language} by:{" "}
							{info?.author.name}
						</p>
						<p>
							If you have any questions or comments, my email is:{" "}
							<a href={"email:" + info?.author.email}>{info?.author.email}</a>
						</p>
						<br />
						<p>The source code is available on github:</p>
						<p>
							backend:{" "}
							<a href={info?.sources.backend}>{info?.sources.backend}</a>
						</p>
						<p>
							frontend:{" "}
							<a href={info?.sources.frontend}>{info?.sources.frontend}</a>
						</p>
						<br />
						<h1>Answers:</h1>
						<h2>1. How did you approach the problem?</h2>
						<p>{info?.answers["1"]}</p>
						<br />
						<h2>2. What would you add if you have more time?</h2>
						<p>{info?.answers["2"]}</p>
						<br />
						<h2>
							3. What would you remove / add in the challenge if you were in the
							hiring side?
						</h2>
						<p>{info?.answers["3"]}</p>
					</div>
				) : (
					<div>
						<img src="/tenor.gif"></img>
						<p>Server is loading...</p>
					</div>
				)}
			</div>
		);
	}
}
