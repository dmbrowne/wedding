import React from 'react';

const SelectedAttendees = ({ attendeesMap, onClick }) => (
	<React.Fragment>
		{Object.keys(attendeesMap).map(attendeeId => {
			const attendee = attendeesMap[attendeeId];
			return (
				<div
					key={`selected-attendee-${attendeeId}`}
					className="uk-card uk-card-default uk-card-small uk-margin"
				>
					{/* <div className="uk-card-badge uk-label">Primary</div> */}
					<div className="uk-card-header uk-flex uk-flex-middle">
						<i className="material-icons">account_circle</i>
						<div className="uk-margin-left">
							<h5 className="uk-card-title uk-margin-remove-bottom">{attendee.firstName} {attendee.lastName}</h5>
							<p className="uk-text-meta uk-margin-remove-top">
								<time>{attendee.email}</time>
							</p>
						</div>
					</div>
					<div className="uk-card-body uk-clearfix">
						<button
							onClick={() => onClick(attendeeId)}
							style={{fontSize: '0.8rem'}}
							className="uk-button uk-button-text uk-float-right uk-margin-left"
						>
							Remove from group
						</button>
						{/* <button
							style={{fontSize: '0.8rem'}}
							className="uk-button uk-button-link uk-float-right"
						>
							Make Primary
						</button> */}
					</div>
				</div>
			);
		})}
	</React.Fragment>
);

export default SelectedAttendees;
