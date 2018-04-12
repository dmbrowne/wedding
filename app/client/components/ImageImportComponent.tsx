import './imageImportComponent.scss';
import React from 'react';
import AddNewImageModal from './AddNewImageModal';
import GalleryListing from './GalleryListing';
import GalleryImage from '../../server/models/galleryImage';

interface Props {
	onSelect: (galleryImage: GalleryImage) => any;
	onClose?: () => any;
}

interface State {
	uploadMode: 'gallery' | 'upload';
}

export default class ImageImportComponent extends React.Component<Props, State> {
	state = {
		uploadMode: null,
	};

	modeTitle() {
		switch (this.state.uploadMode) {
			case 'gallery':
				return 'Add image from gallery';
			case 'upload':
				return 'Select a file to upload';
			default:
				return 'Add an image';
		}
	}

	select = (galleryImage) => {
		this.props.onSelect(galleryImage);
	}

	uploadFail(err) {
		alert(JSON.stringify(err));
	}

	render() {
		return (
			<div className="uk-custom-modal">
				{this.props.onClose && (
					<i onClick={this.props.onClose} className="close material-icons">close</i>
				)}
				<header className="uk-modal-header">
					{!!this.state.uploadMode && (
						<i
							onClick={() => this.setState({ uploadMode: null})}
							className="material-icons"
						>
							arrow_back
						</i>
					)}
					<h2 className="uk-modal-title">{this.modeTitle()}</h2>
				</header>
				<div className="uk-modal-body">
					<div className="import-gallery-component uk-text-center">
						{!this.state.uploadMode && (
							<React.Fragment>
								<header className="uk-text-center">Add an image</header>
								<div className="uk-margin upload-buttons">
									<button
										onClick={() => this.setState({ uploadMode: 'upload'})}
										className="uk-button uk-button-primary"
									>
										Upload from device
									</button>
									<button
										onClick={() => this.setState({ uploadMode: 'gallery'})}
										className="uk-button uk-button-primary"
									>
										Insert from gallery
									</button>
								</div>
							</React.Fragment>
						)}
						{this.state.uploadMode === 'upload' && (
							<AddNewImageModal
								onUploadSuccess={this.select}
								onUploadFail={this.uploadFail}
							/>
						)}
						{this.state.uploadMode === 'gallery' && (
							<GalleryListing onImageClick={this.select} />
						)}
					</div>
				</div>
			</div>
		);
	}
}
