import { Component } from 'react';
import { ReactStripeElements, injectStripe, PaymentRequestButtonElement } from 'react-stripe-elements';

interface Props {
	paymentRequestEnabled: (enabled: boolean) => any;
	amount: number;
	submit: (token: ReactStripeElements.PatchedTokenResponse['token']) => any;
	stripe?: ReactStripeElements.StripeProps;
}

class PaymentRequestForm extends Component<Props> {
	state = {
		canMakePayment: false,
		paymentRequest: null,
	};

	setPaymentRequestObject = (props) => {
		if (this.state.paymentRequest) {
			return;
		}

		const paymentRequest = props.stripe.paymentRequest({
			country: 'GB',
			currency: 'gbp',
			total: {
				label: 'Demo total',
				amount: props.amount,
			},
		});

		paymentRequest.on('token', ({complete, token, ...data}) => {
			this.props.submit(token);
		});

		paymentRequest.canMakePayment().then(result => {
			props.paymentRequestEnabled(!!result);
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
			this.setPaymentRequestObject(props);
		}
	}

	render() {
		return this.state.canMakePayment ? (
			<PaymentRequestButtonElement
				paymentRequest={this.state.paymentRequest}
				className="PaymentRequestButton"
				style={{
					paymentRequestButton: {
						theme: 'dark',
						height: '64px',
					},
				}}
			/>
		) :
		null;
	}
}

export default injectStripe(PaymentRequestForm);
