import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Props } from "../interfaces";

import "./conversations.scss"

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
		fetch("https://safe-anchorage-85606.herokuapp.com/conversations")
			.then((res) => res.json())
			.then((res) => {
				this.setState({
					conversations: res.conversations,
				});
			});
	}

	createConversation() {
		fetch(`https://safe-anchorage-85606.herokuapp.com/conversations`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				creator: this.props.user,
			}),
		}).then((_) => this.getConversations());
	}

	deleteConversation(id: String) {
		fetch(`https://safe-anchorage-85606.herokuapp.com/conversations/${id}`, {
			method: "delete",
		}).then((_) => this.getConversations());
	}

	render() {
		const { conversations } = this.state;
		return (
			<div>
				<button onClick={() => this.createConversation()}>+</button>
				<ul className="conversationList">
					{conversations.map((convo: any, i: number) => (
						<li key={i}>
							<Link to={"/conversation/" + convo._id}>
								<span>id: {convo._id}</span>
								<span>created by: {convo.creator}</span>
							</Link>
							<button className="delete" onClick={() => this.deleteConversation(convo._id)}>
								delete
							</button>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
