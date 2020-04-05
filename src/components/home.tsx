import React from "react";

import { Props } from "../interfaces";

export default function Home(props: Props) {
	return (
		<div>
			<p>{props.user}</p>
		</div>
	);
}
