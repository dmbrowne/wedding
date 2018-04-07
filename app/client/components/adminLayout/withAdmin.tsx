import * as React from 'react';
import AdminLayout, { Props as AdminLayoutProps } from './AdminLayout';
import Head from 'next/head';
import { NextComponent } from '../../types/next';
import '../../styles/admin.scss';
import { getUserAccount } from '../../api/account';

interface Props {
	sessionUser: {
		firstName: string;
		lastName: string;
	};
}

export default (adminLayoutOptions: AdminLayoutProps, Component: NextComponent) => {
	return class WithAdminHOC extends React.Component<Props> {
		static async getInitialProps(props) {
			let user = props.req && props.req.session.user;
			if (!user) {
				user = await getUserAccount();
			}
			return (Component.getInitialProps ?
				{
					...await Component.getInitialProps({...props, sessionUser: user}),
					sessionUser: user,
				} :
				{ sessionUser: user }
			);
		}

		logoutForm: HTMLFormElement = null;

		logout = () => {
			this.logoutForm.submit();
		}

		render() {
			const { firstName, lastName } = this.props.sessionUser;
			return (
				<AdminLayout firstName={firstName} lastName={lastName} onLogout={this.logout} {...adminLayoutOptions}>
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
					<form method="POST" action="/logout" ref={ref => this.logoutForm = ref} />
				</AdminLayout>
			);
		}
	};
};
