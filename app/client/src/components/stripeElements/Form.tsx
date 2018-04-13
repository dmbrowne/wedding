import { Component } from 'react';
import { injectStripe, ReactStripeElements } from 'react-stripe-elements';
import CardData from './CardElement';
import PaymentRequestElement from './PaymentRequestElement';

interface Props extends ReactStripeElements.InjectedStripeProps {
	onSubmit: (token: ReactStripeElements.PatchedTokenResponse['token']) => any;
}

class PaymentForm extends Component<Props> {
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

		// However, this line of code will do the same thing:
		// this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<CardData />
				<PaymentRequestElement />
				<div className="uk-text-center uk-margin-large">
					<button className="uk-button uk-button-primary uk-button-large">Confirm donation</button>
				</div>
			</form>
		);
	}
}

export default injectStripe(PaymentForm);
