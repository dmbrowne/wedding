import * as React from 'react';
import BridalParty from '../../server/models/bridalParty';
import BridalPartyRole from '../../server/models/bridalPartyRoles';
import AddOrReplaceImage from './image/AddOrReplaceImage';
import GalleryImage from '../../server/models/galleryImage';

interface WrapperProps {
	bridalParty?: BridalParty;
	roleOptions: BridalPartyRole[];
	onChange: <C>(C) => any;
}

interface WrapperStateTextFields {
	firstName: string;
	lastName: string;
	comment: string;
	subRole: string;
	vip: boolean;
	order: number;
}

interface WrapperState {
	bridalParty: Partial<BridalParty>;
	roleOptions: WrapperProps['roleOptions'];
}

interface BridalFormProps {
	bridalParty: Partial<BridalParty>;
	roleOptions: BridalPartyRole[];
	onTextChange: (key: keyof WrapperStateTextFields, value: any) => any;
	onImageChange: (image: GalleryImage) => any;
	onRoleChange: (imageId: number) => any;
}

const BridalPartyForm = (props: BridalFormProps) => {
	const { bridalParty, roleOptions, onTextChange, onImageChange, onRoleChange } = props;
	return (
		<div className="uk-form">
			<div className="uk-margin">
				<input
					type="text"
					className="uk-input"
					value={bridalParty.firstName}
					placeholder="First name"
					onChange={e => onTextChange('firstName', e.target.value)}
				/>
			</div>
			<div className="uk-margin">
				<input
					type="text"
					className="uk-input"
					placeholder="Last name"
					value={bridalParty.lastName}
					onChange={e => onTextChange('lastName', e.target.value)}
				/>
			</div>
			<div className="uk-margin">
				<input
					type="text"
					className="uk-input"
					placeholder="Say something nice"
					value={bridalParty.comment}
					onChange={e => onTextChange('comment', e.target.value)}
				/>
			</div>
			<div className="uk-margin">
				<select
					className="uk-select"
					onChange={e => onRoleChange(parseInt(e.target.value, 10))}
					value={bridalParty.partyRoleId}
				>
					<option value={0}>--- Select a role ---</option>
					{roleOptions.map(role => (
						<option key={role.id} value={role.id}>{role.name}</option>
					))}
				</select>
			</div>
			<div className="uk-margin">
				<label>
					<input
						type="checkbox"
						className="uk-checkbox"
						checked={bridalParty.vip || false}
						onChange={e => onTextChange('vip', e.target.checked)}
					/> V.I.P.
				</label>
			</div>
			<div className="uk-margin">
				<input
					type="text"
					className="uk-input"
					placeholder="Sub role"
					value={bridalParty.subRole}
					onChange={e => onTextChange('subRole', e.target.value)}
				/>
			</div>
			<div className="uk-margin">
				<label>Order</label>
				<input
					type="number"
					step="1"
					className="uk-input"
					placeholder="Order"
					value={bridalParty.order}
					onChange={e => onTextChange('order', e.target.value)}
				/>
			</div>
			<div className="uk-margin">
				<AddOrReplaceImage
					image={bridalParty.Image}
					onImageChange={(galleryImage: GalleryImage) => onImageChange(galleryImage)}
				/>
			</div>
		</div>
	);
};

export default class BridalPartyFormDataWrapper extends React.Component<WrapperProps, WrapperState> {
	componentWillMount() {
		this.setState({
			bridalParty: this.props.bridalParty || {
				firstName: '',
				lastName: '',
				comment: '',
				subRole: '',
				partyRoleId: 0,
				imageId: null,
				vip: false,
				order: 1,
			},
			roleOptions: this.props.roleOptions || [],
		});
	}

	updateTextField(key: keyof WrapperStateTextFields, value: string) {
		this.setState({
			...this.state,
			bridalParty: {
				...this.state.bridalParty,
				[key]: value,
			},
		}, () => this.props.onChange(this.state));
	}

	updateImage = (image: GalleryImage) => {
		this.setState({
			...this.state,
			bridalParty: {
				...this.state.bridalParty,
				Image: image,
				imageId: image.id,
			},
		}, () => this.props.onChange(this.state));
	}

	updateRole = (roleId: number) => {
		this.setState({
			...this.state,
			bridalParty: {
				...this.state.bridalParty,
				partyRoleId: roleId,
			},
		}, () => this.props.onChange(this.state));
	}

	render() {
		return (
			<BridalPartyForm
				bridalParty={this.state.bridalParty}
				roleOptions={this.state.roleOptions}
				onTextChange={(key, value) => this.updateTextField(key, value)}
				onImageChange={this.updateImage}
				onRoleChange={this.updateRole}
			/>
		);
	}
}
