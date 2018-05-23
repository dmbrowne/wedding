import React from 'react';

interface Item {
	id: string;
	[key: string]: any;
}

interface Props {
	data: Item[] | {[key: string]: Item};
	headerFields: Array<keyof Item>;
	bodyFields: Array<keyof Item>;
	onRemove: (itemId: Item['id']) => any;
}

interface State {
	searchTerms: string;
}

export default class FilterList extends React.Component<Props, State> {
	state = {
		searchTerms: '',
	};

	filteredItems() {
		if (Array.isArray(this.props.data)) {
			return this.props.data.filter(item => {
				const searchField = Object.keys(item).map(key => item[key]).join(' ');
				return this.state.searchTerms ? searchField.indexOf(this.state.searchTerms) >= 0 : true;
			});
		}
		const matchingIds = Object.keys(this.props.data).filter(key => {
			const item: Item = this.props.data[key];
			const searchField = Object.keys(item).map(Itemkey => item[Itemkey]).join(' ');
			return this.state.searchTerms ? searchField.indexOf(this.state.searchTerms) >= 0 : true;
		});
		return  matchingIds.map(filteredItemKey => this.props.data[filteredItemKey]) as Item[];
	}

	render() {
		const items = this.filteredItems();
		const { headerFields, bodyFields, onRemove } = this.props;
		const { searchTerms } = this.state;
		return (
			<div>
				<input
					type="search"
					className="uk-input"
					value={searchTerms}
					onChange={e => this.setState({ searchTerms: e.target.value })}
					placeholder="filter attendees"
				/>
				<dl className="uk-description-list uk-description-list-divider uk-margin">
					{items.map(item => {
						if (this.props.renderRow) {
							return this.props.renderRow(item);
						}

						return (
							<React.Fragment key={item.id}>
								<dt className="uk-flex uk-flex-middle uk-flex-between">
									<div>
										{headerFields.map(fieldName => item[fieldName]).join(' ')}
									</div>
									<i className="material-icons" onClick={() => onRemove(item.id)}>
										delete
									</i>
								</dt>
								<dd>{bodyFields.map(fieldName => item[fieldName]).join(' ') || '-'}</dd>
							</React.Fragment>
						);
					})}
				</dl>
			</div>
		)
	}
}
