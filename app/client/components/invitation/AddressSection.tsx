import './addressSection.scss';
import OrnateDivider from '../icons/OrnateDivider';
import LinearOrnament from '../icons/LinearOrnament';

export default function AddressSection(props) {
	return (
		<div className="section section-where">
			<h2 className="section-title"><span>where &</span>When</h2>
			<div className="ornate-divider">
				<OrnateDivider colour="#e0b278" />
			</div>
			<address>
				<p>The <span>Islington Town Hall</span></p>
				<p>Upper Street</p>
				<p>N1 2UD</p>
				<a href="https://goo.gl/maps/pY1sYiJEwA72" target="_blank">
					<small>open in google maps</small>
					<i className="material-icons">map</i>
				</a>
			</address>
			<div className="caligraphy-divider">
				<LinearOrnament colour="#e0b278" />
			</div>
			<time>
				Be there for: <span>5'o'Clock</span>
			</time>
		</div>
	);
}
