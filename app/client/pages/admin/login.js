import css from './login.scss'
import bootstrapCss from '../../styles/admin.scss';
import withAdminLayout from '../../components/adminLayout';
import cx from 'classnames';

const LoginScreen = () => (
	<div className={css.loginContainer}>
		<h1>Admin area login</h1>
		<img className={css.logo} src="/assets/y&d-logo.png" />
		<form>
			<div className={bootstrapCss['form-group']}>
				<input
					type="email"
					className={bootstrapCss['form-control']}
					placeholder="Enter email"
				/>
			</div>
			<div className={bootstrapCss['form-group']}>
				<input
					type="password"
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

LoginScreen.getInitialProps = async () => ({
})

export default withAdminLayout(LoginScreen);