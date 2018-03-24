import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withAdmin } from '../components/adminLayout';
import { deleteAttendees } from '../api/attendee';
import { IAttendee } from '../../server/types/models';
import withModal from '../components/withModal';

class Attendees extends React.Component<{ attendees: IAttendee[] }> {
	static getInitialProps = async ({ res }) => {
		return {
			attendees: (res ?
				res.locals.attendees :
				[]
			),
		};
	}

	state = {
		bulkMode: false,
		selected: {},
	};

	onCheckboxClick(e: { target: { checked: boolean }}, attendeeId: IAttendee['id']) {
		const { checked } = e.target;
		const newSelectedState = {
			...this.state.selected,
			[attendeeId]: checked,
		};

		const newState = {
			selected: newSelectedState,
		};

		this.setState(newState);
	}

	componentDidUpdate(_, {selected}) {
		const bulkMode = Object.keys(this.state.selected).some(attendeeId => {
			return !!this.state.selected[attendeeId];
		});

		if (this.state.bulkMode !== bulkMode) {
			this.setState({ bulkMode });
		}
	}

	confirmDelete = () => {
		const selectedIdsForDeletion = Object.keys(this.state.selected).filter(attendeeId => {
			return this.state.selected[attendeeId];
		});

		this.props.showConfirmModal({
			title: 'Are you sure',
			body: 'This operation is irreversable and cannot be undone. Are you sure you would like to delete the selected attendees?',
		})
		.then(() => deleteAttendees(selectedIdsForDeletion))
		.then(() => Router.push('/admin/attendees'))
		.catch(() => undefined);
	}

	renderRow = (attendee) => {
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
						checked={this.state.selected[attendee.id] || false}
						onChange={(e) => this.onCheckboxClick(e, attendee.id)}
					/>
				</td>
			</tr>
		);
	}

	bulkModeButtons() {
		return (
			<React.Fragment>
				<button onClick={this.exitBulkMode} className="uk-button-small uk-button uk-button-default">Cancel</button>
					<button
						className="uk-button-small uk-button uk-button-danger uk-margin-left"
						onClick={this.confirmDelete}
					>
						Delete
					</button>
			</React.Fragment>
		);
	}

	selectAll = () => {
		const attendeeCheckMap = this.props.attendees.reduce((accum, {id}) => {
			return {
				...accum,
				[id]: true,
			};
		}, {});
		this.setState({ selected: attendeeCheckMap });
	}

	exitBulkMode = () => {
		this.setState({ selected: {} });
	}

	render() {
		return (
			<div>
				<div className="uk-clearfix uk-margin">
					<Link prefetch={true} href="/attendeeCreate" as="/admin/attendees/new">
						<button className="uk-button-small uk-float-left uk-button uk-button-primary">Add</button>
					</Link>
					<div className="uk-float-right">
						{this.state.bulkMode && this.bulkModeButtons()}
						<button
							onClick={this.selectAll}
							className="uk-button-small uk-button uk-button-text uk-margin-left"
						>
							Select all
						</button>
					</div>
				</div>
				<div className="uk-overflow-auto">
					<table className="uk-table uk-table-justify uk-table-divider">
						<thead>
							<tr>
								<th className="uk-width-1-4">First name</th>
								<th className="uk-width-1-4">Last name</th>
								<th className="uk-width-2-4">Email</th>
								<th className="uk-shrink" />
								<th className="uk-shrink" />
							</tr>
						</thead>
						<tbody>
							{this.props.attendees.map(this.renderRow)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default withModal(withAdmin({ title: 'Attendees'}, Attendees));
