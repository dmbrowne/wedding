import * as React from 'react';
import Titlebar from '../titlebar';

export interface Props {
	title: string;
}

export default class AdminLayout extends React.Component<Props> {
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
				<Titlebar onMenuPress={this.toggleMenu}>{this.props.title}</Titlebar>
				<main style={{padding: 15}}>
					{this.props.children}
				</main>
				<aside ref={ref => this.offMenuEl = ref}>
					<div className="uk-offcanvas-bar">
						<button className="uk-offcanvas-close" type="button" data-uk-close="true" />
						<ul className="uk-nav uk-nav-default">
							<li className="uk-active"><a href="#">Dashboard</a></li>
							<li className="uk-parent"><a href="#">Events</a></li>
							<li className="uk-parent"><a href="#">Attendees</a></li>
							<li className="uk-parent"><a href="#">Bridemaids</a></li>
							<li className="uk-parent"><a href="#">Groomsmen</a></li>
							<li className="uk-parent"><a href="#">Table</a></li>
						</ul>
					</div>
				</aside>
			</div>
		);
	}
}
