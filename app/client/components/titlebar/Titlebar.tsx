import * as React from 'react';
import './titlebar.scss';

export default ({children, onMenuPress, firstName, lastName, onLogout }) => (
	<div className="uk-background-secondary">
		<div className="uk-navbar-container uk-navbar-transparent uk-light" data-uk-navbar={true}>
			<div className="uk-navbar-left uk-flex uk-flex-center">
				<a className="uk-navbar-toggle">
					<i
						onClick={onMenuPress}
						className="material-icons menu"
					>
						menu
					</i>
				</a>
				<h3 className="uk-margin-remove">{children}</h3>
			</div>
			<div className="uk-navbar-right">
				<ul className="uk-navbar-nav" style={{paddingRight: 15}}>
					<li>
						<a className="user-avatar">{firstName.charAt(0) + lastName.charAt(0)}</a>
						<div className="uk-navbar-dropdown">
							<ul className="uk-nav uk-navbar-dropdown-nav">
								<li onClick={onLogout}><a href="#">Logout</a></li>
							</ul>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
);
