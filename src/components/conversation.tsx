import React, {
	Component,
	ChangeEvent,
	MouseEvent,
	KeyboardEvent,
} from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import socketIOClient from "socket.io-client";

import "./conversation.scss";

// interface Props extends RouteComponentProps {
// 	user: string;
// }

type State = {
	socket: any;
	id: string | undefined;
	text: string;
	lastMutation: any;
	selectionStart: number;
	selectionEnd: number;
	highlightOffset: number;
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
		socket: undefined,
		id: undefined,
		text: "",
		lastMutation: undefined,
		selectionStart: 0,
		selectionEnd: 0,
		highlightOffset: 0,
	};

	input: any = null;

	currentMutation: Mutation = {
		author: "",
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
		this.resetMutation();

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
			author: this.props.user,
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
			if (this.currentMutation.conversationId === undefined)
				this.currentMutation.conversationId = this.state.id;

			this.state.socket.emit("mutation", this.currentMutation);
			this.resetMutation();
			this.setState({
				highlightOffset: 0,
			});
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

		this.updateOrigin();

		this.currentMutation.data.text += char;
		this.currentMutation.data.length = this.currentMutation.data.text.length;
		this.currentMutation.data._index =
			this.state.selectionStart - this.currentMutation.data.text.length + 1;

		if (
			this.state.lastMutation !== undefined &&
			this.currentMutation.data._index < this.state.lastMutation.data._index
		) {
			this.setState({
				highlightOffset: this.state.highlightOffset + 1,
			});
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

		this.updateOrigin();

		this.currentMutation.data._index = this.state.selectionStart;

		this.currentMutation.data.length += 1;
	}

	updateOrigin() {
		if (this.state.lastMutation === undefined) {
			this.currentMutation.origin = {};
			this.currentMutation.origin[this.props.user] = 0;
		}

		if (this.currentMutation.origin === undefined) {
			this.currentMutation.origin = {};
			const { lastMutation } = this.state;
			Object.keys(lastMutation.origin).forEach((key: string) => {
				this.currentMutation.origin[key] = lastMutation.origin[key];
			});
			if (this.currentMutation.origin[lastMutation.author] === undefined)
				this.currentMutation.origin[lastMutation.author] = 1;
			else this.currentMutation.origin[lastMutation.author]++;
		}
	}

	highlightLastMutation() {
		const { text, lastMutation, highlightOffset } = this.state;
		if (lastMutation !== undefined) {
			const stringLeft = text.slice(
				0,
				lastMutation.data._index + highlightOffset
			);
			const stringRight = text.slice(
				lastMutation.data._index + lastMutation.data.length + highlightOffset
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
				<h3>{this.state.id}</h3>
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
					onKeyUp={(event: KeyboardEvent<HTMLTextAreaElement>) => {
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
