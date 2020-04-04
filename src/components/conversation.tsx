import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import socketIOClient from "socket.io-client";

type State = {
	user: string;
	socket: any;
	id: string | undefined;
	text: string | undefined;
	selectionStart: number;
	selectionEnd: number;
};

class Conversation extends Component<any, State> {
	state: State = {
		user: "luc",
		socket: undefined,
		id: undefined,
		text: undefined,
		selectionStart: 0,
		selectionEnd: 0,
	};

	input: any = null;

	componentDidMount() {
		const { id } = this.props.match.params;
		this.setState({ id });

		fetch("http://localhost:3000/conversations/read/" + id)
			.then((res) => res.json())
			.then((res) => this.setState({ text: res.text }));

		const socket = socketIOClient("http://localhost:3000", {
			path: "/socket",
		});
		this.setState({
			socket,
		});
		socket.emit("message", "yaaaayyyy");
	}

	render() {
		return (
			<div>
				<h1>{this.state.id}</h1>
				<textarea
					ref={(input) => (this.input = input)}
					value={this.state.text}
					onChange={(event) => {
						if (typeof this.input === "object" && this.input !== null) {
							const selectionStart = this.input.selectionStart;
							if (typeof selectionStart === "number") {
								this.setState({
									text: event.target.value,
									selectionStart: selectionStart,
									selectionEnd: selectionStart,
								});
								return;
							}
						}
						this.setState({ text: event.target.value });
					}}
					onClick={(event) => {
						if (typeof this.input === "object" && this.input !== null) {
							const selectionStart = this.input.selectionStart;
							const selectionEnd = this.input.selectionEnd;
							this.setState({
								selectionStart: selectionStart,
								selectionEnd: selectionEnd,
							});
						}
					}}
				/>
				<br />
				<span>selectionStart: {this.state.selectionStart}</span>
				<br />
				<span>selectionEnd: {this.state.selectionEnd}</span>
			</div>
		);
	}
}

export default withRouter(Conversation);
