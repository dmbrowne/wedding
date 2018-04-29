import './donate.scss';
import * as React from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import Router from 'next/router';
import { StripeProvider, Elements, ReactStripeElements } from 'react-stripe-elements';
import PaymentForm from '../components/stripeElements/Form';
import TopUp from '../components/stripeElements/TopUp';
import SendGroup from '../../server/models/sendGroup';
import Attendee from '../../server/models/attendee';
import { restfulRequest } from '../api/utils';

interface Props {
	attendee?: Attendee;
	sendGroup?: SendGroup;
	stripePublishableKey: string;
	personalMessage: string;
	onMessageChange: (personalMessage: string) => any;
}

interface State {
	stripe: ReactStripeElements.StripeProps;
	donateAmount: number;
	donationSuccessful: boolean;
	personalMessage: string;
	email: string;
}

export default class StripeTestPage extends React.Component<Props, State> {
	static getInitialProps = async ({ res }) => {
		return {
			attendee: res ? res.locals.attendee : null,
			sendGroup: res ? res.locals.sendGroup : null,
			stripePublishableKey: res ?
				(process.env.NODE_ENV === 'production' ?
					'pk_live_C8avAq5MnX6tkDaGWgyUJ29M' :
					'pk_test_gbZv1zKSysff7KprihcWi6ms') :
				null,
		};
	}

	textArea: HTMLTextAreaElement = null;

	constructor(props) {
		super(props);
		this.state = {
			stripe: null,
			donateAmount: 30,
			donationSuccessful: false,
			personalMessage: '',
			email: props.attendee && props.attendee.email || props.sendGroup && props.sendGroup.email || '',
		};
	}

	submit(token: ReactStripeElements.PatchedTokenResponse['token']) {
		return restfulRequest({
			route: 'charge',
			method: 'POST',
			body: JSON.stringify({
				amount: this.state.donateAmount * 100,
				token: token.id,
				description: 'Test Charge!!',
				message: this.state.personalMessage,
				email: this.state.email,
			}),
		})
		.then(() => {
			Router.push(`/donations/thankyou?amount=${this.state.donateAmount * 100}`);
		})
		.catch(res => {
			res.json().then(error => {
				alert(error.message);
				this.setState({ donationSuccessful : false });
			});
		});
	}

	confirmOrder = (token: ReactStripeElements.PatchedTokenResponse['token']) => {
		this.UIkit.modal.confirm(
			`A donation of £${this.state.donateAmount} will be charged to the card provided. press ok to confirm.`,
		)
		.then(
			() => this.submit(token),
			() => null,
		);
	}

	componentDidMount() {
		this.UIkit = require('uikit');
		setTimeout(() => {
			this.setState({
				stripe: window.Stripe(this.props.stripePublishableKey),
			});
		}, 500);
	}

	onTextAreaChange = e => {
		this.setState({ personalMessage: e.target.value });
		this.textArea.style.height = '80px'; // Prevent height from growing when deleting lines.
		this.textArea.style.height = this.textArea.scrollHeight + 'px';
	}

	render() {
		return (
			<AppLayout title="Honeymoon donation - Mr & Mrs Browne 2018">
				<Head>
					<script src="//js.stripe.com/v3/" key="stripe-elements-api" />
					<link
						key="material-icons"
						rel="stylesheet"
						href="//fonts.googleapis.com/icon?family=Material+Icons"
					/>
					<link
						key="fancy-fonts"
						rel="stylesheet"
						href="//fonts.googleapis.com/icon?family=Great+Vibes"
					/>
					<link
						key="stripe-payment-fonts"
						rel="stylesheet"
						href="//fonts.googleapis.com/icon?family=Source+Code+Pro|Source+Sans+Pro:400,400i"
					/>
					<link
						key="uikit-stylesheet"
						rel="stylesheet"
						href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.min.css"
					/>
				</Head>
				<div className="donation-page">
					<div className="donate-screen uk-padding-small">
						<header className="donation-header uk-margin">
							<img src="/assets/y&d-logo.png" />
							<h1>Honeymoon Fund</h1>
						</header>
						<p className="message">
							Many kisses we've shared, and many things we've got.<br/>
							In lieu of a present, a monetary gift would help a lot.<br/>
							A special honeymoon is our wish,<br/>
							A wonderful experience together is worth more than a wish.
						</p>
						<p className="message footer-message uk-text-muted">
							With lots and lots of love<br/>
							Yasmin & Daryl xx
						</p>
						<StripeProvider stripe={this.state.stripe}>
							<div style={{maxWidth: 600, padding: 30, margin: 'auto'}}>
								<div className="uk-margin uk-text-center">
									<label>Donation amont</label>
									<TopUp
										minValue={30}
										value={this.state.donateAmount}
										onChange={value => this.setState({ donateAmount: value })}
									/>
								</div>
								<div className="uk-margin uk-text-left uk-margin-large-top">
									<label className="uk-form-label">Enter an email address</label>
									<input
										type="email"
										className="uk-input"
										value={this.state.email}
										placeholder="Your email address"
										onChange={e => this.setState({ email: e.target.value })}
									/>
									<small>A payment receipt will be sent to the email address given above</small>
								</div>
								<div className="uk-margin uk-text-left">
									<label className="">Your message to the bride and groom</label>
									<textarea
										className="uk-textarea"
										placeholder="Enter your message here"
										value={this.props.personalMessage}
										onChange={this.onTextAreaChange}
										ref={ref => this.textArea = ref}
									/>
								</div>
								<Elements>
									<PaymentForm
										onSubmit={this.confirmOrder}
										amount={this.state.donateAmount * 100}
									/>
								</Elements>
							</div>
						</StripeProvider>
						<div ref={ref => this.confirmModal = ref} data-uk-modal={true}>
							<div className="uk-modal-dialog uk-modal-body">
								<h2 className="uk-modal-title">Please confirm</h2>
								<p>A donation of £{this.state.donateAmount} will be charged to the card provided. press ok to confirm.</p>
								<p className="uk-text-right">
									<button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
									<button className="uk-button uk-button-primary" type="button">Confirm</button>
								</p>
							</div>
						</div>
					</div>
				</div>
			</AppLayout>
		);
	}
}
