import * as React from 'react';
import withModal, { ChildProps } from './withModal';

interface RowItem {
	id: string;
	[key: string]: any;
}

interface Props {
	data: RowItem[];
	renderHeaderRow?: () => React.ReactNode;
	renderRow: (I: RowItem, onCheckboxClick: (e) => any, itemIsChecked: boolean) => React.ReactNode;
	onDelete: (ids: string[]) => void;
	buttons?: React.ReactNode;
	bulk: boolean;
}

interface InternalProps extends Props, ChildProps {}

interface State {
	bulkMode: boolean;
	selected: {
		[key: string]: RowItem;
	};
}

class DataItemListing extends React.Component<InternalProps, State> {
	static defaultProps = {
		bulk: true,
	};

	state = {
		bulkMode: false,
		selected: {},
	};

	onCheckboxClick(itemId: string, e) {
		const { checked } = e.target;
		const newSelectedState = {
			...this.state.selected,
			[itemId]: checked,
		};

		this.setState({
			selected: newSelectedState,
		});
	}

	componentDidUpdate() {
		const bulkMode = Object.keys(this.state.selected).some(itemId => {
			return !!this.state.selected[itemId];
		});

		if (this.state.bulkMode !== bulkMode) {
			this.setState({ bulkMode });
		}
	}

	confirmDelete = () => {
		const selectedIdsForDeletion = Object.keys(this.state.selected).filter(itemId => {
			return this.state.selected[itemId];
		});

		this.props.showConfirmModal({
			title: 'Are you sure',
			body: 'This operation is irreversable and cannot be undone. \
				Are you sure you would like to delete the selected items?',
		})
		.then(() => this.props.onDelete(selectedIdsForDeletion))
		.catch(() => undefined);
	}

	renderRow = (item) => {
		const itemIsChecked = this.state.selected[item.id] || false;
		return this.props.renderRow(item, this.onCheckboxClick.bind(this, item.id), itemIsChecked);
	}

	exitBulkMode = () => {
		this.setState({ selected: {} });
	}

	selectAll = () => {
		const inputCheckedData = this.props.data.reduce((accum, {id}) => {
			return {
				...accum,
				[id]: true,
			};
		}, {});
		this.setState({ selected: inputCheckedData });
	}

	bulkModeButtons() {
		return (
			<React.Fragment>
				<button onClick={this.exitBulkMode} className="uk-button-small uk-button uk-button-default">Cancel</button>
					<button
						className="uk-button-small uk-button uk-button-danger uk-margin-left"
						onClick={this.confirmDelete}
					>
						Delete
					</button>
			</React.Fragment>
		);
	}

	render() {
		return (
			<div>
				<div className="uk-clearfix uk-margin">
					{this.props.buttons}
					{this.props.bulk && (
						<div className="uk-float-right">
							{this.state.bulkMode && this.bulkModeButtons()}
							<button
								onClick={this.selectAll}
								className="uk-button-small uk-button uk-button-text uk-margin-left"
							>
								Select all
							</button>
						</div>
					)}
				</div>
				<div className="uk-overflow-auto">
					<table className="uk-table uk-table-justify uk-table-divider">
						{this.props.renderHeaderRow &&
							<thead>
								{this.props.renderHeaderRow()}
							</thead>
						}
						<tbody>
							{this.props.data.map(this.renderRow)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default withModal(DataItemListing);
