import * as React from 'react';
import { withAdmin } from '../components/adminLayout';

const Account = () => (
	<div>
		<h1 className="uk-container">Your account</h1>
		<div className="uk-section">
			<div className="uk-container">
				<form className="uk-form-stacked">
					<div className="uk-margin">
						<label className="uk-form-label">Email</label>
						<div className="uk-form-controls">
							<input className="uk-input" type="email" />
						</div>
					</div>
					<div className="uk-margin">
						<div className="uk-form-label uk-text-muted">Username</div>
						<div className="uk-form-controls">
							<input className="uk-input" disabled={true} type="text" />
						</div>
					</div>
				</form>
			</div>
		</div>

		<section className="uk-section uk-section-muted">
			<div className="uk-container">
				<h3>Change your password</h3>
				<form className="uk-form-stacked uk-margin-top">
					<div className="uk-margin">
						<label className="uk-form-label">Password</label>
						<div className="uk-form-controls">
							<input className="uk-input" type="password" />
						</div>
					</div>
					<div className="uk-margin">
						<div className="uk-form-label">Confirm password</div>
						<div className="uk-form-controls">
							<input className="uk-input" type="password" />
						</div>
					</div>
				</form>
			</div>
		</section>
	</div>
);

Account.getInitialProps = async ({ req }) => {
	const user = req && req.session ?
		req.session.user :
		{};

	return { user };
};

export default withAdmin({title: 'Dashboard'}, Account);
