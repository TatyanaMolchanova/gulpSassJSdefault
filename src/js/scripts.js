$(document).ready(function(){
	'use strict';

	document.getElementById('bar-btn').addEventListener('click', function() {

		let width = 1;

		var progress = setInterval(bar, 10);

		function bar() {
			if (width>= 100) {
				clearInterval(progress);
			} else {
				width++;
				document.getElementById('bar').style.width = width + "%";
				document.getElementById('percent').textContent = width + "%";
			}
		}
	});
});