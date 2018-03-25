import * as React from 'react';
import adminCss from '../styles/admin.scss';
import cx from 'classnames';

interface Props {
	onChange: (e) => any;
	data: any[];
	renderRow: (item) => any;
}

export default class AutoCompleteSearch extends React.Component<Props, any> {
	state = {
		inputIsFocused: false,
	};

	focusTimeout = null;

	onBlur = () => {
		this.focusTimeout = setTimeout(() => {
			this.setState({ inputIsFocused: false });
		}, 500);
	}

	onFocus = () => {
		if (this.focusTimeout && this.focusTimeout.clearTimeout) {
			this.focusTimeout.clearTimeout();
		}
		this.setState({ inputIsFocused: true });
	}

	render() {
		return (
			<React.Fragment>
				<input
					className={adminCss['form-control']}
					type="search"
					onChange={this.props.onChange}
					autoFocus={false}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
				/>
				{this.state.inputIsFocused && (
					<ul className={cx(adminCss['list-group'])}>
						{this.props.data.map(this.props.renderRow)}
					</ul>
				)}
			</React.Fragment>
		);
	}
}
