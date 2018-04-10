import * as React from 'react';
import { injectStripe, CardElement } from 'react-stripe-elements';
import Head from 'next/head';

const style = {
	base: {
		'fontSize': '18px',
		'color': '#424770',
		'letterSpacing': '0.025em',
		'fontFamily': 'Source Code Pro, Menlo, monospace',
		'::placeholder': {
			color: '#aab7c4',
		},
	},
	invalid: {
		color: '#9e2146',
	},
};

class CardDataCollection extends React.Component {
	state = {
		error: null,
	};

	render() {
		return (
			<div>
				<Head>
					<link
						href="//fonts.googleapis.com/css?family=Source+Code+Pro|Source+Sans+Pro"
						rel="stylesheet"
						key="source-code-pro"
					/>
				</Head>
				<label style={{fontFamily: 'Source Sans Pro', margin: '30px 0 10px'}}>
					Card details
				</label>
				<CardElement style={style} onChange={e => this.setState({error: e.error})}/>
				{this.state.error && (
					<div className="card-errors uk-alert uk-alert-danger" role="alert">
						{this.state.error.message}
					</div>
				)}
			</div>
		);
	}
}

export default injectStripe(CardDataCollection);

