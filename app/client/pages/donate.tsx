import './donate.scss';
import * as React from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import { StripeProvider, Elements } from 'react-stripe-elements';
import PaymentForm from '../components/stripeElements/Form';
import TopUp from '../components/stripeElements/TopUp';
import SendGroup from '../../server/models/sendGroup';
import Attendee from '../../server/models/attendee';
import { restfulRequest } from '../api/utils';

interface Props {
	attendee?: Attendee;
	sendGroup?: SendGroup;
}

export default class StripeTestPage extends React.Component<Props> {
	static getInitialProps = async ({ res }) => {
		return {
			attendee: res ? res.locals.attendee : null,
			sendGroup: res ? res.locals.sendGroup : null,
		};
	}

	state = {
		stripe: null,
		donateAmount: 30,
		donationSuccessful: false,
		personalMessage: '',
	};

	submit(token) {
		return restfulRequest({
			route: 'charge',
			method: 'POST',
			body: JSON.stringify({
				amount: this.state.donateAmount * 100,
				token: token.id,
				description: 'Test Charge!!',
				message: this.state.personalMessage,
			}),
		})
		.then(() => this.setState({ donationSuccessful : true }))
		.catch(res => {
			res.json().then(error => {
				alert(error.message);
				this.setState({ donationSuccessful : false });
			});
		});
	}

	confirmOrder = (token) => {
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
				stripe: window.Stripe('pk_test_gbZv1zKSysff7KprihcWi6ms'),
				windowHeight: document.body.clientHeight,
			});
		}, 500);
	}

	render() {
		return (
			<AppLayout>
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
					{this.state.donationSuccessful ?
					(
						<div className="thank-you-screen" style={{height: this.state.windowHeight }}>
							<main>
								<header>
									<i className="material-icons">check</i>
									<h1>Thank you</h1>
								</header>
								<p>Thank you very much for your donation, it means a lot to us and hope you enjoy your time at our wedding</p>
							</main>
						</div>
					) :
					(
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
											minValue={20}
											value={this.state.donateAmount}
											onChange={value => this.setState({ donateAmount: value })}
										/>
									</div>
									<Elements>
										<PaymentForm
											onSubmit={this.confirmOrder}
											personalMessage={this.state.personalMessage}
											onMessageChange={personalMessage => this.setState({ personalMessage })}
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
					)}
				</div>
			</AppLayout>
		);
	}
}
