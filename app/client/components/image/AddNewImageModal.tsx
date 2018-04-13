import './addNewImageModal.scss';
import * as React from 'react';
import { uploadImage } from '../../api/gallery';
import { CloudinaryResponse } from '../../../server/models/galleryImage';

interface Props {
	onClose?: () => any;
	onUploadSuccess: (result: CloudinaryResponse) => any;
	onUploadFail: (error: Error) => any;
}

export default class AddNewImageModal extends React.Component<Props> {
	fileInput: HTMLInputElement;

	state = {
		addImagePreview: null,
		addImageFile: null,
	};

	onFileInputChange = (e) => {
		if (!e.target.files || !e.target.files[0]) {
			return;
		}

		const file = e.target.files[0];
		const reader = new FileReader();

		reader.addEventListener("load", () => {
			this.setState({ addImagePreview: reader.result });
		}, false);

		reader.readAsDataURL(file);
		this.setState({ addImageFile: file });
	}

	upload = () => {
		const form = new FormData();
		form.append('image', this.state.addImageFile);
		return uploadImage(form)
			.then(({result}) => this.props.onUploadSuccess(result))
			.catch(err => this.props.onUploadFail(err));
	}

	simulateInputFileClick = () => {
		this.fileInput.click();
	}

	render() {
		return (
			<div className="add-new-image-modal uk-section uk-section-small">
				<div className="uk-clearfix">
					{this.props.onClose && (
						<i
							onClick={this.props.onClose}
							className="material-icons uk-float-right"
							style={{marginRight: 30}}
						>
							close
						</i>
					)}
				</div>
				<div className="image-preview" onClick={this.simulateInputFileClick}>
					{this.state.addImagePreview ?
						<img src={this.state.addImagePreview} /> :
						<div className="uk-placeholder uk-text-muted">Click here to add a new image</div>
					}
				</div>
				<input ref={ref => this.fileInput = ref} type="file" onChange={this.onFileInputChange}/>
				{this.state.addImageFile && (
					<div className="uk-margin uk-text-center">
						<button
							onClick={this.upload}
							className="uk-button uk-button-primary"
						>
							Save
						</button>
					</div>
				)}
			</div>
		);
	}
}
