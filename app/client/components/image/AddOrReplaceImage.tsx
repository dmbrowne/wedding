import * as React from 'react';
import ImageImport from './ImageImport';
import GalleryImage from '../../../server/models/galleryImage';

interface Props {
	image: GalleryImage;
	onImageChange: (galleryImage: GalleryImage) => any;
}

export default class AddOrReplaceImage extends React.Component<Props> {
	state = {
		addImageMode: false,
	};

	imageChange = (galleryImage: GalleryImage) => {
		this.props.onImageChange(galleryImage);
		this.setState({ addImageMode: false });
	}

	render() {
		return (
			<div>
				{!!this.props.image ?
					(
						<React.Fragment>
							<div><img src={this.props.image.squareImage} /></div>
							<button
								onClick={() => this.setState({ addImageMode: true })}
								className="uk-button uk-button-small uk-button-danger uk-margin"
							>
								Change Image
							</button>
						</React.Fragment>
					) :
					(
						<div>
							<div className="uk-placeholder uk-margin">
								<button
									onClick={() => this.setState({ addImageMode: true })}
									className="uk-button uk-button-small uk-button-secondary uk-margin-large"
								>
									Add Image
								</button>
							</div>
						</div>
					)
				}
				{this.state.addImageMode && (
					<ImageImport
						onSelect={this.imageChange}
						onClose={() => this.setState({ addImageMode: false })}
					/>
				)}
			</div>
		);
	}
}
