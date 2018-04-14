import './addressSection.scss';
import * as React from 'react';
import OrnateDivider from '../icons/OrnateDivider';
import LinearOrnament from '../icons/LinearOrnament';
import CornerOrnamantSwirl from '../icons/CornerOrnamentSwirl';
import FloralSwirl from '../icons/FloralSwirl';

export default function AddressSection(props) {
	return (
		<React.Fragment>
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

			<div className="section section-reception">
				<h2 className="section-title"><span>where &</span>When</h2>
				< div className="bg" />
				<div className="corner-ornament">
					<CornerOrnamantSwirl colour={'#e0e0e0'} />
				</div>
				<div className="floral-ornament">
					<FloralSwirl />
				</div>
				<div className="yd-container">
					<address>
						<p><span>Vanilla London</span></p>
					</address>
					<p>
						Please come along to our wedding reception, it would be great to have your presence at this very special time
					</p>
					<address>
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
			</div>
		</React.Fragment>
	);
}
