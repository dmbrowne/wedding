import React from 'react';
import Head from 'next/head';
import '../styles/invite.scss';
import FireFlies from '../components/Fireflies';
import InfinityIcon from '../components/icons/Infinity';
import OrnateDivider from '../components/icons/OrnateDivider';
import LinearOrnament from '../components/icons/LinearOrnament';

export default class Invitation extends React.Component {
	state = {
		widowHeight: 0,
		noBreakfast: false,
	};

	componentDidMount() {
		this.setState({ windowHeight: window.innerHeight });
	}

	toggleBreakfast = () => {
		this.setState({ noBreakfast: !this.state.noBreakfast });
	}

	render() {
		if (this.state.windowHeight === 0) {
			return null;
		}

		return (
			<div id="wedding-invitation">
				<div className="dev-controls">
					<header>Dev Controls:</header>
					<div>No breakfast: {this.state.noBreakfast.toString()}</div>
					<div className="actions">
						<button onClick={this.toggleBreakfast} className="btn btn-primary btn-sm">No Breakfast</button>
					</div>
				</div>
				<Head>
					<link
						key="google-fonts"
						href="https://fonts.googleapis.com/css?family=Great+Vibes|Roboto+Condensed:300,400"
						rel="stylesheet"
					/>
					<link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" key="material-icons" />
					<script src="/assets/globalFunctions.js" />
				</Head>
				<div className="section section-hero" style={{height: this.state.windowHeight}}>
					<FireFlies>
						<div className="content">
							<div />
							{/* <img className="logo" src="/assets/y&d-logo-white.png" /> */}
							<img className="emblem" src="/assets/emblem.png" />
							<header>
								<h1 className="title">We're getting married!</h1>
								<div className="date" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<span>13</span>
										<InfinityIcon className="infinity-sign" colour="#fff" width={40} />
										<span>10</span>
									</div>
									<span>2018</span>
								</div>
							</header>
						</div>
					</FireFlies>
				</div>
				<div className="section section-invited">
					<h2 className="section-title"><span>You're</span>Invited</h2>
					<p>We would like to welcome and invite you to our very special day</p>
					<p>
						Ayfer Princess and Sebastian Prince, it would mean the world to us if you could join us for this very special time
					</p>
					<p>Read on for more details, and your RSVP at the bottom of this invite</p>

				</div>
				<div className="section section-where">
					<h2 className="section-title"><span>where &</span>When</h2>
					<div className="ornate-divider">
						<OrnateDivider colour="#e0b278" />
					</div>
					<address>
						<p>The <span>Islington Town Hall</span></p>
						<p>Upper Street</p>
						<p>N1 2UD</p>
						<small className="uk-text-meta"><i className="material-icons">map</i> open in google maps</small>
					</address>
					<div className="caligraphy-divider">
						<LinearOrnament colour="#e0b278" />
					</div>
					<time>
						Be there for: <span>5'o'Clock</span>
					</time>
				</div>
				<div className="section section-services">
					<h2 className="section-title"><span>Order of</span>Service</h2>
					<div className="services">
						<div className="event-box-wrapper">
							<div className="event-box">
								<h2 className="event-title"><span>Ceremony</span></h2>
								<div className="details">
									<span className="day">Monday</span>
									<span className="date">October 13 2018</span>
									<span className="time">05:00 pm</span>
								</div>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac posuere justo. In tempor ex in blandit euismod. Nullam semper mauris sed erat interdum mollis. Phasellus egestas dictum odio sit amet pulvinar. Ut ligula orci, accumsan sed dui id, maximus rutrum tellus. Nulla facilisi. Suspendisse est quam, viverra sed sapien sit amet, egestas bibendum mauris. Nulla pulvinar viverra tristique. Curabitur malesuada, lacus sed porttitor molestie, justo purus sollicitudin urna, nec cursus justo massa quis justo.</p>
							</div>
						</div>
						{this.state.noBreakfast === false && <div className="event-box-wrapper">
							<div className="event-box">
								<h2 className="event-title"><span>Wedding 'Breakfast'</span></h2>
								<div className="details">
									<span className="day">Monday</span>
									<span className="date">October 13 2018</span>
									<span className="time">05:00 pm</span>
								</div>
								<p>Fusce volutpat ante lacus, eu finibus sem maximus aliquam. Suspendisse pulvinar est lectus, at efficitur metus dictum ullamcorper. Vestibulum eget porta velit. Aenean vitae velit imperdiet, consectetur massa id, finibus leo. Nam vulputate luctus libero, ut suscipit arcu ultricies et. Nunc pharetra a libero id porttitor. Quisque non tempor diam, a tempus justo. Donec accumsan est sed neque convallis scelerisque. Donec vulputate libero vel diam pretium viverra.</p>
							</div>
						</div>}
						<div className="event-box-wrapper">
							<div className="event-box">
								<h2 className="event-title"><span>Reception</span></h2>
								<div className="details">
									<span className="day">Monday</span>
									<span className="date">October 13 2018</span>
									<span className="time">05:00 pm</span>
								</div>
								<p>Nullam finibus sem metus. Vivamus sapien velit, efficitur et ante id, auctor laoreet orci. Duis tempor augue vel lacus tempus, eget dignissim odio fermentum. Morbi pellentesque vulputate placerat. Donec a congue ex. Sed at diam ac orci blandit finibus ac non justo. Aenean sapien ipsum, sagittis a sem vitae, molestie interdum nisl. Morbi sagittis libero leo, a cursus ligula mattis eget. Phasellus leo turpis, pharetra et dui nec, tempus tristique nunc. Cras posuere sagittis dapibus. Mauris euismod nunc ut lacinia tincidunt.</p>
							</div>
						</div>
					</div>
					{this.state.noBreakfast && <div className="side-note">
						<p>
							<span>*</span>
							Please note, that between the ceremony and wedding reception, there will be a slight time gap. This is to allow close family to have a sit down with the newly weds, before the wedding reception starts in the evening.
						</p>
						<p>
							Whilst we would love for you to attend both, we understand your reservations if you only choose to attend one
						</p>
					</div>}
				</div>
				<div className="section section-bridemaids">
					<h2 className="section-title"><span>Meet the</span>Bridal Party</h2>
					<div className="bridal-party bridemaids">
						<div className="bridal-party-member primary">
							<div className="badge">Maid of honour</div>
							<figure className="selfie">
								<img src="/assets/bride2.jpeg" />
							</figure>
							<header>Sarah Jane</header>
							<footer>Mf'ing M.O.H. in this b****!!</footer>
						</div>
						<div className="bridal-party-member">
							<figure className="selfie">
								<img src="/assets/bride1.jpeg" />
							</figure>
							<header>Karlene Sanders</header>
							<footer>Insert witty commet here</footer>
						</div>
						<div className="bridal-party-member">
							<figure className="selfie">
								<img src="/assets/bride3.jpeg" />
							</figure>
							<header>Danni Whyte</header>
							<footer>Insert witty commet here</footer>
						</div>
						<div className="bridal-party-member">
							<figure className="selfie">
								<img src="/assets/bride4.jpeg" />
							</figure>
							<header>Nikki Black</header>
							<footer>Insert witty commet here</footer>
						</div>
					</div>
				</div>
				<div className="section section-groomsmen">
					<h2 className="section-title"><span>Meet the</span>Groomsmen</h2>
					<div className="bridal-party groomsmen">
						<div className="bridal-party-member primary">
							<div className="badge">Bestman</div>
							<figure className="selfie">
								<img src="/assets/groom2.jpeg" />
							</figure>
							<header>Jack Beastley</header>
							<footer>insert witty commet here</footer>
						</div>
						<div className="bridal-party-member">
							<figure className="selfie">
								<img src="/assets/groom1.jpeg" />
							</figure>
							<header>Daniel Barsnoble</header>
							<footer>insert witty commet here</footer>
						</div>
					</div>
				</div>
				<div className="section section-rsvp">
					<h2 className="section-title"><span>Please reply</span> Répondez s'il vous plaît</h2>
					<p>Please send your response by<br/><strong>May 31st</strong><br/>Responses after this date has passed will not be counted and your place will not be guaranteed.</p>
					<p>Tap on an event to select/unselect it and indicate your attendance.</p>
					<form>
						<div className="row rsvps">
							<div className="rsvp">
								<header>Daniel Robinson</header>
								<p><small>Please tap to select/unselect an event</small></p>
								<div>
									<div className="checkbox-group active">
										<i className="custom-checkbox material-icons">check</i>
										<label className="form-check-label">
											Ceremony
										</label>
									</div>
									<div className="checkbox-group">
										<i className="custom-checkbox material-icons">check</i>
										<label className="form-check-label">
											Wedding breakfast
										</label>
									</div>
									<div className="checkbox-group">
										<i className="custom-checkbox material-icons">check</i>
										<label className="form-check-label">
											Reception
										</label>
									</div>
								</div>
							</div>
							<div className="rsvp">
								<header>Danielle Campbell</header>
								<p><small>Please tap to select/unselect an event</small></p>
								<div>
									<div className="checkbox-group active">
										<i className="custom-checkbox material-icons">check</i>
										<label className="form-check-label">
											Ceremony
										</label>
									</div>
									<div className="checkbox-group active">
										<i className="custom-checkbox material-icons">check</i>
										<label className="form-check-label">
											Wedding breakfast
										</label>
									</div>
									<div className="checkbox-group">
										<i className="custom-checkbox material-icons">check</i>
										<label className="form-check-label">
											Reception
										</label>
									</div>
								</div>
							</div>
						</div>
						<button className="btn btn-lg">Send Response</button>
					</form>
				</div>
			</div>
		);
	}
}
