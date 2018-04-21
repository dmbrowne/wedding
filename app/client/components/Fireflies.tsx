import React from 'react';

function onTransitionEnd(element, callback) {
	if ('transition' in document.documentElement.style) {
			element.addEventListener('transitionend', callback);
	} else {
		callback();
	}
}

function Circle(canvasContext, width, height, rint) {
	this.canvasContext = canvasContext;
	this.componentWidth = width;
	this.componentHeight = height;
	this.rint = rint;
	this.settings = {
		ttl: 8000,
		xmax: 1,
		ymax: 1,
		rmax: 1,
		rt: 2,
		xdef: 960,
		ydef: 540,
		xdrift: 3,
		ydrift: 3,
		random: true,
		blink: true,
	};

	this.reset = function() {
		const { random, xdef, ydef, rmax, xmax, ymax, ttl } = this.settings;

		this.x = (random ? this.componentWidth * Math.random() : xdef);
		this.y = (random ? this.componentHeight * Math.random() : ydef);
		this.r = ((rmax - 1) * Math.random()) + 1;
		this.dx = (Math.random() * xmax) * (Math.random() < .5 ? -1 : 1);
		this.dy = (Math.random() * ymax) * (Math.random() < .5 ? -1 : 1);
		this.hl = (ttl / this.rint) * (this.r / rmax);
		this.rt = Math.random() * this.hl;
		this.settings.rt = Math.random() + 1;
		this.stop = Math.random() * 0.2 + 0.4;
		this.settings.xdrift *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
		this.settings.ydrift *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
	};

	this.fade = function() {
		this.rt += this.settings.rt;
	}

	this.draw = function() {
		if (this.settings.blink && (this.rt <= 0 || this.rt >= this.hl)) {
			this.settings.rt = this.settings.rt * -1;
		} else if (this.rt >= this.hl) {
			this.reset();
		}

		const newo = 1;
		this.canvasContext.beginPath();
		this.canvasContext.rect(this.x, this.y, this.r, Math.PI);
		// this.canvasContext.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
		this.canvasContext.closePath();

		const cr = this.r * newo;
		const g = this.canvasContext.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
		g.addColorStop(0.0, 'rgba(255,255,255,' + newo + ')');
		g.addColorStop(this.stop, 'rgba(255,255,255,' + (newo * 1) + ')');
		g.addColorStop(1.0, 'rgba(255,255,255,0.1)');

		// g.addColorStop(0.0, 'rgba(238,180,28,'+newo+')');
		// g.addColorStop(this.stop, 'rgba(238,180,28,'+(newo*.3)+')');
		// g.addColorStop(1.0, 'rgba(238,180,28,0.1)');

		this.canvasContext.fillStyle = g;
		this.canvasContext.fill();
	};

	this.move = function() {
		this.x += (this.rt / this.hl) * this.dx;
		this.y += (this.rt / this.hl) * this.dy;
		if (this.x > this.componentWidth || this.x < 0) {
			this.dx *= -1;
		}
		if (this.y > this.componentHeight || this.y < 0) {
			this.dy *= -1;
		}
	};
}

class FireFlies extends React.Component {
	componentWidth = null;
	componentHeight = null;
	canvas: HTMLCanvasElement = null;
	element: HTMLElement = null;
	canvasContext: CanvasRenderingContext2D = null;
	rint = 50;
	pxs = [];
	fliesInterval: number = null;

	componentDidMount() {
		this.stopFlies();
		this.startFireFlies();
	}

	componentDidUpdate() {
		this.stopFlies();
		this.startFireFlies();
	}

	stopFlies() {
		this.canvas.style.opacity = '0';
		onTransitionEnd(this.canvas, () => {
			window.clearInterval(this.fliesInterval);
			this.fliesInterval = null;
			return (
				this.canvasContext &&
				this.canvasContext.clearRect(0, 0, this.componentWidth, this.componentHeight)
			);
		});
	}

	startFireFlies() {
		this.canvas.style.opacity = '1';

		this.componentWidth = this.element.offsetWidth;
		this.componentHeight = this.element.offsetHeight;
		this.canvasContext = this.canvas.getContext('2d');

		for (let i = 0; i < 300; i++) {
			this.pxs[i] = new Circle(this.canvasContext, this.componentWidth, this.componentHeight, this.rint);
			this.pxs[i].reset();
		}
		this.fliesInterval = window.setInterval(() => this.draw(), 40);

		setTimeout(() => {
			this.stopFlies();
			setTimeout(() => { this.startFireFlies(); }, 60000);
		}, 30000);
	}

	draw() {
		this.canvasContext.clearRect(0, 0, this.componentWidth, this.componentHeight);
		this.pxs.forEach(pxs => {
			pxs.fade();
			pxs.move();
			pxs.draw();
		});
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
						width: '100%',
						height: '100%',
					}}
				/>
				{this.props.children}
			</div>
		);
	}
}

export default FireFlies;