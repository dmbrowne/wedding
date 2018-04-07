import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import { createNewUser } from '../api/user';
import CheckboxTable from '../components/CheckboxTable';
import { IUser } from '../../server/types/models';

interface Props {
	sessionUser: IUser;
}

class CreateUserPage extends React.Component<Props> {
	static getInitialProps = async ({ sessionUser }) => {
		return { sessionUser };
	}

	state = {
		email: '',
		firstName: '',
		lastName: '',
		password: '',
		confirmPassword: '',
		role: 'user',
	};

	onSubmit = () => {
		const { firstName, lastName, email, password, role } = this.state;
		return createNewUser({
			email,
			password,
			firstName,
			lastName,
			role,
		})
		.then(() => Router.push('/admin/users'))
		.catch(err => alert(JSON.stringify(err)));
	}

	render() {
		const { firstName, lastName, email, password, confirmPassword, role } = this.state;
		return (
			<div className="uk-container">
				<h2>Create a new user</h2>
				<form className="uk-form uk-form-stacked">
					<div className="uk-margin">
						<label className="uk-form-label">First name</label>
						<div className="uk-form-controls">
							<input
								className="uk-input"
								type="text"
								value={firstName}
								onChange={e => this.setState({ firstName: e.target.value })}
							/>
						</div>
					</div>
					<div className="uk-margin">
						<label className="uk-form-label">Last name</label>
						<div className="uk-form-controls">
							<input
								className="uk-input"
								type="text"
								value={lastName}
								onChange={e => this.setState({ lastName: e.target.value })}
							/>
						</div>
					</div>
					<div className="uk-margin">
						<label className="uk-form-label">Email</label>
						<div className="uk-form-controls">
							<input
								className="uk-input"
								type="email"
								value={email}
								onChange={e => this.setState({ email: e.target.value })}
							/>
						</div>
					</div>
					{this.props.sessionUser.role === 'admin' && (
						<div className="uk-margin uk-grid-small">
							<div><label className="uk-form-label">Role</label></div>
							<label>
								<input
									onChange={() => this.setState({ role: 'user' })}
									className="uk-radio"
									type="radio"
									value="user"
									checked={role === 'user'}
								/> User
							</label>
							<label>
								<input
									onChange={() => this.setState({ role: 'admin' })}
									className="uk-radio"
									type="radio"
									value="admin"
									checked={role === 'admin'}
								/> Admin
							</label>
						</div>
					)}
					<div className="uk-margin">
						<label className="uk-form-label">Password</label>
						<div className="uk-form-controls">
							<input
								className="uk-input"
								type="password"
								value={password}
								onChange={e => this.setState({ password: e.target.value })}
							/>
						</div>
					</div>
					<div className="uk-margin">
						<label className="uk-form-label">Confirm password</label>
						<div className="uk-form-controls">
							<input
								className="uk-input"
								type="password"
								value={confirmPassword}
								onChange={e => this.setState({ confirmPassword: e.target.value })}
							/>
						</div>
					</div>
				</form>
				<div className="uk-clearfix uk-margin-large">
					<button onClick={this.onSubmit} className="uk-button uk-button-primary uk-float-right">Create</button>
				</div>
				<div/>
			</div>
		);
	}
}

export default withAdmin({ title: 'Users'}, CreateUserPage);
