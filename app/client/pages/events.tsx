import * as React from 'react';
import Link from 'next/link';
import { withAdmin } from '../components/adminLayout';
import { IEvent } from '../../server/types/models';
import CheckboxTable from '../components/CheckboxTable';

interface Props {
	events: IEvent[];
}

class Events extends React.Component<Props> {
	static getInitialProps = async ({ res }) => {
		return {
			events: (res ?
				res.locals.events :
				[]
			),
		};
	}

	renderHeader() {
		return (
			<tr>
				<th>Name</th>
				<th style={{width: 50, boxSizing: 'border-box' }} />
				<th style={{width: 50, boxSizing: 'border-box' }} />
			</tr>
		);
	}

	renderRow(eventItem, onCheckboxTick, itemIsChecked) {
		return (
			<tr key={`eventItem-row-${eventItem.id}`}>
				<td>{eventItem.name}</td>
				<td>
					<Link href={`/admin/events/${eventItem.id}`}>
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
				<h2>The Events that kick off on your day, before, and maybe after</h2>
				<p className="uk-margin-large-bottom">
					Pre-wedding dinner, bridal shower, or how about after party?<br/>add them here.
				</p>
				<CheckboxTable
					data={this.props.events}
					renderHeaderRow={this.renderHeader}
					renderRow={this.renderRow}
					// onDelete={(ids) => deleteAttendees(ids)}
					buttons={(
						<Link prefetch={true} href="/eventsCreate" as="/admin/events/new">
							<button className="uk-button-small uk-float-left uk-button uk-button-primary">Add</button>
						</Link>
					)}
				/>
			</div>
		);
	}
}

export default withAdmin({ title: 'Events' }, Events);
