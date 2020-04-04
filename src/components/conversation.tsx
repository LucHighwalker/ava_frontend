import React, { Component } from "react";
import { withRouter } from "react-router-dom";

type State = {
	user: string;
	id: string | undefined;
	text: string | undefined;
};

class Conversation extends Component<any, State> {
	state: State = {
		user: "luc",
		id: undefined,
		text: undefined,
	};

	constructor(props: any) {
		super(props);
	}

	componentDidMount() {
		const { id } = this.props.match.params;
		this.setState({ id });

		fetch("http://localhost:3000/conversations/read/" + id)
			.then((res) => res.json())
			.then((res) => this.setState({ text: res.text }));
	}

	render() {
		return (
			<div>
				<h1>{this.state.id}</h1>
				<textarea
					rows={5}
					cols={50}
					name="conversation"
					id={this.state.id}
					value={this.state.text}
				/>
			</div>
		);
	}
}

export default withRouter(Conversation);
