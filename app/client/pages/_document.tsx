import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<title>Mr and Mrs Browne 2018</title>
					<link rel="stylesheet" href="/static/style.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
