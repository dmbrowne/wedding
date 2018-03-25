import * as React from 'react';
import Link from 'next/link';
import { withAdmin } from '../components/adminLayout';
import { deleteAttendees } from '../api/attendee';
import { IAttendee } from '../../server/types/models';
import CheckboxTable from '../components/CheckboxTable';

class Attendees extends React.Component<{ attendees: IAttendee[] }> {
	static getInitialProps = async ({ res }) => {
		return {
			attendees: (res ?
				res.locals.attendees :
				[]
			),
		};
	}

	renderHeader() {
		return (
			<tr>
				<th>First name</th>
				<th>Last name</th>
				<th className="uk-expand">Email</th>
				<th className="uk-shrink" />
				<th className="uk-shrink" />
			</tr>
		);
	}

	renderRow(attendee, onCheckboxTick, itemIsChecked) {
		return (
			<tr key={`attendee-row-${attendee.id}`}>
				<td className="uk-width-1-4">{attendee.firstName}</td>
				<td className="uk-width-1-4">{attendee.lastName}</td>
				<td className="uk-width-2-4">{attendee.email}</td>
				<td className="uk-shrink">
					<Link href={`/admin/attendees/${attendee.id}`}>
						<i className="material-icons">mode_edit</i>
					</Link>
				</td>
				<td className="uk-shrink">
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
		);
	}
}

export default withAdmin({ title: 'Attendees'}, Attendees);
