import './gallery.scss';
import * as React from 'react';
import moment from 'moment';
import { withAdmin } from '../components/adminLayout';
import withModal, { ChildProps } from '../components/withModal';
import { getAllImages, deleteImage, uploadImage } from '../api/gallery';
import AddNewImageModal from '../components/AddNewImageModal';
import GalleryListing from '../components/GalleryListing';

interface Props extends ChildProps {}

class Gallery extends React.Component<Props> {
	static getInitialProps = async ({ req, res }) => {
		const galleryImages = res ?
			res.locals.galleryImages :
			await getAllImages();

		return {
			galleryImages,
		};
	}


	state = {
		activeImage: null,
		galleryImages: [],
		addImageModal: false,
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
		});
	}

	hideAddImageModal = () => {
		this.setState({
			addImageModal: false,
		});
	}

	uploadSuccess = async (response) => {
		console.log(response);
		this.setState({
			galleryImages: await getAllImages(),
		});
		this.hideAddImageModal();
	}

	uploadFail = (err) => {
		alert(JSON.stringify(err));
	}

	render() {
		return (
			<div className="uk-padding">
				{this.state.addImageModal && (
					<AddNewImageModal
						onClose={this.hideAddImageModal}
						onUploadSuccess={this.uploadSuccess}
						onUploadFail={this.uploadFail}
					/>
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
					<GalleryListing
						galleryImages={this.state.galleryImages}
						onImageClick={(imgObj, idx) => this.selectImage(imgObj, idx)}
					/>
					{this.state.activeImage && (
						<aside className="details-pane">
							<header>
								Details
								<i
									className="material-icons"
									onClick={() => this.setState({ activeImage: null})}
								>
									close
								</i>
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
