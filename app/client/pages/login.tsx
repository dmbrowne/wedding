import * as React from 'react';
import './login.scss';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

class LoginScreen extends React.Component {
	static async getInitialProps({ req }) {
		return {
			loginError: (req && req.session && req.session.loginError ?
				req.session.loginError :
				{}
			)
		}
	}

	errorAlert = () => {
		return (
			<div className="uk-alert-danger uk-margin">
				{/* {this.props.loginError} */}
			</div>
		);
	}

	render() {
		return (
			<AppLayout>
				<div className="loginContainer">
					<Head>
						<title key="document-title">Login - Mr and Mrs Browne 2018</title>
						<link
							key="uikit-stylesheet"
							rel="stylesheet"
							href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.min.css"
						/>
					</Head>
					<header>
						<h2 className="uk-text-muted">Admin area</h2>
						<h1>Login</h1>
					</header>
					<img className="logo" src="/assets/y&d-logo.png" />
					{!!this.props.loginError && this.errorAlert()}
					<form method="POST" action="/login">
						<div className="uk-margin">
							<input
								type="text"
								name="username"
								className="uk-input"
								placeholder="Enter username"
							/>
						</div>
						<div className="uk-margin">
							<input
								type="password"
								name="password"
								className="uk-input"
								placeholder="Password"
							/>
						</div>
						<button
							type="submit"
							className="uk-button uk-button-primary"
						>
							Submit
						</button>
					</form>
				</div>
			</AppLayout>
		);
	}
}

export default LoginScreen;
