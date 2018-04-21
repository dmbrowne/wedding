import './HeroSection.scss';
import * as React from 'react';
import FireFlies from '../Fireflies';
import InfinityIcon from '../icons/Infinity';

export default function HeroSection(props) {
	return (
		<div className="section section-hero">
			<FireFlies>
				<div className="content">
					<header>
						<h1 className="title">The wedding of</h1>
					</header>
					<img className="emblem" src="/assets/emblem.png" />
					{/* <header>
						<h1 className="title">We're getting married!</h1>
					</header> */}
				</div>
			</FireFlies>
		</div>
	);
}
