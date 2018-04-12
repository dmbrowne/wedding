import './galleryListing.scss';
import * as React from 'react';
import { getAllImages } from '../../api/gallery';
import {IGalleryImage} from '../../../server/types/models';

interface GalleryListingComponentProps {
	galleryImages: IGalleryImage[];
	onImageClick: <I>(galleryImage: I, index: number) => any;
}

const GalleryListing = ({ galleryImages, onImageClick }: GalleryListingComponentProps) => (
	<div className="image-gallery-listing">
		{galleryImages.length > 0 && galleryImages.map((galleryImage, idx) => {
			return (
				<div key={galleryImage.id} className="image-gallery-item">
					<img src={galleryImage.squareImage} onClick={() => onImageClick(galleryImage, idx)}/>
				</div>
			);
		})}
	</div>
);

interface GalleryListingProps {
	galleryImages?: IGalleryImage[];
	onImageClick: <I>(galleryImage: I, index: number) => any;
}

export default class GalleryListingDataConnect extends React.Component<GalleryListingProps> {
	state = {
		galleryImages: [],
	};

	setGalleryImages = async () => {
		const galleryImages = (this.props.galleryImages ?
			this.props.galleryImages :
			await getAllImages()
		);
		this.setState({ galleryImages });
	}

	componentDidMount() {
		this.setGalleryImages();
	}

	componentWillReceiveProps({ galleryImages: nextGalleryImages }: GalleryListingProps) {
		if (nextGalleryImages && nextGalleryImages !== this.props.galleryImages) {
			this.setState({ galleryImages: nextGalleryImages });
		}
	}

	refreshImages = async () => {
		const galleryImages = await getAllImages();
		this.setState({ galleryImages });
	}

	render() {
		return (
			<GalleryListing
				galleryImages={this.state.galleryImages}
				{...this.props}
			/>
		);
	}
}
