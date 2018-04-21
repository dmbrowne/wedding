import './addressSection.scss';
import * as React from 'react';
import OrnateDivider from '../icons/OrnateDivider';
import LinearOrnament from '../icons/LinearOrnament';
import CornerOrnamantSwirl from '../icons/CornerOrnamentSwirl';
import FloralSwirl from '../icons/FloralSwirl';
import moment from 'moment';

const LocationAddress = event => (
	<address>
		<p className="date" style={{ margin: '30px 0' }}>{moment(event.startTime).format('Do MMMM YYYY')}</p>
		<p><span className="venue-name">{event.venueName}</span></p>
		<p style={{whiteSpace: 'pre-line'}}>{event.address}</p>
		{event.mapsLink && <a href={event.mapsLink} target="_blank">
			<small>View map</small>
			<i className="material-icons">map</i>
		</a>}
	</address>
);

const CeremonySection = (event) => (
	<div className="section section-where" style={event.featureImage ? {backgroundImage: event.featureImage} : {}}>
		<h2 className="section-title"><span>where &</span>When</h2>
		<div className="ornate-divider">
			<OrnateDivider colour="#e0b278" />
		</div>
		<p className="fancy">The Ceremony will be held on</p>
		<LocationAddress {...event} />
		<div className="caligraphy-divider">
			<LinearOrnament colour="#e0b278" />
		</div>
		<time>
			Please arrive by: <span>{moment(event.entryTime).format('h:mm a')}</span>
		</time>
	</div>
);

const ReceptionSection = (event) => {
	return (
		<div className="section section-reception">
			<h2 className="section-title"><span>where &</span>When</h2>
			<div className="bg" style={event.featureImage ? { backgroundImage: `url(${event.featureImage.url})` } : {}}/>
			<div className="corner-ornament">
				<CornerOrnamantSwirl colour={'#e0e0e0'} />
			</div>
			<div className="floral-ornament">
				<FloralSwirl />
			</div>
			<div className="yd-container">
				<p className="fancy">The reception will commence on</p>
				<LocationAddress {...event} />
				<div className="caligraphy-divider">
					<LinearOrnament colour="#e0b278" />
				</div>
				<time>
					Starts from: <span>{moment(event.startTime).format('h:mm a')}</span>
				</time>
			</div>
		</div>
	);
};

const getEventComponent = (eventSlug) => {
	switch (eventSlug) {
		case 'reception':
			return ReceptionSection;
		case 'ceremony':
			return CeremonySection;
		default:
			return () => null;
	}
};

export default function AddressSection(props) {
	return (
		<React.Fragment>
			{props.events && !!props.events.length && props.events.map(event => {
				const EventComponent = getEventComponent(event.slug);
				return (
					<EventComponent key={event.id} {...event} />
				);
			})}
		</React.Fragment>
	);
}
