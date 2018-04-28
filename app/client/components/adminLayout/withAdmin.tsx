import * as React from 'react';
import AppLayout from '../AppLayout';
import AdminLayout, { Props as AdminLayoutProps } from './AdminLayout';
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
				<AppLayout title={adminLayoutOptions.title}>
					<AdminLayout
						firstName={firstName}
						lastName={lastName}
						onLogout={this.logout}
						{...adminLayoutOptions}
					>
						<Component {...this.props} />
						<form method="POST" action="/logout" ref={ref => this.logoutForm = ref} />
					</AdminLayout>
				</AppLayout>
			);
		}
	};
};
