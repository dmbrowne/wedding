import * as React from 'react'
import css from './login.scss'
import bootstrapCss from '../styles/admin.scss';
import withAdminLayout from '../components/adminLayout';
import cx from 'classnames';

class LoginScreen extends React.Component {
	static async getInitialProps({ req }) {
		return {
			loginError: (req && req.session && req.session.loginError ?
				req.session.loginError :
				{}
			)
		}
	}

	render() {
		return (
			<div className={css.loginContainer}>
				<h1>Admin area login</h1>
				<img className={css.logo} src="/assets/y&d-logo.png" />
				{!!this.props.loginError && (
					<div className={cx({
						[bootstrapCss['alert']]: true,
						[bootstrapCss['alert-danger']]: true,
					})}>
						{this.props.loginError}
					</div>
				)}
				<form method="POST" action="/admin/login">
					<div className={bootstrapCss['form-group']}>
						<input
							type="email"
							name="email"
							className={bootstrapCss['form-control']}
							placeholder="Enter email"
						/>
					</div>
					<div className={bootstrapCss['form-group']}>
						<input
							type="password"
							name="password"
							className={bootstrapCss['form-control']}
							placeholder="Password"
						/>
					</div>
					<button
						type="submit"
						className={cx({
							[bootstrapCss['btn']]: true,
							[bootstrapCss['btn-primary']]: true,
						})}
					>
						Submit
					</button>
				</form>
			</div>
		)
	}
}

export default LoginScreen;