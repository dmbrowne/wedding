import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import Router from 'next/router';
import moment, { Moment } from 'moment';
import { createEvent } from '../api/event';
import EventForm, { EditFormValues } from '../components/EventEditForm';
import GalleryImage from '../../server/models/galleryImage';

interface State {
	name: string;
	slug: string;
	description: string;
	venueName: string;
	address: string;
	mapsLink: string;
	entryTime: Moment;
	startTime: Moment;
	endTime: Moment;
	image: GalleryImage;
}

type TextChangeKeyValue = keyof EditFormValues;

class NewEvent extends React.Component<any, State> {
	state = {
		name: '',
		slug: '',
		description: '',
		venueName: '',
		address: '',
		mapsLink: '',
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
			slug: this.state.slug,
			venueName: this.state.venueName,
			address: this.state.address,
			mapsLink: this.state.mapsLink,
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
						slug={this.state.slug}
						description={this.state.description}
						startTime={this.state.startTime}
						endTime={this.state.endTime}
						entryTime={this.state.entryTime}
						image={this.state.image}
						venueName={this.state.venueName}
						address={this.state.address}
						mapsLink={this.state.mapsLink}
						onDateTimeStartChange={time => this.editEventDate(time, 'start')}
						onDateTimeEndChange={time => this.editEventDate(time, 'end')}
						onDateTimeEntryChange={time => this.editEventDate(time, 'entry')}
						onNameChange={name => this.setState({ name })}
						onDescriptionChange={description => this.setState({ description })}
						onImageChange={(galleryImage) => this.setState({ image: galleryImage })}
						onSlugChange={(slug) => this.setState({ slug })}
						onVenueChange={(venueName) => this.setState({ venueName })}
						onAddressChange={(address) => this.setState({ address })}
						onMapsLinkChange={(mapsLink) => this.setState({ mapsLink })}
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
