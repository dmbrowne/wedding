import * as React from 'react';
import { withAdmin } from '../components/adminLayout';

interface Props {

}

class FoodChoices extends React.Component<Props> {
	static getInitialProps = async ({ res }) => {
		return {
			attendees: !!res && res.locals.attendees ?
				res.locals.attendees :
				[],
		};
	}

	render() {
		return (
			<div className="uk-container"/>
		);
	}
}

export default withAdmin({ title: 'Attendee chosen foods' }, FoodChoices);
