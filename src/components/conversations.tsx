import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { Props } from "../interfaces";

import "./conversations.scss";

type State = {
	conversations: object[];
	favorites: any;
};

export default class Conversations extends Component<Props, State> {
	state: State = {
		conversations: [],
		favorites: {},
	};

	componentDidMount() {
		const { cookies } = this.props;
		const favorites = cookies?.get("fecolab_favorites");

		if (favorites) this.setState({ favorites });

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

	favoriteConversation(id: string) {
		const { cookies } = this.props;
		const { favorites } = this.state;

		favorites[id] ? (favorites[id] = !favorites[id]) : (favorites[id] = true);

		cookies?.set("fecolab_favorites", favorites);
		this.setState({ favorites });
	}

	render() {
		const { conversations, favorites } = this.state;
		return (
			<div className="conversationList">
				<Button
					className="add"
					variant="success"
					onClick={() => this.createConversation()}
				>
					New Conversation
				</Button>
				<ul>
					{conversations.reverse().map((convo: any, i: number) => (
						<li className={favorites[convo._id] ? "favorited" : ""} key={i}>
							<Link to={"/conversation/" + convo._id}>
								<h2>Conversation #:{conversations.length - i}</h2>
								<span className="created">created by: {convo.creator}</span>
								<br />
								<span className="id">id: {convo._id}</span>
							</Link>
							<Button
								className="delete"
								variant="danger"
								onClick={() => this.deleteConversation(convo._id)}
							>
								delete
							</Button>
							<Button
								className="favorite"
								variant={favorites[convo._id] ? "primary" : "warning"}
								onClick={() => this.favoriteConversation(convo._id)}
							>
								{favorites[convo._id] ? "unfavorite" : "favorite"}
							</Button>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
