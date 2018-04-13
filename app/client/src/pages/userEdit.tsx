import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import withModal, { ChildProps } from '../components/withModal';
import { updateUser, getUser, deleteUser } from '../api/user';
import CheckboxTable from '../components/CheckboxTable';
import { IUser } from '../../../server/types/models';

interface Props extends ChildProps {
	sessionUser: IUser;
	user: IUser;
}

class CreateUserPage extends React.Component<Props> {
	static getInitialProps = async ({ sessionUser, res, query }) => {
		const user = res && res.locals ?
			res.locals.user :
			await getUser(query.userId);
		return { sessionUser, user };
	}

	state = {
		email: '',
		firstName: '',
		lastName: '',
		role: '',
	};

	componentWillMount() {
		this.setState({
			email: this.props.user.email,
			firstName: this.props.user.firstName,
			lastName: this.props.user.lastName,
			role: this.props.user.role,
		});
	}

	onSubmit = () => {
		const { firstName, lastName, email, role } = this.state;
		return updateUser(this.props.user.id, {
			email,
			firstName,
			lastName,
			role,
		})
		.then(() => Router.push('/admin/users'))
		.catch(err => alert(JSON.stringify(err)));
	}

	onDelete() {
		const { firstName, lastName, id } = this.props.user;
		this.props.showConfirmModal({
			title: 'Are you sure',
			body: `Are you sure you want to delete ${firstName} ${lastName}. \
			This action is irreversable and data cannot be recovered in the case of an accident`,
		})
		.then(() => deleteUser(id))
		.catch(() => undefined);
	}

	render() {
		const userIsSessionUser = this.props.user.id === this.props.sessionUser.id;
		const { firstName, lastName, email, role } = this.state;
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
					{(!userIsSessionUser && this.props.sessionUser.role === 'admin') && (
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
				</form>
				<div className="uk-clearfix uk-margin-large">
					<button onClick={this.onSubmit} className="uk-button uk-button-primary uk-float-right">Save</button>
				</div>
				<div/>
			</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Users'}, CreateUserPage),
);
