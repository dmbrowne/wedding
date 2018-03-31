import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import Router from 'next/router';
import moment, { Moment } from 'moment';
import { createEvent } from '../api/event';
import EventForm from '../components/EventEditForm';

interface State {
	name: string;
	description: string;
	startTime: Moment;
	endTime: Moment;
}

class NewEvent extends React.Component<any, State> {
	state = {
		name: '',
		description: '',
		startTime: moment(),
		endTime: moment(),
	};

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
		createEvent(dataInput).then(result => {
			Router.push('/admin/events');
		});
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
							Submit
						</div>
						<div
							onClick={() => Router.push('/admin/events')}
							className="uk-button uk-button-default uk-margin-right uk-float-right"
						>
							Cancel
						</div>
					</div>
				</div>
		);
	}
}

export default withAdmin({ title: 'Events' }, NewEvent);
