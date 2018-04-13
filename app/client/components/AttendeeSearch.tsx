import * as React from 'react';
import cx from 'classnames';
import AutoCompleteSearch from './AutoCompleteSearch';
import '../styles/admin.scss';

interface Props {
	onClick: (item) => any;
	data: any[];
	onChange: (e: React.MouseEvent<HTMLElement>) => any;
}

export default class AttendeeSearch extends React.Component<Props> {
	renderRow = (attendee) => {
		const { SendGroup } = attendee;
		return (
			<li
				key={attendee.id}
				className="list-group-item"
				onClick={() => this.props.onClick(attendee)}
			>
				<article className="uk-comment">
					<header className="uk-comment-header uk-flex uk-flex-middle">
						<i className="uk-float-left material-icons">account_circle</i>
						<div className="uk-float-left">
							<h4 className="uk-comment-title uk-margin-remove">
								{attendee.firstName} {attendee.lastName}&nbsp;
								{SendGroup && SendGroup.id && <span className="uk-badge">{SendGroup.name}</span>}
							</h4>
							<ul className="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
								<li>{attendee.email}</li>
							</ul>
						</div>
					</header>
				</article>
			</li>
		);
	}

	render() {
		return (
			<AutoCompleteSearch
				data={this.props.data}
				onChange={this.props.onChange}
				renderRow={this.renderRow}
			/>
		);
	}
}
