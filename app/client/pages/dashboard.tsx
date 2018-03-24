import * as React from 'react';
import { withAdmin } from '../components/adminLayout';

const Dashboard = () => (
	<div>
		<h1>This is the dashboard</h1>
	</div>
);

export default withAdmin({title: 'Dashboard'}, Dashboard);
