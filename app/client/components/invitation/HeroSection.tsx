import './HeroSection.scss';
import * as React from 'react';
import FireFlies from '../Fireflies';
import InfinityIcon from '../icons/Infinity';

export default function HeroSection(props) {
	return (
		<div className="section section-hero">
			<FireFlies>
				<div className="content">
					<div />
					<img className="emblem" src="/assets/emblem.png" />
					<header>
						<h1 className="title">We're getting married!</h1>
						<div className="date" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<span>13</span>
								<InfinityIcon className="infinity-sign" colour="#fff" width={40} />
								<span>10</span>
							</div>
							<span>2018</span>
						</div>
					</header>
				</div>
			</FireFlies>
		</div>
	);
}
