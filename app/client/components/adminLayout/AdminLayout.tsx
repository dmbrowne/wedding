import * as React from 'react';
import Titlebar from '../titlebar';
import Head from 'next/head';

export interface Props {
	title: string;
}

interface InternalProps extends Props {
	firstName: string;
	lastName: string;
	onLogout: () => any;
}

export default class AdminLayout extends React.Component<InternalProps> {
	offMenuEl = null;
	offMenu = null;
	UIkit = undefined;

	state = {
		showMenu: false,
	};

	toggleMenu = () => {
		this.setState({ showMenu: !this.state.showMenu });
	}

	createOffCanvasComponent() {
		this.offMenu = this.UIkit.offcanvas(this.offMenuEl, {
			mode: 'push',
			overlay: false,
		});
		this.UIkit.util.on(this.offMenuEl, 'hide', () => {
			this.setState({ showMenu: false });
		});
		this.UIkit.util.on(this.offMenuEl, 'show', () => {
			this.setState({ showMenu: true });
		});
	}

	showOrHideMenu(showMenu) {
		if (!this.offMenu) {
			this.createOffCanvasComponent();
		}
		this.offMenu[showMenu ? 'show' : 'hide']();
	}

	componentWillUpdate(_, {showMenu}) {
		if (this.state.showMenu !== showMenu) {
			this.showOrHideMenu(showMenu);
		}
	}

	componentDidMount() {
		this.UIkit = require('uikit');
	}

	render() {
		return (
			<div className="uk-offcanvas-content">
				<Head>
					{this.props.title && <title key="document-title">{this.props.title}</title>}
					<link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" key="material-icons" />
					<link
						rel="stylesheet"
						href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.min.css"
						key="uikit-stylesheet"
					/>
					<script key="uikit-js" src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/js/uikit.min.js" />
				</Head>
				<Titlebar
					firstName={this.props.firstName}
					lastName={this.props.lastName}
					onMenuPress={this.toggleMenu}
					onLogout={this.props.onLogout}
				>
					{this.props.title}
				</Titlebar>
				<main style={{paddingTop: 15}} id="admin-layout">
					{this.props.children}
				</main>
				<aside ref={ref => this.offMenuEl = ref}>
					<div className="uk-offcanvas-bar">
						<button className="uk-offcanvas-close" type="button" data-uk-close="true" />
						<ul className="uk-nav uk-nav-default">
							<li><a href="/admin">Dashboard</a></li>
							<li><a href="/admin/events">Events</a></li>
							<li><a href="/admin/attendees">Attendees</a></li>
							<li><a href="/admin/sendgroups">Send Groups</a></li>
							<li><a href="/admin/bridalparties">Bridal Party</a></li>
							<li className="uk-nav-divider uk-margin" />
							<li><a href="/admin/campaigns">Invitation campaigns</a></li>
							<li className="uk-nav-divider uk-margin" />
							<li><a href="/admin/donations">Donations</a></li>
							<li className="uk-nav-divider uk-margin" />
							<li><a href="/admin/users">CMS users</a></li>
							<li><a href="/admin/gallery">Image Gallery</a></li>
						</ul>
					</div>
				</aside>
			</div>
		);
	}
}
