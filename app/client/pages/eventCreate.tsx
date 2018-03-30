import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import Router from 'next/router';
import moment, { Moment } from 'moment';
import { createEvent } from '../api/event';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';

interface State {
	name: string;
	description: string;
	startTime: Moment;
	endTime: Moment;
}

moment.locale('en');

class NewEvent extends React.Component<any, State> {
	state = {
		name: '',
		description: '',
		startTime: moment(),
		endTime: moment(),
	};

	eventName = (e) => {
		this.setState({ name: e.target.value });
	}

	eventDescription = (e) => {
		this.setState({ description: e.target.value });
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
		createEvent(dataInput).then(result => {
			Router.push('/admin/events');
		});
	}

	render() {
		const { startTime, endTime, description, name } = this.state;
		return (
			<MuiPickersUtilsProvider
				utils={MomentUtils}
				moment={moment}
				locale="en"
			>
				<div>
					<form className="uk-grid-small uk-form-stacked uk-grid uk-margin">
						<div className="uk-width-1-1 uk-margin-top">
							<label className="uk-form-label">Event name</label>
							<input className="uk-input" value={name} type="text" placeholder="name of the event" onChange={this.eventName}/>
						</div>
						<div className="uk-width-1-2@s uk-margin-top">
							<label className="uk-form-label">Start date / time</label>
							<DateTimePicker
								value={startTime}
								onChange={momentTime => this.editEventDate(momentTime, 'start')}
							/>
						</div>
						<div className="uk-width-1-2@s uk-margin-top">
							<label className="uk-form-label">End date / time</label>
							<DateTimePicker
								value={endTime}
								onChange={momentTime => this.editEventDate(momentTime, 'end')}
							/>
						</div>
						<div className="uk-width-1-1 uk-margin-top">
							<label className="uk-form-label">Description</label>
							<textarea style={{minHeight: 100}} className="uk-textarea" value={description} onChange={this.eventDescription}/>
						</div>
					</form>
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
			</ MuiPickersUtilsProvider>
		);
	}
}

export default withAdmin({ title: 'Events' }, NewEvent);
