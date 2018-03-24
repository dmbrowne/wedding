import * as React from 'react';
import Titlebar from './Titlebar'

export default class AdminLayout extends React.Component {
	offMenuEl = null
	offMenu = null

	state = {
		showMenu: false,
	}

	toggleMenu = () => {
		this.setState({ showMenu: !this.state.showMenu });
	}

	createOffCanvasComponent() {
		this.offMenu = UIkit.offcanvas(this.offMenuEl, {
			mode: 'push',
			overlay: false,
		})
		UIkit.util.on(this.offMenuEl, 'hide', () => {
			this.setState({ showMenu: false })
		});
		UIkit.util.on(this.offMenuEl, 'show', () => {
			this.setState({ showMenu: true })
		});
	}

	showOrHideMenu(showMenu) {
		if (!this.offMenu) {
			this.createOffCanvasComponent()
		}
		this.offMenu[showMenu ? 'show' : 'hide']();
	}

	componentWillUpdate(nextProps,{showMenu}) {
		if (this.state.showMenu !== showMenu) {
			this.showOrHideMenu(showMenu);
		}
	}


	render() {
		return (
			<div className="uk-offcanvas-content">
				<Titlebar onMenuPress={this.toggleMenu}>{this.props.title}</Titlebar>
				<main style={{padding: 15}}>
					{this.props.children}
				</main>
				<aside ref={ref => {
					this.offMenuEl = ref
				}}>
					<div className="uk-offcanvas-bar">
						<button className="uk-offcanvas-close" type="button" data-uk-close></button>
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
		)
	}
}
