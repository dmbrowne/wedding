import React from 'react';
import Head from 'next/head';
import cx from 'classnames';
import '../styles/invite.scss';
import AppLayout from '../components/AppLayout';
import InvitedSection from '../components/invitation/InvitedSection';
import HeroSection from '../components/invitation/HeroSection';
import AddressSection from '../components/invitation/AddressSection';
import Services from '../components/invitation/Services';
import RsvpSection from '../components/invitation/RsvpSection';
import { restfulRequest } from '../api/utils';

interface State {
	windowHeight: number;
	selectedEvents: {
		[attendeeId: string]: {
			[eventId: string]: boolean;
		},
	};
	dietryRequirements: {
		[attendeeId: string]: {
			starter: 'meat' | 'fish' | 'vegetarian',
			main: 'meat' | 'fish' | 'vegetarian',
		},
	};
}
export default class Invitation extends React.Component<any, State> {
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

	isAnUpdate: boolean = false;
	rsvpSection: HTMLElement = null;

	constructor(props) {
		super(props);
		this.state = {
			windowHeight: 0,
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
			dietryRequirements: props.attendees.reduce((accum, attendee) => ({
				...accum,
				[attendee.id]: {
					starter: attendee.FoodChoice && attendee.FoodChoice.starter || null,
					main: attendee.FoodChoice && attendee.FoodChoice.main || null,
				},
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

	selectFoodChoice = (attendeeId: string, courseType: 'starter' | 'main', preference: 'meat' | 'fish' | 'vegetarian') => {
		return new Promise(resolve => {
			this.setState({
				dietryRequirements: {
					...this.state.dietryRequirements,
					[attendeeId]: {
						...this.state.dietryRequirements[attendeeId],
						[courseType]: preference,
					},
				},
			}, () => resolve());
		});
	}

	onSubmit = () => {
		let body;
		body = this.props.attendees.map(attendee => ({
			attendeeId: attendee.id,
			events: {
				...this.state.selectedEvents[attendee.id],
			},
			diet: {
				...this.state.dietryRequirements[attendee.id],
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
					{this.props.bridalParty && this.props.bridalParty.bridesmaids && (
						<div className="section section-bridemaids">
							<h2 className="section-title"><span>Meet the</span>Bridal Party</h2>
							<div className="bridal-party bridemaids">
								{this.props.bridalParty.bridesmaids.BridalParties.map(bridesmaid => {
									return (
										<div key={bridesmaid.id} className={cx('bridal-party-member', {primary: bridesmaid.vip})}>
											{bridesmaid.subRole && <div className="badge">{bridesmaid.subRole}</div>}
											<figure className="selfie">
												<img src={bridesmaid.Image.squareImage} />
											</figure>
											<header>{bridesmaid.firstName} {bridesmaid.lastName}</header>
											{bridesmaid.comment && <footer>{bridesmaid.comment}</footer>}
										</div>
									);
								})}
							</div>
						</div>
					)}
					{this.props.bridalParty && this.props.bridalParty.groomsmen && (
						<div className="section section-groomsmen">
							<h2 className="section-title"><span>Meet the</span>Bridal Party</h2>
							<div className="bridal-party groomsmen">
								{this.props.bridalParty.groomsmen.BridalParties.map(groomsmen => {
									return (
										<div key={groomsmen.id} className={cx('bridal-party-member', {primary: groomsmen.vip})}>
											{groomsmen.subRole && <div className="badge">{groomsmen.subRole}</div>}
											<figure className="selfie">
												<img src={groomsmen.Image.squareImage} />
											</figure>
											<header>{groomsmen.firstName} {groomsmen.lastName}</header>
											{groomsmen.comment && <footer>{groomsmen.comment}</footer>}
										</div>
									);
								})}
							</div>
						</div>
					)}
					<div className="section section-donate">
						<h2 className="section-title"><span>wishing us</span>Well xx</h2>
						<div className="yd-container">
							<p><span className="fancy">T</span>he most important gift to us is having you share in our special day</p>
							<p><span className="fancy">B</span>ut if you wish to contribute in some other way, we would love a few pennies to put in our pot, for our honeymoon trip afteer tying the knot!</p>
							<p>If you would like to put in a penny or two - you can donate by clicking the piggy bank below,</p>
							<p className="fancy">Thank You x</p>
							<div className="uk-margin">
								<a href="/donate" target="_blank">
									<img src="/assets/pig-bank.png" style={{ width: 200 }} />
								</a>
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
							foodSelections={this.state.dietryRequirements}
							onSelectStarter={(aId, food) => this.selectFoodChoice(aId, 'starter', food)}
							onSelectMains={(aId, food) => this.selectFoodChoice(aId, 'main', food)}
						/>
					</div>
				</div>
			</AppLayout>
		);
	}
}
