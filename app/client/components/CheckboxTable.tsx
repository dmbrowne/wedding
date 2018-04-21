import './checkboxTable.scss';
import * as React from 'react';
import withModal, { ChildProps } from './withModal';

interface RowItem {
	id: string;
	[key: string]: any;
}

interface Props {
	data: RowItem[];
	renderHeaderRow?: () => React.ReactNode;
	renderRow: (I: RowItem, onCheckboxClick: (e) => any, itemIsChecked: boolean, ...arrayMapArguments) => React.ReactNode;
	onDelete: (ids: string[]) => void;
	buttons?: React.ReactNode;
	bulkButtons?: React.ReactNode;
	bulk: boolean;
	onSelect?: (selected: { [key: string]: RowItem; }) => any;
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

		if (this.props.onSelect) {
			this.props.onSelect(newSelectedState);
		}
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
		.then(() => {
			this.props.onDelete(selectedIdsForDeletion);
			this.exitBulkMode();
		})
		.catch(() => undefined);
	}

	renderRow = (item, ...args) => {
		const itemIsChecked = this.state.selected[item.id] || false;
		return this.props.renderRow(item, this.onCheckboxClick.bind(this, item.id), itemIsChecked, ...args);
	}

	exitBulkMode = () => {
		if (this.props.onSelect) {
			this.props.onSelect(null);
		}
		this.setState({ selected: {} });
	}

	selectAll = () => {
		const inputCheckedData = this.props.data.reduce((accum, {id}) => {
			return {
				...accum,
				[id]: true,
			};
		}, {});
		if (this.props.onSelect) {
			this.props.onSelect(inputCheckedData);
		}
		this.setState({ selected: inputCheckedData });
	}

	bulkModeButtons() {
		return (
			<React.Fragment>
				{!!this.props.bulkButtons && this.props.bulkButtons}
				<button
					onClick={this.exitBulkMode}
					className="uk-button-small uk-button uk-button-default uk-margin-left"
				>
					Cancel
				</button>
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
				<div>
					<div className="uk-clearfix uk-margin menu-bar" data-uk-sticky={true}>
						{this.props.buttons}
						{this.props.bulk && (
							<div className="uk-float-right">
								{this.state.bulkMode && this.bulkModeButtons()}
								{!!this.props.data.length && (
									<button
										onClick={this.selectAll}
										className="uk-button-small uk-button uk-button-text uk-margin-left"
									>
										Select all
									</button>
								)}
							</div>
						)}
					</div>
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
