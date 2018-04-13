import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import { getUserAccount, updateAccount, changePassword } from '../api/account';
import { IUser } from '../../../server/types/models';

interface Props {
	user: IUser;
}

interface State extends IUser {
	email: string;
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

class Account extends React.Component<Props, State> {
	static getInitialProps = async ({ req }) => {
		const user = req && req.session ?
			req.session.user :
			await getUserAccount();
		return { user };
	}

	componentWillMount() {
		this.setState({
			...this.props.user,
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		});
	}

	refresh() {
		getUserAccount()
			.then(user => this.setState({
				...this.props.user,
			}))
			.catch(e => alert('There was an error while refreshing the data'));
	}

	onUpdatePasswordField = (e: React.ChangeEvent<HTMLInputElement>, passwordType: 'current' | 'new' | 'confirm') => {
		switch (passwordType) {
			case 'current':
				return this.setState({ currentPassword: e.target.value });
			case 'new':
				return this.setState({ newPassword: e.target.value });
			case 'confirm':
				return this.setState({ confirmNewPassword: e.target.value });
			default:
				throw Error("passwordType must be one of 'current', 'new', 'confirm'");
		}
	}

	updateEmail = (e) => {
		this.setState({ email: e.target.value });
	}

	saveAccountDetails = () => {
		updateAccount({email: this.state.email})
			.then((res) => {
				alert('saved');
				this.refresh();
			})
			.catch(err => {
				alert('There was an error updating your account');
				console.error(err);
			});
	}

	saveNewPassword = () => {
		const { newPassword, currentPassword } = this.state;
		if (newPassword !== this.state.confirmNewPassword) {
			return alert('confirmed password does not match');
		}
		changePassword({ newPassword, currentPassword })
			.then(res => alert('saved'))
			.catch(err => {
				alert('Oops, something went wrong with updating the password');
				console.error(err)
			});
	}

	render() {
		const { email, username, currentPassword, newPassword, confirmNewPassword } = this.state;

		return (
			<div>
				<h1 className="uk-container">Your account</h1>
				<div className="uk-section">
					<div className="uk-container">
						<form className="uk-form-stacked">
							<div className="uk-margin">
								<label className="uk-form-label">Email</label>
								<div className="uk-form-controls">
									<input className="uk-input" value={email} type="email" onChange={this.updateEmail}/>
								</div>
							</div>
							<div className="uk-margin">
								<div className="uk-form-label uk-text-muted">Username</div>
								<div className="uk-form-controls">
									<input className="uk-input" disabled={true} value={username} type="text" />
								</div>
							</div>
						</form>
						<div className="uk-clearfix uk-margin-top">
							<button
								onClick={this.saveAccountDetails}
								className="uk-button uk-button-primary uk-float-right"
							>
								Save account details
							</button>
						</div>
					</div>
				</div>

				<section className="uk-section uk-section-muted">
					<div className="uk-container">
						<h3>Change your password</h3>
						<form className="uk-form-stacked uk-margin-top">
							<div className="uk-margin">
								<label className="uk-form-label">Current password</label>
								<div className="uk-form-controls">
									<input
										className="uk-input"
										type="password"
										value={currentPassword}
										onChange={e => this.onUpdatePasswordField(e, 'current')}
									/>
								</div>
							</div>
							<div className="uk-margin">
								<label className="uk-form-label">Password</label>
								<div className="uk-form-controls">
									<input
										className="uk-input"
										type="password"
										value={newPassword}
										onChange={e => this.onUpdatePasswordField(e, 'new')}
									/>
								</div>
							</div>
							<div className="uk-margin">
								<div className="uk-form-label">Confirm password</div>
								<div className="uk-form-controls">
									<input
										className="uk-input"
										type="password"
										value={confirmNewPassword}
										onChange={e => this.onUpdatePasswordField(e, 'confirm')}
									/>
								</div>
							</div>
						</form>
						<div className="uk-clearfix uk-margin-top">
							<button
								onClick={this.saveNewPassword}
								className="uk-button uk-button-danger uk-float-right"
							>
								Change password
							</button>
						</div>
					</div>
				</section>
			</div>
		);
	}
}

export default withAdmin({title: 'Account'}, Account);
