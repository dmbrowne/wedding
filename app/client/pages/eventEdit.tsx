import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import withModal, { ChildProps } from '../components/withModal';
import Router from 'next/router';
import moment, { Moment } from 'moment';
import { editEvent, deleteEvent } from '../api/event';
import EventForm from '../components/EventEditForm';
import { IEvent } from '../../server/types/models';

interface State {
	name: string;
	description: string;
	startTime: Moment;
	endTime: Moment;
}

interface Props extends ChildProps {
	event: IEvent;
}

class EditEventPage extends React.Component<Props, State> {
	static getInitialProps = async ({ res }) => {
		const props = !!res ?
			{event: res.locals.event} :
			{event: {}};

		return props;
	}

	componentWillMount() {
		this.setState({
			name: this.props.event.name,
			description: this.props.event.description || '',
			startTime: moment(this.props.event.startTime),
			endTime: moment(this.props.event.endTime),
		});
	}

	editEventDate(time: Moment, timeType: 'start' | 'end') {
		let key;
		if (timeType === 'start') {
			key = 'startTime';
		} else if (timeType === 'end') {
			key = 'endTime';
		}
		this.setState({ [key]: time });
	}

	submit() {
		const dataInput = {
			name: this.state.name,
			description: this.state.description || null,
			startTime: this.state.startTime.toDate(),
			endTime: this.state.endTime.toDate(),
		};
		editEvent(this.props.event.id, dataInput).then(() => {
			Router.push('/admin/events');
		});
	}

	onDelete = () => {
		this.props.showConfirmModal({
			title: 'Are you sure',
			body: 'This operation is irreversable, are you sure you want to delete this event',
			primaryText: 'Yes',
			secondaryText: 'No',
		})
		.then(() => {
			deleteEvent(this.props.event.id);
			Router.push('/admin/events');
		})
		.catch(() => void 0);
	}

	render() {
		return (
				<div className="uk-container">
					<EventForm
						name={this.state.name}
						description={this.state.description}
						startTime={this.state.startTime}
						endTime={this.state.endTime}
						onDateTimeStartChange={time => this.editEventDate(time, 'start')}
						onDateTimeEndChange={time => this.editEventDate(time, 'end')}
						onNameChange={name => this.setState({ name })}
						onDescriptionChange={description => this.setState({ description })}
					/>
					<div className="uk-clearfix">
						<div
							onClick={() => this.submit()}
							className="uk-button uk-button-primary uk-float-right"
						>
							Save
						</div>
						<div
							onClick={() => Router.push('/admin/events')}
							className="uk-button uk-button-default uk-margin-right uk-float-right"
						>
							Cancel
						</div>
					</div>
					<button
						onClick={this.onDelete}
						className="uk-button uk-button-link uk-text-danger"
					>
						Delete
					</button>
				</div>
		);
	}
}

export default withModal(
	withAdmin({ title: 'Events' }, EditEventPage),
);
