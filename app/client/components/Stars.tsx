import * as React from 'react';

/**
 * Star
 *
 * @param int x
 * @param int y
 * @param int length
 * @param opacity
 */
class Star {
	x: number;
	y: number;
	length: number;
	opacity: number;
	factor: number;
	increment: number;
	screenW: number;
	screenH: number;

	constructor(x, y, length, opacity, screenW, screenH) {
		this.x = parseInt(x, 10);
		this.y = parseInt(y, 10);
		this.length = parseInt(length, 10);
		this.opacity = opacity;
		this.factor = 1;
		this.increment = Math.random() * .03;
		this.screenW = screenW;
		this.screenH = screenH;
	}

	draw(context) {
		context.rotate((Math.PI * 1 / 10));
		// Save the context
		context.save();
		// move into the middle of the canvas, just to make room
		context.translate(this.x, this.y);

		// Change the opacity
		if (this.opacity > 1) {
			this.factor = -1;
		} else if (this.opacity <= 0) {
			this.factor = 1;
			this.x = Math.round(Math.random() * this.screenW);
			this.y = Math.round(Math.random() * this.screenH);
		}

		this.opacity += this.increment * this.factor;

		context.beginPath();

		for (let i = 5; i--;) {
			context.lineTo(0, this.length);
			context.translate(0, this.length);
			context.rotate((Math.PI * 2 / 10));
			context.lineTo(0, - this.length);
			context.translate(0, - this.length);
			context.rotate(-(Math.PI * 6 / 10));
		}

		context.lineTo(0, this.length);
		context.closePath();
		context.fillStyle = "rgba(255, 255, 230, " + this.opacity + ")";
		context.shadowBlur = 5;
		context.shadowColor = '#ffffff';
		context.fill();

		context.restore();
	}
}

export default class Stars extends React.Component {
	state = {
		width: null,
		height: null,
		canvasContext: null,
	};

	element: HTMLElement = null;
	canvas: HTMLCanvasElement = null;
	stars: Star[] = [];
	fps = 500;
	numStars = 800;

	componentDidMount() {
		this.canvas.width = this.element.offsetWidth;
		this.canvas.height = this.element.offsetHeight;
		this.setState({
			height: this.element.offsetHeight,
			width: this.element.offsetWidth,
			canvasContext: this.canvas.getContext('2d'),
		}, () => this.createStars());
	}

	createStars() {
		for (let i = 0; i < this.numStars; i++) {
			const x = Math.round(Math.random() * this.state.width);
			const y = Math.round(Math.random() * this.state.height);
			const length = 1 + Math.random() * 2;
			const opacity = Math.random();
			// Create a new star and draw
			const star = new Star(x, y, length, opacity, this.state.width, this.state.height);
			// Add the the stars array
			this.stars.push(star);
		}
		setInterval(() => this.animate(), 1000 / this.fps);
	}

	/**
	 * Animate the canvas
	 */
	animate() {
		this.state.canvasContext.clearRect(0, 0, this.state.width, this.state.height);
		this.stars.forEach(star => star.draw(this.state.canvasContext));
	}

	render() {
		return (
			<div ref={ref => this.element = ref} className="firefly-container">
				<canvas
					ref={ref => this.canvas = ref}
					style={{
						zIndex: 10,
						position: 'absolute',
						top: 0,
						left: 0,
					}}
				/>
				{this.props.children}
			</div>
		);
	}
}
