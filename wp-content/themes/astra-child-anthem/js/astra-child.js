document.addEventListener("DOMContentLoaded", () => {
	
});

function add_accordion(i) {
	let head = i.querySelector('[data-accordion="head"]');
	let body = i.querySelector('[data-accordion="body"]');
	let arrow = i.querySelector('.arr');
	head.addEventListener('click', (e) => {
		e.preventDefault();
		arrow.classList.contains('active') ? arrow.classList.remove('active') : arrow.classList.add('active');
		head.classList.contains('active') ? head.classList.remove('active') : head.classList.add('active');
		body.classList.contains('active') ? body.classList.remove('active') : body.classList.add('active');
	});
}