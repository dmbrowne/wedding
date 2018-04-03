import React from 'react';
import Head from 'next/head';
import '../styles/invite.scss';
import FireFlies from '../components/Fireflies';
import InfinityIcon from '../components/icons/Infinity';

export default class Invitation extends React.Component {
	state = {
		widowHeight: 0,
	};

	componentDidMount() {
		this.setState({ windowHeight: window.innerHeight });
	}

	render() {
		if (this.state.windowHeight === 0) {
			return null;
		}

		return (
			<div id="wedding-invitation">
				<Head>
					<link
						key="google-fonts"
						href="https://fonts.googleapis.com/css?family=Great+Vibes|Roboto+Condensed:300,400"
						rel="stylesheet"
					/>
					<script src="/assets/globalFunctions.js" />
				</Head>
				<div className="hero">
					<FireFlies>
						<div className="header-bg-img" style={{ height: this.state.windowHeight }}/>
						<header className="section">
							<div className="content">
								<img className="logo" src="/assets/y&d-logo-white.png" />
								<h1 className="title">We're getting married!</h1>
								<div className="date" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<span>13</span>
										<InfinityIcon className="infinity-sign" colour="#fff" width={40} />
										<span>10</span>
									</div>
									<span>2018</span>
								</div>
							</div>
						</header>
					</FireFlies>
				</div>
				<div className="section services-section">
					<h1 className="section-title"><span>You're</span>Invited</h1>
						<div className="services">
								<div className="event-box">
									<h2 className="event-title"><span>Ceremony</span></h2>
								</div>
								<div className="event-box">
									<h2 className="event-title"><span>The first Breakfast</span></h2>
								</div>
								<div className="event-box">
									<h2 className="event-title"><span>Reception</span></h2>
								</div>
						</div>
				</div>
			</div>
		);
	}
}
