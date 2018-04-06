import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<title key="document-title">Mr and Mrs Browne 2018</title>
					<script src="/assets/pace.min.js" />
					<link rel="stylesheet" href="/static/style.css" key="base-styleshet"/>
					<link rel="stylesheet" href="/assets/pace-theme-flash.css" key="pace-styleshet"/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
