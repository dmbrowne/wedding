import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default ({ children, title = 'This is the default title' }) => (
	<div>
		<Head>
			<title key="document-title">{title || 'Mr and Mrs Browne 2018'}</title>
			<script key="pace-js" src="/assets/pace.min.js" />
			<link rel="stylesheet" href="/assets/pace-theme-flash.css" key="pace-styleshet"/>
			<link key="base-styleshet" rel="stylesheet" href="/static/style.css"/>
			<meta key="metatag-viewport" name="viewport" content="width=device-width, initial-scale=1" />
		</Head>
		{children}
	</div>
);
