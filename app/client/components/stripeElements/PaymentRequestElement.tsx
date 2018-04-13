import { Component } from 'react';
import { injectStripe, PaymentRequestButtonElement } from 'react-stripe-elements';

class PaymentRequestForm extends Component {
	state = {
		canMakePayment: false,
		paymentRequest: null,
	};

	setPaymentRequestObject(stripe) {
		if (this.state.paymentRequest) {
			return;
		}

		const paymentRequest = stripe.paymentRequest({
			country: 'GB',
			currency: 'gbp',
			total: {
				label: 'Demo total',
				amount: 1000,
			},
		});

		paymentRequest.on('token', ({complete, token, ...data}) => {
			console.log('Received Stripe token: ', token);
			console.log('Received customer information: ', data);
			complete('success');
		});

		paymentRequest.canMakePayment().then(result => {
			this.setState({canMakePayment: !!result});
		});

		this.setState({ paymentRequest });
	}

	componentDidMount() {
		if (this.props.stripe) {
			this.setPaymentRequestObject(this.props.stripe);
		}
	}

	componentWillReceiveProps(props) {
		if (props.stripe && !this.props.stripe) {
			this.setPaymentRequestObject(props.stripe);
		}
	}

	render() {
		return this.state.canMakePayment ? (
			<PaymentRequestButtonElement
				paymentRequest={this.state.paymentRequest}
				className="PaymentRequestButton"
				style={{
					paymentRequestButton: {
						theme: 'light',
						height: '64px',
					},
				}}
			/>
		) :
		null;
	}
}

export default injectStripe(PaymentRequestForm);
