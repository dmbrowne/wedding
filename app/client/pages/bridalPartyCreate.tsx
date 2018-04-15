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

class BridalPartyCreate extends React.Component<Props> {
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
		const { firstName, lastName, comment, partyRoleId, imageId, subRole, vip } = this.state.input.bridalParty;
		const promise = this.props.bridalPartyMemberExists ?
			updateBridalParty(this.props.bridalParty.id, { firstName, lastName, comment, partyRoleId, imageId, subRole, vip }) :
			createBridalParty({ firstName, lastName, comment, partyRoleId, imageId, subRole, vip });

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
