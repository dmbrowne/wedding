import './services.scss';
import moment from 'moment';

export default function Services(props) {
	return (
		<div className="section section-services">
			<h2 className="section-title"><span>Order of</span>Service</h2>
			<div className="services">
				{props.events && props.events.map(occurence => {
					const startDate = moment(occurence.startTime);
					return (
						<div className="event-box-wrapper" key={occurence.id}>
							<div className="event-box">
								<h2 className="event-title"><span>{occurence.name}</span></h2>
								<div className="details">
									<span className="day">{startDate.format('dddd')}</span>
									<span className="date">{startDate.format('MMMM D YYYY')}</span>
									<span className="time">{startDate.format('hh:mm a')}</span>
								</div>
								<p>{occurence.description}</p>
							</div>
						</div>
					);
				})}
			</div>
			{/* {this.state.noBreakfast && <div className="side-note">
				<p>
					<span>*</span>
					Please note, that between the ceremony and wedding reception, there will be a slight time gap. This is to allow close family to have a sit down with the newly weds, before the wedding reception starts in the evening.
				</p>
				<p>
					Whilst we would love for you to attend both, we understand your reservations if you only choose to attend one
				</p>
			</div>} */}
		</div>
	);
}
