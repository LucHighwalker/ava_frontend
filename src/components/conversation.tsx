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
	lastMutation: any;
	selectionStart: number;
	selectionEnd: number;
};

type Mutation = {
	author: string;
	conversationId: string | undefined;
	data: {
		_index: number;
		length: number;
		text: string;
		type: "insert" | "delete";
	};
	origin: any;
};

class Conversation extends Component<any, State> {
	state: State = {
		user: "luc",
		socket: undefined,
		id: undefined,
		text: undefined,
		lastMutation: undefined,
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
		origin: undefined,
	};

	componentDidMount() {
		const { id } = this.props.match.params;
		this.setState({ id });

		fetch("http://localhost:3000/conversations/read/" + id)
			.then((res) => res.json())
			.then((res) =>
				this.setState({ text: res.text, lastMutation: res.lastMutation })
			);

		const socket = socketIOClient("http://localhost:3000", {
			path: "/socket",
		});
		socket.emit("message", "yaaaayyyy");
		socket.on(`mutationRecieved-${id}`, (data: any) => {
			console.log("Mutation for this convo received")
			console.log(data)
		})
		this.setState({
			socket,
		});
	}

	sendMutation() {
		console.log("sending mutation")
		this.state.socket.emit("mutation", this.currentMutation)
	}

	updateSelection() {
		if (typeof this.input === "object" && this.input !== null) {
			const { selectionStart, selectionEnd } = this.input;
			this.setState({
				selectionStart: selectionStart,
				selectionEnd: selectionEnd,
			});
		}
	}

	updateMutation(event: KeyboardEvent<HTMLTextAreaElement>) {
		const char =
			event.keyCode !== 13 ? String.fromCharCode(event.charCode) : "\n";

		if (this.currentMutation.conversationId === "")
			this.currentMutation.conversationId = this.state.id;
		this.currentMutation.data.text += char;
		this.currentMutation.data.length = this.currentMutation.data.text.length;
		this.currentMutation.data._index =
			this.state.selectionStart - this.currentMutation.data.text.length + 1;

		if (this.currentMutation.origin === undefined) {
			const { lastMutation } = this.state;
			this.currentMutation.origin = lastMutation.origin;
			if (this.currentMutation.origin[lastMutation.author] === undefined)
				this.currentMutation.origin[lastMutation.author] = 1;
			else this.currentMutation.origin[lastMutation.author]++;
		}

		if (this.currentMutation.data.text.length > 5) {
			this.sendMutation()
		}
	}

	render() {
		return (
			<div>
				<h1>{this.state.id}</h1>
				<textarea
					ref={(input) => (this.input = input)}
					value={this.state.text ? this.state.text : ""}
					onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
						this.updateSelection();
						this.setState({
							text: event.target.value,
						});
					}}
					onClick={(_: MouseEvent<HTMLTextAreaElement>) => {
						this.updateSelection();
					}}
					onKeyPress={(event: KeyboardEvent<HTMLTextAreaElement>) => {
						this.updateSelection();
						this.updateMutation(event);
					}}
					onKeyUp={(event) => console.log(event.keyCode)}
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
