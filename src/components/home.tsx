import React from "react";

type Props = {
	user: string;
	message: string;
};

export default function Home(props: Props) {
	return (
		<div>
			<p>{props.message}</p>
			<p>{props.user}</p>
		</div>
	);
}
