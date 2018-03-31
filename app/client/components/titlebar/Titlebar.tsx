import * as React from 'react';
import cx from 'classnames';
import './titlebar.scss';

export default ({children, onMenuPress}) => (
	<div className="titlebar">
		<i
			onClick={onMenuPress}
			className="material-icons menu"
		>
			menu
		</i>
		<h3 className={'title'}>{children}</h3>
	</div>
);
