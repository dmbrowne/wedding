import * as React from 'react';
import cx from 'classnames';
import css from './titlebar.scss';

export default ({children, onMenuPress}) => (
	<div className={css.titlebar}>
		<i
			onClick={onMenuPress}
			className={cx('material-icons', css.menu)}
		>
			menu
		</i>
		<h3 className={css.title}>{children}</h3>
	</div>
)