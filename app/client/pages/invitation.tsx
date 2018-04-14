import React from 'react';
import Head from 'next/head';
import '../styles/invite.scss';
import AppLayout from '../components/AppLayout';
import InvitedSection from '../components/invitation/InvitedSection';
import HeroSection from '../components/invitation/HeroSection';
import AddressSection from '../components/invitation/AddressSection';
import Services from '../components/invitation/Services';
import RsvpSection from '../components/invitation/RsvpSection';
import { restfulRequest } from '../api/utils';

export default class Invitation extends React.Component {
	static getInitialProps = async ({ req, res, query }) => {
		if (res && req) {
			const { sendGroup, singleInvitation, attendee, services } = res.locals;
			const { invitationId } = req.session;

			const props = { invitationId, singleInvitation, services };
			if (singleInvitation) {
				return { ...props, attendees: [attendee] };
			} else {
				return { ...props, attendees: sendGroup.Attendees, sendGroup };
			}
		}
		return {};
	}

	constructor(props) {
		super(props);
		this.state = {
			widowHeight: 0,
			noBreakfast: false,
			selectedEvents: props.attendees.reduce((accum, attendee) => ({
				...accum,
				[attendee.id]: attendee.Events.reduce((eventAccum, event) => {
					if (!this.isAnUpdate && event.EventAttendee.confirmed) { this.isAnUpdate = true; }
					return {
						...eventAccum,
						[event.id]: event.EventAttendee.attending,
					};
				}, {}),
			}), {}),
		};
	}

	componentDidMount() {
		this.setState({ windowHeight: window.innerHeight });
	}

	scrollToRsvp = (btnElement) => {
		window.UIkit.scroll(btnElement).scrollTo(this.rsvpSection)
	}

	selectEventForRsvp = (attendeeId, eventId, isSelected) => {
		this.setState({
			selectedEvents: {
				...this.state.selectedEvents,
				[attendeeId]: {
					...this.state.selectedEvents[attendeeId],
					[eventId]: isSelected,
				},
			},
		});
	}

	onSubmit = () => {
		let body;
		body = this.props.attendees.map(attendee => ({
			attendeeId: attendee.id,
			events: {
				...this.state.selectedEvents[attendee.id],
			},
		}));
		body = this.props.singleInvitation ? body[0] : body;
		return restfulRequest({
			route: `invitation/rsvp/${this.props.invitationId}`,
			method: 'POST',
			body: JSON.stringify({
				attendeeRsvps: body,
			}),
		});
	}

	render() {
		if (this.state.windowHeight === 0) {
			return null;
		}

		return (
			<AppLayout>
				<Head>
					<link
						key="google-fonts"
						href="https://fonts.googleapis.com/css?family=Great+Vibes|Roboto+Condensed:300,400"
						rel="stylesheet"
					/>
					<link key="material-icons" rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" />
					<script src="/assets/globalFunctions.js" />
					<script src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/js/uikit.min.js" />
				</Head>
				<div className="wedding-invitation">
					<div style={{height: this.state.windowHeight}}>
						<HeroSection />
					</div>
					<InvitedSection
						attendees={this.props.attendees}
						singleInvitation={this.props.singleInvitation}
						onGoToRsvp={btnElement => this.scrollToRsvp(btnElement)}
					/>
					<AddressSection />
					<Services events={this.props.services} />
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
					<div ref={ref => this.rsvpSection = ref}>
						<RsvpSection
							attendees={this.props.attendees}
							onSelectEvent={(evId, attenId, value) => this.selectEventForRsvp(evId, attenId, value)}
							selectedEvents={this.state.selectedEvents}
							onSubmit={this.onSubmit}
							isAnUpdate={this.isAnUpdate}
						/>
					</div>
				</div>
			</AppLayout>
		);
	}
}
