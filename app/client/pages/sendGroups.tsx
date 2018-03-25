import * as React from 'react';
import Link from 'next/link';
import { withAdmin } from '../components/adminLayout';
import { deleteSendGroups } from '../api/sendGroup';
import { ISendGroup } from '../../server/types/models';
import CheckboxTable from '../components/CheckboxTable';

class SendGroups extends React.Component<{ sendGroups: ISendGroup[] }> {
	static getInitialProps = async ({ res }) => {
		return {
			sendGroups: (res ?
				res.locals.sendGroups :
				[]
			),
		};
	}

	renderHeader() {
		return (
			<tr>
				<th>Group name</th>
				<th>Members</th>
				<th style={{width: 50, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow(sendGroup, onCheckboxTick, itemIsChecked) {
		const attendees = sendGroup.Attendees;
		const attendeeNamesDisplay = attendees.length ?
			attendees.map(attendee => `${attendee.firstName} ${attendee.lastName}`).join(', ') :
			'none';

		return (
			<tr key={`sendGroup-row-${sendGroup.id}`}>
				<td className="uk-width-small">{sendGroup.name || '-'}</td>
				<td className="uk-text-meta uk-text-lowercase">{attendeeNamesDisplay}</td>
				<td>
					<Link href={`/admin/sendgroups/${sendGroup.id}`}>
						<i className="material-icons">mode_edit</i>
					</Link>
				</td>
				<td>
					<input
						type="checkbox"
						className="uk-checkbox"
						checked={itemIsChecked}
						onChange={(e) => onCheckboxTick(e)}
					/>
				</td>
			</tr>
		);
	}

	render() {
		return (
			<div>
				<h2>Grouped Invitations</h2>
				<p className="uk-margin-large-bottom">
					As some attendees may not have provided an email address, their RSVP can be
					handled by someone else who is invited, as long as they grouped together. Do that here.
				</p>
				<CheckboxTable
					data={this.props.sendGroups}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					onDelete={(ids) => deleteSendGroups(ids)}
					buttons={(
						<Link prefetch={true} href="/attendeeCreate" as="/admin/sendgroups/new">
							<button className="uk-button-small uk-float-left uk-button uk-button-primary">Add</button>
						</Link>
					)}
				/>
			</div>
		);
	}
}

export default withAdmin({ title: 'Attendees'}, SendGroups);
