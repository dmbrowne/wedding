import * as React from 'react';
import { withAdmin } from '../components/adminLayout';
import withModal, { ChildProps } from '../components/withModal';
import Router from 'next/router';
import moment, { Moment } from 'moment';
import { editEvent, deleteEvent } from '../api/event';
import EventForm from '../components/EventEditForm';
import Event from '../../server/models/event';
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

interface Props extends ChildProps {
	event: Event;
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
			slug: this.props.event.slug,
			venueName: this.props.event.venueName,
			address: this.props.event.address,
			mapsLink: this.props.event.mapsLink,
			description: this.props.event.description || '',
			startTime: moment(this.props.event.startTime),
			endTime: moment(this.props.event.endTime),
			entryTime: moment(this.props.event.entryTime),
			image: this.props.event.featureImage,
		});
	}

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
			entryTime: this.state.entryTime.toDate(),
			startTime: this.state.startTime.toDate(),
			endTime: this.state.endTime.toDate(),
			imageId: this.state.image.id,
		};
		editEvent(this.props.event.id, dataInput).then(() => {
			Router.push('/admin/events');
		})
		.catch(e =>  {
			console.error(e);
			alert('Ooops, there was problem updating this event');
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
					slug={this.state.slug}
					description={this.state.description}
					startTime={this.state.startTime}
					endTime={this.state.endTime}
					venueName={this.state.venueName}
					address={this.state.address}
					mapsLink={this.state.mapsLink}
					onDateTimeStartChange={time => this.editEventDate(time, 'start')}
					onDateTimeEndChange={time => this.editEventDate(time, 'end')}
					onNameChange={name => this.setState({ name })}
					onDescriptionChange={description => this.setState({ description })}
					onSlugChange={slug => this.setState({ slug })}
					entryTime={this.state.entryTime}
					image={this.state.image}
					onDateTimeEntryChange={time => this.editEventDate(time, 'entry')}
					onImageChange={(galleryImage) => this.setState({ image: galleryImage })}
					onVenueChange={(venueName) => this.setState({ venueName })}
					onAddressChange={(address) => this.setState({ address })}
					onMapsLinkChange={(mapsLink) => this.setState({ mapsLink })}
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
