import React from 'react';
import Link from 'next/link';
import { withAdmin } from '../components/adminLayout';
import { getAllUsers } from '../api/user';
import CheckboxTable from '../components/CheckboxTable';
import { IUser } from '../../server/types/models';

interface Props {
	sessionUser: IUser;
	users: IUser[];
}

class UsersPage extends React.Component<Props> {
	static getInitialProps = async ({ sessionUser, res }) => {
		const users = !!res ?
			res.locals.users :
			await getAllUsers();

		return { sessionUser, users };
	}

	renderHeader() {
		return (
			<tr>
				<th>First name</th>
				<th>Last name</th>
				<th>Role</th>
				<th>Email</th>
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow = (user: IUser) => {
		const { role, id } = this.props.sessionUser;
		const isCurrentUser = id === user.id;
		return (
			<tr key={`user-row-${user.id}`}>
				<td>{user.firstName}</td>
				<td>{user.lastName}</td>
				<td>{user.role}</td>
				<td>{user.email}</td>
				<td>
					{(isCurrentUser || role === 'admin') && (
						<Link
							href={`/userEdit?userId=${user.id}`}
							as={`/admin/users/${user.id}`}
						>
							<i className="material-icons">mode_edit</i>
						</Link>
					)}
				</td>
			</tr>
		);
	}

	render() {
		return (
			<div className="uk-container">
				<h2>Users</h2>
				<p className="uk-margin-large-bottom">
					These are users that are allowed to login to the cms to make edit changes
				</p>
				<CheckboxTable
					bulk={false}
					data={this.props.users}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					buttons={(
						<Link prefetch={true} href="/usersCreate" as="/admin/users/new">
							<button className="uk-button-small uk-float-left uk-button uk-button-primary">Add</button>
						</Link>
					)}
				/>
			</div>
		);
	}
}

export default withAdmin({ title: 'Users'}, UsersPage);
