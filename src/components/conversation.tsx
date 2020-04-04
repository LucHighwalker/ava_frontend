import React, {
	Component,
	ChangeEvent,
	MouseEvent,
	KeyboardEvent,
} from "react";
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

type Mutation = {
	author: string;
	conversationId: string;
	data: {
		_index: number;
		length: number;
		text: string;
		type: "insert" | "delete";
	};
	origin: {
		Alice: number;
		Bob: number;
	};
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
	currentMutation: Mutation = {
		author: "Bob",
		conversationId: "",
		data: {
			_index: 0,
			length: 0,
			text: "",
			type: "insert",
		},
		origin: {
			Alice: 0,
			Bob: 0,
		},
	};

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

	updateMutation(event: KeyboardEvent<HTMLTextAreaElement>) {
		const char = String.fromCharCode(event.charCode);
		this.currentMutation.data.text += char;
		this.currentMutation.data.length = this.currentMutation.data.text.length;
		this.currentMutation.data._index =
			this.state.selectionStart - this.currentMutation.data.text.length;

		console.log(this.currentMutation)
	}

	render() {
		return (
			<div>
				<h1>{this.state.id}</h1>
				<textarea
					ref={(input) => (this.input = input)}
					value={this.state.text ? this.state.text : ""}
					onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
						if (typeof this.input === "object" && this.input !== null) {
							const { selectionStart } = this.input;
							if (typeof selectionStart === "number") {
								this.setState({
									text: event.target.value,
									selectionStart: selectionStart,
									selectionEnd: selectionStart,
								});
								return;
							}
						}
					}}
					onClick={(_: MouseEvent<HTMLTextAreaElement>) => {
						if (typeof this.input === "object" && this.input !== null) {
							const {selectionStart, selectionEnd} = this.input;
							this.setState({
								selectionStart: selectionStart,
								selectionEnd: selectionEnd,
							});
						}
					}}
					onKeyPress={(event: KeyboardEvent<HTMLTextAreaElement>) =>
						this.updateMutation(event)
					}
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
