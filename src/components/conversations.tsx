import React, { Component } from "react";
import { Link } from "react-router-dom";

type Props = {
	user: string;
};

type State = {
	conversations: object[];
};

export default class Conversations extends Component<Props, State> {
	state: State = {
		conversations: [],
	};

	componentDidMount() {
		this.getConversations();
	}

	getConversations() {
		fetch("http://localhost:3000/conversations")
			.then((res) => res.json())
			.then((res) => {
				this.setState({
					conversations: res.conversations,
				});
			});
	}

	deleteConvo(id: String) {
		fetch(`http://localhost:3000/conversations/${id}`, {
			method: "delete",
		})
			.then((res) => res.json())
			.then((_) => this.getConversations());
	}

	render() {
		const { conversations } = this.state;
		return (
			<div>
				<ul>
					{conversations.map((convo: any, i: number) => (
						<li key={i}>
							<Link to={"/conversation/" + convo._id}>
								<span>id: {convo._id}</span>
								<span>created by: {convo.creator}</span>
							</Link>
							<button onClick={() => this.deleteConvo(convo._id)}>
								delete
							</button>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
