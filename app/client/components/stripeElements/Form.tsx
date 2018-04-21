import "./form.scss";
import { Component } from 'react';
import { injectStripe, ReactStripeElements } from 'react-stripe-elements';
import CardData from './CardElement';
import PaymentRequestElement from './PaymentRequestElement';

interface Props extends ReactStripeElements.InjectedStripeProps {
	onSubmit: (token: ReactStripeElements.PatchedTokenResponse['token']) => any;
	amount: number;
}

class PaymentForm extends Component<Props> {
	textArea: HTMLTextAreaElement = null;

	state = {
		paymentRequestEnabled: false,
	};

	handleSubmit = (ev) => {
		ev.preventDefault();

		// Within the context of `Elements`, this call to createToken knows which Element to
		// tokenize, since there's only one in this group.
		this.props.stripe.createToken().then(({token, error}) => {
			if (error) {
				return this.setState({ error });
			}
			this.props.onSubmit(token);
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<PaymentRequestElement
					paymentRequestEnabled={enabled => this.setState({ paymentRequestEnabled: enabled })}
					amount={this.props.amount}
					submit={this.props.onSubmit}
				/>
				<div className="card-entry-section">
					<p className="instruction">Or enter your card details below</p>
					<CardData />
					<button className="uk-button uk-button-primary uk-text-center">Donate by card</button>
				</div>
			</form>
		);
	}
}

export default injectStripe(PaymentForm);
