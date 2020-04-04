import React, {
	Component,
	ChangeEvent,
	MouseEvent,
	KeyboardEvent,
} from "react";
import { withRouter } from "react-router-dom";
import socketIOClient from "socket.io-client";

import "./conversation.scss";

type State = {
	user: string;
	socket: any;
	id: string | undefined;
	text: string;
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
		text: "",
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

	constructor(props: any) {
		super(props);

		this.highlightLastMutation = this.highlightLastMutation.bind(this);
	}

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
		socket.on(`mutationRecieved-${id}`, (lastMutation: any) => {
			console.log("new mutation received", lastMutation);
			this.setState({
				lastMutation,
			});
		});
		this.setState({
			socket,
		});
	}

	resetMutation() {
		this.currentMutation = {
			author: "Bob",
			conversationId: this.state.id,
			data: {
				_index: 0,
				length: 0,
				text: "",
				type: "insert",
			},
			origin: undefined,
		};
	}

	sendMutation() {
		if (
			this.currentMutation.data.length > 0 ||
			this.currentMutation.data.type === "delete"
		) {
			console.log("sending mutation");
			this.state.socket.emit("mutation", this.currentMutation);
			this.resetMutation();
		}
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

	insertMutation(event: KeyboardEvent<HTMLTextAreaElement>) {
		const char =
			event.keyCode !== 13 ? String.fromCharCode(event.charCode) : "\n";

		if (this.currentMutation.conversationId === "")
			this.currentMutation.conversationId = this.state.id;

		if (this.currentMutation.data.type === "delete") {
			this.sendMutation();
		}

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

		if (this.currentMutation.data.length > 20) {
			this.sendMutation();
		}
	}

	deleteMutation() {
		if (this.currentMutation.conversationId === "")
			this.currentMutation.conversationId = this.state.id;

		if (this.currentMutation.data.type === "insert") {
			if (this.currentMutation.data.length > 0) this.sendMutation();

			this.currentMutation.data.type = "delete";
		}

		if (this.currentMutation.origin === undefined) {
			const { lastMutation } = this.state;
			this.currentMutation.origin = lastMutation.origin;
			if (this.currentMutation.origin[lastMutation.author] === undefined)
				this.currentMutation.origin[lastMutation.author] = 1;
			else this.currentMutation.origin[lastMutation.author]++;
		}

		this.currentMutation.data._index = this.state.selectionStart;

		this.currentMutation.data.length += 1;
		console.log(this.currentMutation);
	}

	highlightLastMutation() {
		const { text, lastMutation } = this.state;
		if (lastMutation !== undefined) {
			const stringLeft = text.slice(0, lastMutation.data._index);
			const stringRight = text.slice(
				lastMutation.data._index + lastMutation.data.length
			);
			const stringHighlight = lastMutation.data.text;

			const array = [stringLeft, stringHighlight, stringRight];

			return array.map((elem, i) => {
				return (
					<span key={i} className={i === 1 ? "highlighted" : ""}>
						{elem}
					</span>
				);
			});
		}
	}

	render() {
		return (
			<div className="textBox">
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
						this.sendMutation();
						this.updateSelection();
					}}
					onKeyPress={(event: KeyboardEvent<HTMLTextAreaElement>) => {
						this.updateSelection();
						this.insertMutation(event);
					}}
					onKeyUp={(event) => {
						if (event.keyCode === 8) {
							this.deleteMutation();
						}
					}}
				/>
				<div className="highlightBox">
					<div className="highlights">{this.highlightLastMutation()}</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Conversation);
