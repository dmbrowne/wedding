import './donateThankYou.scss';
import * as React from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';

export default class DonationThankYou extends React.Component {
	static getInitialProps = async ({ res }) => {
		return {
			amount: res && res.locals.amount ? res.locals.amount : null,
		};
	}

	render() {
		return (
			<AppLayout title="Thank you for your donation - Mr & Mrs Browne 2018">
				<Head>
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
						key="uikit-stylesheet"
						rel="stylesheet"
						href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.40/css/uikit.min.css"
					/>
				</Head>
				<div>
					<div className="uk-container uk-margin-large uk-margin-large-top">
					<header className="uk-margin">
						<h1>Thank you</h1>
					</header>
					{this.props.amount && <p>Your £{(this.props.amount / 100)} has been received.</p>}
					<p>Thank you very much for your donation and contributing to our dream honeymoon, it means a lot to us.</p>
					<p className="fancy">xx</p>
					<p className="uk-text-meta">You can close this window</p>
				</div>
				</div>
			</AppLayout>
		);
	}
}
