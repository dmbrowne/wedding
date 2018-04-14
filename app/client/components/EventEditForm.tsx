import * as React from 'react';
import moment, { Moment } from 'moment';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import GalleryImage from '../../server/models/galleryImage';
import AddOrReplaceImage from './image/AddOrReplaceImage';

export interface EditFormTextValues {
	name: string;
	slug: string;
	description: string;
	venueName: string;
	address: string;
	mapsLink: string;
}
interface Props extends EditFormTextValues {
	startTime: Moment;
	endTime: Moment;
	entryTime: Moment;
	image: GalleryImage;
	onNameChange: (name: string) => any;
	onDescriptionChange: (description: string) => any;
	onSlugChange: (slug: string) => any;
	onDateTimeEntryChange: (time: Moment) => any;
	onDateTimeStartChange: (time: Moment) => any;
	onDateTimeEndChange: (time: Moment) => any;
	onImageChange: (galleryImage: GalleryImage) => any;
	onVenueChange: (value: string) => any;
	onAddressChange: (value: string) => any;
	onMapsLinkChange: (value: string) => any;
}

moment.locale('en');

class EventForm extends React.Component<Props> {
	state = {
		addImageMode: false,
	};

	eventName = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onNameChange(e.target.value);
	}

	eventSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onSlugChange(e.target.value);
	}

	eventDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.props.onDescriptionChange(e.target.value);
	}

	onImageChange = (galleryImage: GalleryImage) => {
		this.props.onImageChange(galleryImage);
		this.setState({ addImageMode: false });
	}

	changeVenueName = (e) => {
		this.props.onVenueChange(e.target.value);
	}
	changeAddress = (e) => {
		this.props.onAddressChange(e.target.value);
	}
	changeMapsLink = (e) => {
		this.props.onMapsLinkChange(e.target.value);
	}

	render() {
		const {
			startTime, endTime, description, name, slug,
			onDateTimeStartChange, onDateTimeEndChange,
			entryTime, onDateTimeEntryChange, image,
			venueName, address, mapsLink
		} = this.props;
		return (
			<MuiPickersUtilsProvider
				utils={MomentUtils}
				moment={moment}
				locale="en"
			>
				<div>
					<div className="uk-grid-small uk-form-stacked uk-grid uk-margin">
						<div className="uk-width-1-1 uk-margin-top">
							<label className="uk-form-label">Event name</label>
							<input
								className="uk-input"
								value={name}
								type="text"
								placeholder="name of the event"
								onChange={this.eventName}
							/>
						</div>
						<div className="uk-width-1-1 uk-margin-top">
							<label className="uk-form-label uk-text-muted">Slug</label>
							<input
								className="uk-input uk-form-small"
								value={slug}
								type="text"
								placeholder="name of the event"
								onChange={this.eventSlug}
							/>
						</div>
						<div className="uk-width-1-2 uk-width-1-3@s uk-margin-top">
							<label className="uk-form-label">Entry date / time</label>
							<DateTimePicker
								value={entryTime}
								onChange={onDateTimeEntryChange}
							/>
						</div>
						<div className="uk-width-1-2 uk-width-1-3@s uk-margin-top">
							<label className="uk-form-label">Start date / time</label>
							<DateTimePicker
								value={startTime}
								onChange={onDateTimeStartChange}
							/>
						</div>
						<div className="uk-width-1-3@s uk-margin-top">
							<label className="uk-form-label">End date / time</label>
							<DateTimePicker
								value={endTime}
								onChange={onDateTimeEndChange}
							/>
						</div>
						<div className="uk-width-1-1 uk-margin-top">
							<label className="uk-form-label">Description</label>
							<textarea
								style={{minHeight: 100}}
								className="uk-textarea"
								value={description}
								onChange={this.eventDescription}
							/>
						</div>
						<div className="uk-margin uk-width-1-1 ">
							<label className="uk-form-label">Venue name</label>
							<input
								type="text"
								className="uk-input"
								value={venueName}
								onChange={this.changeVenueName}
							/>
						</div>
						<div className="uk-margin uk-width-1-1 ">
							<label className="uk-form-label">Address</label>
							<textarea
								style={{minHeight: 100}}
								className="uk-textarea"
								value={address}
								onChange={this.changeAddress}
							/>
						</div>
						<div className="uk-margin uk-width-1-1 ">
							<label className="uk-form-label">Google maps link:</label>
							<input
								type="text"
								className="uk-input"
								value={mapsLink}
								onChange={this.changeMapsLink}
							/>
						</div>
						<div className="uk-width-1-1 uk-margin-top uk-text-center">
							<AddOrReplaceImage
								onImageChange={this.props.onImageChange}
								image={image}
							/>
						</div>
					</div>
				</div>
			</ MuiPickersUtilsProvider>
		);
	}
}

export default EventForm;
