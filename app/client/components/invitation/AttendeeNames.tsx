import * as React from 'react';
import { IAttendee } from '../../server/types/models';

export interface Props {
	attendees: IAttendee[];
}

export default function AttendeeNames(props: Props) {
	const attendeeDisplay = props.attendees.reduce((accum, attendee, idx) => {
		const fullName = attendee.firstName + ' ' + attendee.lastName;
		const connector = (props.attendees.length > 1 ?
			(idx + 2 === props.attendees.length ? ' and ' : ', ') :
			null
		);
		return [
			...accum,
			(
				<React.Fragment key={fullName}>
					<strong>{fullName}</strong>
					{connector}
				</React.Fragment>
			),
		];
	}, []);

	return (
		<React.Fragment>{attendeeDisplay}</React.Fragment>
	);
}
