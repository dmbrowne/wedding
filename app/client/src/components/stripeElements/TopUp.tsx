import './topUp.scss';
import * as React from 'react';

interface Props {
	onChange: (donateAmount: number) => any;
	minValue: number;
	maxValue?: number;
	value: number;
}

export default class TopUp extends React.Component<Props> {
	incrementUnitAmount(decrease?: boolean) {
		const { value } = this.props;
		if (value < 100) {
			return 10;
		} else if (value === 100 && decrease) {
			return 10;
		}
		return 50;
	}

	increase = () => {
		const value = this.props.maxValue && this.props.value >= this.props.maxValue ?
			this.props.maxValue :
			this.props.value + this.incrementUnitAmount();
		this.props.onChange(value);
	}

	decrease = () => {
		const value = this.props.value <= this.props.minValue ?
			this.props.minValue :
			this.props.value - this.incrementUnitAmount(true);
		this.props.onChange(value);
	}

	render() {
		return (
			<div className="topup-buttons-container">
				<button onClick={this.decrease} className="uk-button uk-button-primary uk-button-small topup-button">
					<i className="material-icons">remove</i>
				</button>
				<div className="topup-amount-value">£{this.props.value}</div>
				<button onClick={this.increase} className="uk-button uk-button-primary uk-button-small topup-button">
					<i className="material-icons">add</i>
				</button>
			</div>
		);
	}
}
