import * as React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import { deleteAttendees } from '../api/attendee';

const Attendees = (props) => (
	<div>
		<AdminLayout title="Attendees">
		<div className="uk-clearfix uk-margin">
			<Link prefetch href="/attendeeCreate" as="/admin/attendees/new">
				<button className="uk-float-right uk-button uk-button-primary">Add</button>
			</Link>
		</div>
		<div className="uk-overflow-auto">
			<table className="uk-table uk-table-justify uk-table-divider">
				<thead>
					<tr>
						<th className="uk-width-1-4">First name</th>
						<th className="uk-width-1-4">Last name</th>
						<th className="uk-width-2-4">Email</th>
						<th className="uk-shrink"></th>
						<th className="uk-shrink"></th>
					</tr>
				</thead>
				<tbody>
					{props.attendees.map(attendee =>
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
								<input type="checkbox" className="uk-checkbox" value={attendee.id} />
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
		</AdminLayout>
	</div>
)

Attendees.getInitialProps = async ({ req, res }) => {
	return {
		attendees: res ?
			res.locals.attendees :
			[]
	}
}
export default Attendees;