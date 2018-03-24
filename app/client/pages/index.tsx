import * as React from 'react';

let UIkit;

class IndexPage extends React.Component {
	componentDidMount() {
		UIkit = require('uikit');
	}

	render() {
		return (
			<div>
				<h1>Index</h1>
				<div>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</div>
			</div>
		)
	}
}

export default IndexPage;
