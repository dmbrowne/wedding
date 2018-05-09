import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import Donation from '../../server/models/donation';

interface Props {
	donations: Donation[];
}

class DonationsListing extends React.Component<Props> {
	static getInitialProps = async ({ res }) => {
		return {
			donations: !!res && res.locals.donations ?
				res.locals.donations :
				[],
		};
	}

	render() {
		return (
			<div className="uk-container">
				<h2>Donations</h2>
				<p className="uk-margin-large-bottom">
					Check here for donations that are made. Each donation will be listed here as soon as it is made
				</p>
				{this.props.donations && this.props.donations.length ?
					<div className="uk-grid uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@xl">
						{this.props.donations.map(donation => (
							<div key={donation.id} className="uk-margin-top uk-margin-bottom">
								<div className="uk-card uk-card-default uk-card-small uk-card-body uk-margin">
									<h3 className="uk-card-title">£{(donation.amount / 100).toFixed(2)}</h3>
									<p style={{whiteSpace: 'pre-line'}}>{donation.message}</p>
								</div>
							</div>
						))}
					</div> :
					<p className="uk-text-meta">There haven't been any donations made yet unfortuntely</p>
				}
			</div>
		);
	}
}

export default withAdmin({ title: 'Donations' }, DonationsListing);
