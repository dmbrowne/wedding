import './donate.scss';
import * as React from 'react';
import Head from 'next/head';
import { StripeProvider, Elements } from 'react-stripe-elements';
import PaymentForm from '../components/stripeElements/Form';
import TopUp from '../components/stripeElements/TopUp';
import { restfulRequest } from '../api/utils';

export default class StripeTestPage extends React.Component {
	state = {
		stripe: null,
		donateAmount: 50,
		donationSuccessful: false,
	};

	submit(token) {
		return restfulRequest({
			route: 'charge',
			method: 'POST',
			body: JSON.stringify({
				amount: this.state.donateAmount * 100,
				token: token.id,
				description: 'Test Charge!!',
			}),
		})
		.then(() => this.setState({ donationSuccessful : true }))
		.catch(() => this.setState({ donationSuccessful : false }));
	}

	confirmOrder = (token) => {
		this.UIkit.modal.confirm(
			`A donation of £${this.state.donateAmount} will be charged to the card provided. press confirm to confirm.`,
		)
		.then(
			() => this.submit(token),
			() => null,
		);
	}

	componentDidMount() {
		this.UIkit = window.UIkit;
		this.setState({
			stripe: window.Stripe('pk_test_gbZv1zKSysff7KprihcWi6ms'),
			windowHeight: document.body.clientHeight,
		});
	}

	render() {
		return (
			<div className="donation-page">
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
						href="//fonts.googleapis.com/icon?family=Source+Code+Pro|Source+Sans+Pro"
					/>
					<link
						key="uikit-stylesheet"
						rel="stylesheet"
						href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.min.css"
					/>
					<script src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/js/uikit.min.js" />
				</Head>
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
						<p className="message uk-text-muted">
							Many kisses we've shared, and many things we've got.<br/>
							In lieu of a present, a monetary gift would help a lot.<br/>
							A special honeymoon is our wish,<br/>
							A wonderful experience together is worth more than a wish.
						</p>
						<p className="message">
							With lots and lots of love<br/>
							Yasmin & Daryl xx
						</p>
						<StripeProvider stripe={this.state.stripe}>
							<div style={{maxWidth: 600, padding: 30, margin: 'auto'}}>
								<div className="uk-margin uk-text-center">
									<label>Donation amont</label>
									<TopUp
										minValue={50}
										value={this.state.donateAmount}
										onChange={value => this.setState({ donateAmount: value })}
									/>
								</div>
								<Elements>
									<PaymentForm onSubmit={this.confirmOrder} />
								</Elements>
							</div>
						</StripeProvider>
						<div ref={ref => this.confirmModal = ref} data-uk-modal={true}>
							<div className="uk-modal-dialog uk-modal-body">
								<h2 className="uk-modal-title">Please confirm</h2>
								<p>A donation of £{this.state.donateAmount} will be charged to the card provided. press confirm to confirm.</p>
								<p className="uk-text-right">
									<button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
									<button className="uk-button uk-button-primary" type="button">Confirm</button>
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
