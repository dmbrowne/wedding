import './services.scss';
import moment from 'moment-timezone';
import Event from '../../../server/models/event';

export default function Services(props: { events: Event[] }) {
	let showTimeGapNote = false;
	if (props.events.length === 2) {
		showTimeGapNote = props.events.filter(event => {
			return (event.slug === 'ceremony' || event.slug ===  'reception');
		}).length === 2;
	}
	return (
		<div className="section section-services">
			<h2 className="section-title"><span>Order of the</span>Day</h2>
			<div className="services">
				{props.events && props.events.map(occurence => {
					const startDate = moment(occurence.startTime);
					return (
						<div className="event-box-wrapper" key={occurence.id}>
							<div className="event-box">
								<h2 className="event-title"><span>{occurence.name}</span></h2>
								<div className="details">
									<span className="day">{startDate.tz("Europe/London").format('dddd')}</span>
									<span className="date">{startDate.tz("Europe/London").format('MMMM D YYYY')}</span>
									<span className="time">{startDate.tz("Europe/London").format('hh:mm a')}</span>
								</div>
								<p>{occurence.description}</p>
							</div>
						</div>
					);
				})}
			</div>
			{showTimeGapNote && (
				<div className="side-note">
					<p>
						<span>*</span>
						Please note, that between the ceremony and wedding reception, there will be a considerable time gap. This is to allow close family to have a sit down with the newly weds, before the wedding reception starts in the evening.
					</p>
					<p>
						Whilst we would love for you to attend both the Ceremony and the Reception, we understand if you only choose to attend one
					</p>
				</div>
			)}
		</div>
	);
}
