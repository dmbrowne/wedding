import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import Router from 'next/router';
import moment, { Moment } from 'moment';
import { createEvent } from '../api/event';
import EventForm from '../components/EventEditForm';
import GalleryImage from '../../server/models/galleryImage';

interface State {
	name: string;
	description: string;
	entryTime: Moment;
	startTime: Moment;
	endTime: Moment;
	image: GalleryImage;
}

class NewEvent extends React.Component<any, State> {
	state = {
		name: '',
		description: '',
		startTime: moment(),
		endTime: moment(),
		entryTime: moment(),
		image: null,
	};

	editEventDate(time: Moment, timeType: 'start' | 'end' | 'entry') {
		let key;
		if (timeType === 'start') {
			key = 'startTime';
		} else if (timeType === 'end') {
			key = 'endTime';
		} else if (timeType === 'entry') {
			key = 'entryTime';
		}
		this.setState({ [key]: time });
	}

	submit() {
		const dataInput = {
			name: this.state.name,
			description: this.state.description || null,
			entryTime: this.state.startTime.toDate(),
			startTime: this.state.startTime.toDate(),
			endTime: this.state.endTime.toDate(),
			imageId: this.state.image.id,
		};
		createEvent(dataInput).then(result => {
			Router.push('/admin/events');
		})
		.catch(e => {
			alert('Oops something went wrong');
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
						entryTime={this.state.entryTime}
						image={this.state.image}
						onDateTimeStartChange={time => this.editEventDate(time, 'start')}
						onDateTimeEndChange={time => this.editEventDate(time, 'end')}
						onNameChange={name => this.setState({ name })}
						onDescriptionChange={description => this.setState({ description })}
						onDateTimeEntryChange={time => this.editEventDate(time, 'entry')}
						onImageChange={(galleryImage) => this.setState({ image: galleryImage })}
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
