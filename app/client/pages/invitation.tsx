import React from 'react';
import Head from 'next/head';
import cx from 'classnames';
import '../styles/invite.scss';
import AttendeeModel from '../../server/models/attendee';
import SendGroupModel from '../../server/models/sendGroup';
import BridalPartyRoleModel from '../../server/models/bridalPartyRoles';
import EventModel from '../../server/models/event';
import { FoodChoiceType } from '../../server/models/foodChoice';
import { SingleInvitationResponseLocals, GroupInvitationResponseLocals } from '../../server/controllers/attendeeController';
import AppLayout from '../components/AppLayout';
import InvitedSection from '../components/invitation/InvitedSection';
import HeroSection from '../components/invitation/HeroSection';
import AddressSection from '../components/invitation/AddressSection';
import Services from '../components/invitation/Services';
import RsvpSection from '../components/invitation/RsvpSection';
import { restfulRequest } from '../api/utils';
import Modal from '../components/Modal';
import Pig from '../components/icons/Pig';

interface State {
	windowHeight: number;
	selectedEvents: {
		[attendeeId: string]: {
			[eventId: string]: boolean;
		},
	};
	foodSelections: {
		[attendeeId: string]: {
			starter: FoodChoiceType,
			main: FoodChoiceType,
			valid: boolean;
			allergies: string;
		},
	};
	dietEvents: string[];
	rsvpDisabled: boolean;
	showRsvpConfirmModal: boolean;
}

interface Props {
	invitationId: string;
	singleInvitation: boolean;
	allInvitedEvents: EventModel[];
	bridalParty: {
		[bridalPartyRole: string]: BridalPartyRoleModel,
	};
	previouslyConfirmed: boolean;
	attendees?: AttendeeModel[];
	sendGroup?: SendGroupModel;
}

export default class Invitation extends React.Component<Props, State> {
	static getInitialProps = async ({ req, res, query }) => {
		if (res && req) {
			const responseLocals: SingleInvitationResponseLocals | GroupInvitationResponseLocals = res.locals;
			const { invitationId, singleInvitation, allInvitedEvents, bridalParties } = responseLocals;
			const props: Props = {
				invitationId,
				singleInvitation,
				allInvitedEvents,
				bridalParty: bridalParties,
				previouslyConfirmed: false,
			};

			if (responseLocals.singleInvitation) {
				const attendee: AttendeeModel = responseLocals.attendee;
				props.attendees = [attendee];
				props.previouslyConfirmed = attendee.Events.some((event) => event.EventAttendee.confirmed);
			} else if (responseLocals.singleInvitation === false) {
				const sendGroup: SendGroupModel = responseLocals.sendGroup;
				props.sendGroup = sendGroup;
				props.attendees = sendGroup.Attendees;
				props.previouslyConfirmed = sendGroup.Attendees.some(attendee => attendee.Events.some((event) => event.EventAttendee.confirmed));
			}

			return props;
		}
		return {};
	}

	rsvpSection: HTMLElement = null;

	constructor(props: Props) {
		super(props);
		const selectedEvents = props.attendees.reduce((accum, attendee) => ({
			...accum,
			[attendee.id]: attendee.Events.reduce((eventAccum, event) => ({
				...eventAccum,
				[event.id]: event.EventAttendee.attending,
			}), {}),
		}), {});
		const foodSelections = props.attendees.reduce((accum, attendee) => ({
			...accum,
			[attendee.id]: {
				starter: attendee.FoodChoice && attendee.FoodChoice.starter || null,
				main: attendee.FoodChoice && attendee.FoodChoice.main || null,
				allergies: attendee.FoodChoice && attendee.FoodChoice.allergies || '',
				valid: this.attendeeFoodChoiceIsValid(attendee.FoodChoice),
			},
		}), {});

		this.state = {
			windowHeight: 0,
			selectedEvents,
			foodSelections,
			dietEvents: props.allInvitedEvents.filter(service => service.dietFeedback).map(event => event.id),
			rsvpDisabled: props.previouslyConfirmed,
			showRsvpConfirmModal: false,
		};
	}

	componentDidMount() {
		this.setState({ windowHeight: window.innerHeight });
	}

	scrollToRsvp = (btnElement) => {
		window.UIkit.scroll(btnElement).scrollTo(this.rsvpSection);
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

	attendeeFoodChoiceIsValid(foodSelection: Pick<State['foodSelections']['attendeeId'], 'starter' | 'main' | 'allergies'>) {
		return (
			!!foodSelection && !!foodSelection.starter && !!foodSelection.main
		);
	}

	selectFoodChoice = (attendeeId: string, courseType: 'starter' | 'main', preference: FoodChoiceType) => {
		return new Promise(resolve => {
			const newSelection = {
				...this.state.foodSelections[attendeeId],
				[courseType]: preference,
			};
			newSelection.valid = this.attendeeFoodChoiceIsValid(newSelection);
			this.setState({
				foodSelections: {
					...this.state.foodSelections,
					[attendeeId]: newSelection,
				},
			}, () => resolve());
		});
	}

	updateAllergies = (attendeeId: string, value: string) => {
		this.setState({
			foodSelections: {
				...this.state.foodSelections,
				[attendeeId]: {
					...this.state.foodSelections[attendeeId],
					allergies: value,
				},
			},
		});
	}

	noEventsSelected() {
		const selectedEvents = Object.keys(this.state.selectedEvents).filter(attendeeId => {
			return Object.keys(this.state.selectedEvents[attendeeId]).filter(eventId => {
				return this.state.selectedEvents[attendeeId][eventId];
			}).length > 0;
		});
		return selectedEvents.length === 0;
	}

	isRsvpValid() {
		const attendeeValidations = this.props.attendees.reduce((accum, attendee) => {
			const requiresFoodChoiceValidation = Object.keys(this.state.selectedEvents[attendee.id]).some(eventId => {
				return this.state.selectedEvents[attendee.id][eventId] && this.state.dietEvents.indexOf(eventId) >= 0;
			});
			return {
				...accum,
				[attendee.id]: {
					...attendee,
					valid: requiresFoodChoiceValidation ? this.state.foodSelections[attendee.id].valid : true,
				},
			};
		}, {});
		const inValidAttendees = Object.keys(attendeeValidations).filter(attendeeId => {
			return !attendeeValidations[attendeeId].valid;
		});

		return inValidAttendees;
	}

	onSubmit = () => {
		const inValidAttendees = this.isRsvpValid();
		if (inValidAttendees.length > 0) {
			return alert('Please fill out the food choices before sending your response');
		}

		let body;
		body = this.props.attendees.map(attendee => ({
			attendeeId: attendee.id,
			events: {
				...this.state.selectedEvents[attendee.id],
			},
			foodChoices: {
				...this.state.foodSelections[attendee.id],
			},
		}));
		body = this.props.singleInvitation ? body[0] : body;
		const path = this.props.singleInvitation ? 'a' : 'g';
		return restfulRequest({
			route: `invitation/${path}/${this.props.invitationId}/rsvp`,
			method: 'POST',
			body: JSON.stringify({
				rsvp: body,
			}),
		})
		.then(() => {
			this.setState({
				showRsvpConfirmModal: true,
				rsvpDisabled: true,
			});
		});
	}

	render() {
		return (
			<AppLayout title="You're Invited - Mr & Mrs Browne 2018">
				<Head>
					<link
						key="google-fonts"
						href="https://fonts.googleapis.com/css?family=Great+Vibes|Roboto+Condensed:300,400"
						rel="stylesheet"
					/>
					<link key="material-icons" rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" />
					<script src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/js/uikit.min.js" />
					<meta key="metatag-viewport" name="viewport" content="width=device-width, initial-scale=1.0" />
				</Head>
				{this.state.windowHeight === 0 ?
					null :
					<div className="wedding-invitation">
						<div style={{height: this.state.windowHeight}}>
							<HeroSection />
						</div>
						<InvitedSection
							attendees={this.props.attendees}
							singleInvitation={this.props.singleInvitation}
							onGoToRsvp={btnElement => this.scrollToRsvp(btnElement)}
							confirmed={this.props.previouslyConfirmed}
						/>
						<AddressSection events={this.props.allInvitedEvents} />
						<Services events={this.props.allInvitedEvents} />
						{this.props.bridalParty && this.props.bridalParty.bridesmaids && !!this.props.bridalParty.bridesmaids.BridalParties.length && (
							<div className="section section-bridemaids">
								<h2 className="section-title"><span>Meet the</span>Bridesmaids</h2>
								<div className="bridal-party bridemaids">
									{this.props.bridalParty.bridesmaids.BridalParties.map(bridesmaid => {
										return (
											<div key={bridesmaid.id} className={cx('bridal-party-member', {primary: bridesmaid.vip})}>
												{bridesmaid.subRole && <div className="badge">{bridesmaid.subRole}</div>}
												<figure className="selfie">
													<img src={bridesmaid.Image.squareHiRes} />
												</figure>
												<header>{bridesmaid.firstName} {bridesmaid.lastName}</header>
												{bridesmaid.comment && <footer>{bridesmaid.comment}</footer>}
											</div>
										);
									})}
								</div>
							</div>
						)}
						{this.props.bridalParty && this.props.bridalParty.groomsmen && !!this.props.bridalParty.groomsmen.BridalParties.length && (
							<div className="section section-groomsmen">
								<h2 className="section-title"><span>Meet the</span>Groomsmen</h2>
								<div className="bridal-party groomsmen">
									{this.props.bridalParty.groomsmen.BridalParties.map(groomsmen => {
										return (
											<div key={groomsmen.id} className={cx('bridal-party-member', {primary: groomsmen.vip})}>
												{groomsmen.subRole && <div className="badge">{groomsmen.subRole}</div>}
												<figure className="selfie">
													<img src={groomsmen.Image.squareHiRes} />
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
								<p><span className="fancy">T</span>he most important gift to us is having you share our special day</p>
								<p><span className="fancy">B</span>ut if you wish to contribute in some other way, we would love a few pennies to put in our pot, for our honeymoon trip after tying the knot!</p>
								<p>If you would like to put in a penny or two - you can donate by clicking the piggy bank below,</p>
								<p className="fancy">Thank You x</p>
								<div className="uk-margin">
									<a href={`${this.props.url.asPath}/donate`} target="_blank">
										<Pig />
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
								isAnUpdate={this.props.previouslyConfirmed}
								foodSelections={this.state.foodSelections}
								onSelectStarter={(aId, food) => this.selectFoodChoice(aId, 'starter', food)}
								onSelectMains={(aId, food) => this.selectFoodChoice(aId, 'main', food)}
								onAllergiesChange={(aId, value) => this.updateAllergies(aId, value)}
								dietryRequiredEvents={this.state.dietEvents}
								disabled={this.state.rsvpDisabled}
								onEnable={() => this.setState({ rsvpDisabled: false })}
							/>
						</div>
						{this.state.showRsvpConfirmModal && (
							<div className="success-modal">
								<Modal title="Thank you!">
									<i className="material-icons success-modal-check-icon">check</i>
									<p>Your Response has been received</p>
									{this.noEventsSelected() ?
										<p>Sorry you can't make our big day, we hope to see you soon</p> :
										<p>We look forward to seeing you on our big day!</p>
									}
									<p className="fancy">xx</p>
									<div>
										<button onClick={() => this.setState({ showRsvpConfirmModal: false })} className="uk-button uk-button-large">Ok</button>
									</div>
								</Modal>
							</div>
						)}
					</div>
				}
			</AppLayout>
		);
	}
}
