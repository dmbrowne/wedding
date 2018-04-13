function onTransitionEnd(element, callback) {
	if ('transition' in document.documentElement.style) {
			element.addEventListener('transitionend', callback);
	} else {
		callback();
	}
}

window.onTransitionEnd = onTransitionEnd;
