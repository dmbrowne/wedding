import { Component } from 'react';
import { injectStripe, ReactStripeElements } from 'react-stripe-elements';
import CardData from './CardElement';
import PaymentRequestElement from './PaymentRequestElement';

interface Props extends ReactStripeElements.InjectedStripeProps {
	onSubmit: (token: ReactStripeElements.PatchedTokenResponse['token']) => any;
	personalMessage: string;
	onMessageChange: (personalMessage: string) => any;
}

class PaymentForm extends Component<Props> {
	textArea: HTMLTextAreaElement = null;

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

	onTextAreaChange = e => {
		this.props.onMessageChange(e.target.value);
		this.textArea.style.height = '80px'; // Prevent height from growing when deleting lines.
		this.textArea.style.height = this.textArea.scrollHeight + 'px';
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<CardData />
				<PaymentRequestElement />
				<div className="uk-text-center uk-margin-large">
					<textarea
						className="uk-textarea"
						value={this.props.personalMessage}
						onChange={this.onTextAreaChange}
						ref={ref => this.textArea = ref}
					/>
					<button className="uk-button uk-button-primary uk-width-1-1">Confirm donation</button>
				</div>
			</form>
		);
	}
}

export default injectStripe(PaymentForm);
