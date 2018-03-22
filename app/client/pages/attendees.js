import * as React from 'react';
import cx from 'classnames';
import AdminLayout from '../components/AdminLayout'

const Attendees = () => (
	<div>
		<AdminLayout title="Attendees">
		<div className="uk-clearfix uk-margin">
			<button class="uk-float-right uk-button uk-button-primary uk-margin-small-left">Bulk Add</button>
			<button class="uk-float-right uk-button uk-button-primary">Add</button>
		</div>
		<div class="uk-overflow-auto">
			<table class="uk-table uk-table-justify uk-table-divider">
				<thead>
					<tr>
						<th className="uk-width-1-4">First name</th>
						<th className="uk-width-1-4">Last name</th>
						<th className="uk-width-2-4">Email</th>
					</tr>
				</thead>
			</table>
		</div>
		</AdminLayout>
	</div>
)

export default Attendees;