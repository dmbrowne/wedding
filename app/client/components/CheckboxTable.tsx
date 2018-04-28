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
	filterSearchTerms: string;
}

class DataItemListing extends React.Component<InternalProps, State> {
	static defaultProps = {
		bulk: true,
	};

	state = {
		bulkMode: false,
		selected: {},
		filterSearchTerms: '',
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

	filteredItems() {
		if (Array.isArray(this.props.data)) {
			return this.props.data.filter(dataItem => {
				const searchField = Object.keys(dataItem)
					.filter(key => typeof dataItem[key] === 'string')
					.map(key => dataItem[key].toLowerCase())
					.join(' ').trim();

				return !!this.state.filterSearchTerms ?
					searchField.indexOf(this.state.filterSearchTerms) >= 0 :
					true;
			});
		}
		return [];
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
					<div className="uk-margin">
						<input
							type="text"
							className="uk-input"
							placeholder="Filter..."
							onChange={e => this.setState({ filterSearchTerms: e.target.value.toLowerCase() })}
							value={this.state.filterSearchTerms}
						/>
					</div>
					<table className="uk-table uk-table-justify uk-table-divider">
						{this.props.renderHeaderRow &&
							<thead>
								{this.props.renderHeaderRow()}
							</thead>
						}
						<tbody>
							{this.filteredItems().map(this.renderRow)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default withModal(DataItemListing);
