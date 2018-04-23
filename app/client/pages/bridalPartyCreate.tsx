import * as React from 'react';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import BridalPartyForm from '../components/BridalPartyForm';
import BridalParty from '../../server/models/bridalParty';
import BridalPartyRole from '../../server/models/bridalPartyRoles';
import { getBridalPartyRoles, createBridalParty, updateBridalParty, getBridalParty } from '../api/bridalParty';

interface Props {
	bridalParty?: BridalParty;
	bridalPartyRoleOptions: BridalPartyRole[];
	bridalPartyMemberExists: boolean;
}

interface State {
	input: {
		bridalParty: {
			firstName: string;
			lastName: string;
			comment: string;
			partyRoleId: number;
			imageId: string;
			subRole: string;
			vip: boolean;
		};
	};
}
class BridalPartyCreate extends React.Component<Props, State> {
	static getInitialProps = async ({ res, query }) => {
		const bridalParty = res ?
			res.locals.bridalParty :
			await getBridalParty(query.bridalPartyId);
		const bridalPartyRoleOptions = res ?
			res.locals.bridalPartyRoles :
			await getBridalPartyRoles();

		return {
			bridalPartyMemberExists: !!bridalParty,
			bridalParty,
			bridalPartyRoleOptions,
		};
	}

	onChange = (values) => {
		this.setState({
			input: values,
		});
	}

	save = () => {
		const promise = this.props.bridalPartyMemberExists ?
			updateBridalParty(this.props.bridalParty.id, { ...this.state.input.bridalParty }) :
			createBridalParty({ ...this.state.input.bridalParty });

		promise
			.then(() => Router.push('/admin/bridalParties'))
			.catch(() => alert('Error creating new bridal party member'));
	}

	render() {
		return (
			<div className="uk-container">
				<BridalPartyForm
					bridalParty={this.props.bridalParty}
					roleOptions={this.props.bridalPartyRoleOptions}
					onChange={this.onChange}
				/>
				<button onClick={this.save} className="uk-button uk-button-primary">
					Save
				</button>
			</div>
		);
	}
}

export default withAdmin({ title: 'Bridal Party'}, BridalPartyCreate);
