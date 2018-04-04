import * as React from 'react';
import './login.scss';
import Head from 'next/head';

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
			<div className="loginContainer">
				<Head>
					<title key="document-title">Login - Mr and Mrs Browne 2018</title>
					<link
						rel="stylesheet"
						href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.min.css"
						key="uikit-stylesheet"
					/>
				</Head>
				<h1>Admin area login</h1>
				<img className="logo" src="/assets/y&d-logo.png" />
				{!!this.props.loginError && this.errorAlert()}
				<form method="POST" action="/login">
					<div className="uk-margin">
						<input
							type="email"
							name="email"
							className="uk-input"
							placeholder="Enter email"
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
		);
	}
}

export default LoginScreen;
