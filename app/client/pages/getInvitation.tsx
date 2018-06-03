import React from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import '../styles/getInvitation.scss';

interface Props {
	invalidEmail?: string;
}
interface State {
	windowHeight: number;
	emailAddress: string;
	loading: boolean;
}

class GetInvite extends React.Component<Props, State> {
	static getInitialProps = ({query}) => {
		return {
			invalidEmail: query && query.emailNotRecognised,
		};
	}

	state = {
		windowHeight: 400,
		emailAddress: '',
		loading: false,
	};

	componentDidMount() {
		this.setState({ windowHeight: window.innerHeight });
	}

	render() {
		return (
			<AppLayout title="Get your invite - Mr & Mrs Browne 2018" id="get-invitation" style={{height: this.state.windowHeight}}>
				<Head>
					<link
						key="google-fonts"
						href="https://fonts.googleapis.com/css?family=Great+Vibes|Roboto+Condensed:300,400,700"
						rel="stylesheet"
					/>
					<link key="material-icons" rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" />
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-rc.4/css/uikit.min.css" />
					<meta key="metatag-viewport" name="viewport" content="width=device-width, initial-scale=1.0" />
				</Head>

				<div className="bg" />
				<div className="content">
					<div className="uk-container">
						{!!this.props.invalidEmail &&
							<div className="alert">
								<strong>An invitation with the email <em>{this.props.invalidEmail}</em> cannot be found.</strong><br/>
								It needs to be the same email you gave to Daryl or Yasmin previously for your invite. Plese double check and try again.
							</div>
						}
						<form method="post" className="uk-margin-large">
							<input
								name="email"
								placeholder="Enter your email"
								type="text"
								className="uk-input uk-form-large"
								value={this.state.emailAddress}
								onChange={e => this.setState({ emailAddress: e.target.value})}
							/>
							<div className="uk-margin">
								<button className="uk-button uk-button-primary" onClick={() => this.setState({ loading: true })}>
									{this.state.loading ? 'FINDING YOUR INVITE' : 'GET MY INVITE'}
									{this.state.loading && <i className="material-icons rotating">sync</i>}
								</button>
							</div>
						</form>
					</div>
				</div>
			</AppLayout>
		);
	}
}

export default GetInvite;
