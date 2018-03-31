import * as React from 'react';
import Link from 'next/link';
import { withAdmin } from '../components/adminLayout';
import { deleteAttendees, getAllAttendees } from '../api/attendee';
import { IAttendee } from '../../server/types/models';
import CheckboxTable from '../components/CheckboxTable';

class Attendees extends React.Component<{ attendees: IAttendee[] }> {
	static getInitialProps = async ({ res }) => {
		return {
			attendees: (res ?
				res.locals.attendees :
				await getAllAttendees()
			),
		};
	}

	renderHeader() {
		return (
			<tr>
				<th>First name</th>
				<th>Last name</th>
				<th className="uk-expand">Email</th>
				<th style={{width: 50, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow(attendee, onCheckboxTick, itemIsChecked) {
		return (
			<tr key={`attendee-row-${attendee.id}`}>
				<td>{attendee.firstName}</td>
				<td>{attendee.lastName}</td>
				<td>{attendee.email}</td>
				<td>
					<Link href={`/admin/attendees/${attendee.id}`}>
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
			<div className="uk-container">
				<h2>Everyone that you would like to come.</h2>
				<p className="uk-margin-large-bottom">No matter which events you would like them to attend, this list represents
					the total people you would like to attend throughout the day</p>
				<CheckboxTable
					data={this.props.attendees}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					onDelete={(ids) => deleteAttendees(ids)}
					buttons={(
						<Link prefetch={true} href="/attendeeCreate" as="/admin/attendees/new">
							<button className="uk-button-small uk-float-left uk-button uk-button-primary">Add</button>
						</Link>
					)}
				/>
			</div>
		);
	}
}

export default withAdmin({ title: 'Attendees'}, Attendees);
