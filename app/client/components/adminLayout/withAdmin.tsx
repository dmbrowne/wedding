import * as React from 'react';
import AdminLayout, { Props as AdminLayoutProps } from './AdminLayout';
import Head from 'next/head';
import { NextComponent } from '../../types/next';

export default (adminLayoutOptions: AdminLayoutProps, Component: NextComponent) => {
	return class WithAdminHOC extends React.Component {
		static async getInitialProps(props) {
			return (Component.getInitialProps ?
				Component.getInitialProps(props) :
				{}
			);
		}

		render() {
			return (
				<AdminLayout {...adminLayoutOptions}>
					<Head>
						<title key="document-title">Mr and Mrs Browne 2018</title>
						<link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" key="material-icons" />
						<link
							rel="stylesheet"
							href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.min.css"
							key="uikit-stylesheet"
						/>
						<script src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/js/uikit.min.js" />
					</Head>
					<Component {...this.props} />
				</AdminLayout>
			);
		}
	};
};
