import './gallery.scss';
import * as React from 'react';
import moment from 'moment';
import { withAdmin } from '../components/adminLayout';
import withModal, { ChildProps } from '../components/withModal';
import { getAllImages, deleteImage, uploadImage } from '../api/gallery';

interface Props extends ChildProps {
	//
}

class Gallery extends React.Component<Props> {
	static getInitialProps = async ({ req, res }) => {
		const galleryImages = res ?
			res.locals.galleryImages :
			await getAllImages();

		return {
			galleryImages,
		};
	}

	fileInput: HTMLInputElement;

	state = {
		activeImage: null,
		galleryImages: [],
		addImageModal: false,
		addImagePreview: null,
		addImageFile: null,
	};

	componentWillMount() {
		this.setState({
			galleryImages: [...this.props.galleryImages],
		});
	}
	selectImage(imageObj, idx) {
		this.setState({ activeImage: {...imageObj, gridViewIdxPosition: idx } });
	}

	onDelete = () => {
		this.props.showConfirmModal({
			title: 'Are you sure?',
			body: 'Are you certain you want to delete this image, this action is irreversable?',
		})
		.then(() => deleteImage(this.state.activeImage.id))
		.then(() => {
			const galleryImages = this.state.galleryImages;
			galleryImages.splice(this.state.activeImage.gridViewIdxPosition, 1);
			this.setState({ galleryImages, activeImage: null });
		})
		.catch(() => void 0);
	}

	addImageButton() {
		return !this.state.addImageModal && (
			<div onClick={this.showAddImageModal} className="uk-margin">
				<button className="uk-button uk-button-primary">Add Image</button>
			</div>
		);
	}

	showAddImageModal = () => {
		this.setState({
			addImageModal: true,
			addImagePreview: null,
			addImageFile: null,
		});
	}

	hideAddImageModal = () => {
		this.setState({
			addImageModal: false,
			addImagePreview: null,
			addImageFile: null,
		});
	}

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
		uploadImage(form)
			.then(async () => {
				this.setState({
					galleryImages: await getAllImages(),
				});
				this.hideAddImageModal();
			})
			.catch(err => console.error(err));
	}

	simulateInputFileClick = () => {
		this.fileInput.click();
	}

	render() {
		return (
			<div className="uk-padding">
				{this.state.addImageModal && (
					<div className="add-new-image-modal uk-section uk-section-small uk-section-muted">
						<div className="uk-clearfix">
							<i
								onClick={this.hideAddImageModal}
								className="material-icons uk-float-right"
								style={{marginRight: 30}}
							>
								close
							</i>
						</div>
						<div className="image-preview" onClick={this.simulateInputFileClick}>
							{this.state.addImagePreview ?
								<img src={this.state.addImagePreview} /> :
								<div className="uk-placeholder">Click here to add a new image</div>
							}
							<input ref={ref => this.fileInput = ref} type="file" onChange={this.onFileInputChange} />
						</div>
						{this.state.addImageFile && (
							<div className="uk-margin uk-text-center">
								<button
									onClick={this.upload}
									className="uk-button uk-button-secondary"
								>
									Save
								</button>
							</div>
						)}
					</div>
				)}
				<h1>Image Gallery</h1>
				{this.state.galleryImages.length > 0 && this.addImageButton()}
				<div className="image-gallery">
					{this.state.galleryImages.length === 0 && (
						<div>
							<p>No Images have been added</p>
							{this.addImageButton()}
						</div>
					)}
					<div className="image-gallery-listing">
						{this.state.galleryImages.length > 0 && this.state.galleryImages.map((galleryImage, idx) => {
							return (
								<div key={galleryImage.id} className="image-gallery-item">
									<img src={galleryImage.squareImage} onClick={() => this.selectImage(galleryImage, idx)}/>
								</div>
							);
						})}
					</div>
					{this.state.activeImage && (
						<aside className="details-pane">
							<header>
								Details
								<i className="material-icons">close</i>
							</header>
							<img src={this.state.activeImage.url} />
							<div>
								<small>Public Id: {this.state.activeImage.publicId}</small>
							</div>
							<div>
								<small>Created: {moment(this.state.activeImage.createdAt).format('DD MMMM hh:mm')}</small>
							</div>
							<a href={this.state.activeImage.secureUrl} target="_blank">
								View <i className="material-icons">open_in_new</i>
							</a>
							<div className="uk-margin-large">
								<button
									onClick={this.onDelete}
									className="uk-button uk-button-danger"
								>
									Delete
								</button>
							</div>
						</aside>
					)}
				</div>
			</div>
		);
	}
}

export default withModal(withAdmin({title: 'Gallery'}, Gallery));
