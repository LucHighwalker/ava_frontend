import React, { Component } from "react";

type Props = {
	message: string;
};

type State = {
	user: string;
};

export default class Home extends Component<Props, State> {
	state: State = {
		user: "luc",
	};

	render() {
		return (<div>
      <p>{this.props.message}</p>
      <p>{this.state.user}</p>
    </div>);
	}
}
