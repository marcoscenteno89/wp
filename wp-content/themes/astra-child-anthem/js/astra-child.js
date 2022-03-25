document.addEventListener("DOMContentLoaded", () => {
	
	//NEW PACKAGES START
	// if (document.querySelectorAll('.packages')) {
		// let settings;
		// var packages = document.querySelectorAll('.packages');
		// for (let p of packages) {
		// 	var pack = p.querySelectorAll('.paq');
		// 	let settings = JSON.parse(p.getAttribute("data-data"));
		// 	if (settings) {
		// 		if (settings.direction) {
		// 			p.style.flexDirection = 'row-reverse';
		// 			p.style.alignItems = 'flex-end';
		// 			p.style.flexWrap = 'wrap-reverse';
		// 		}
		// 	}
		// 	let arr = [];
		// 	for (let i = 0; i < pack.length; i++) arr.push(i);
		// 	arr = arr.reverse();
		// 	for (i = 0; i < pack.length; i++) packageTemplate(pack[i], i, arr[i]);
		// }

		// function packageTemplate(i, count, rev) {
		// 	let x = JSON.parse(i.getAttribute("data-data"));
		// 	i.classList.add(`paq${count}`);
		// 	if (x.active) i.classList.add(`active`);
		// 	let degree = -35 + (25 * count);
		// 	let prom = JSON.parse(i.parentNode.getAttribute("data-data"));
		// 	let show_con = '';
    //   let promo = '';
    //   let on_sale = '';
		// 	let cell = '';
		// 	for (let i = 0; i < 12; i++) cell += '<div class="w-cell"></div>';
		// 	let duration = x.duration ? `/ ${x.duration}` : '';
		// 	let price = Number.isInteger(x.price) ? `<span class="symbol">$${x.price}</span><span class="mo">${duration}</span>` : `<span class="symbol">${x.price}</span>`;
		// 	if (i.querySelector('.content').childNodes.length > 0) {
		// 		let details = x.details ? x.details: 'Plan Details';
		// 		show_con = `
    //       <div data-accordion="accordion" style="min-height:22px;">
    //         <button data-accordion="head" class="show-content">
    //           <span class="arr">&#10095; </span> ${details} 
    //         </button>
    //         <div data-accordion="body" class="din-content">
    //           <hr>
    //           ${i.querySelector('.content').innerHTML}
    //         </div>
    //       </div>
    //     `;
		// 	}
    //   let btncon = cta = x.cta ? x.cta :  'Select';
		// 	i.insertAdjacentHTML("afterbegin", `   
		// 		<div class="hover">
		// 		<h2 class="amount">${x.price ? price : '&nbsp;'}</h2>
		// 		<div class="anim-container">
    //       <div class="anim">${cell}</div>
    //       <div class="hide"></div>
    //     </div>
		// 		<h2 class="title bg-${rev}">${x.title}</h2>
		// 		${x.plan_details ? `<p>${x.plan_details}</p>` : ''}
		// 		</div>
		// 		<strong>${promo}</strong>
		// 		<div class="container"><div class="contains">${show_con}</div></div>
		// 		<div class="action" data-id="${i.htmlFor}" data-html="${btncon}">${btncon}</div>
		// 		${x.active ? '<div class="main">MOST POPULAR</div>' : ''}
    //   `);
		// 	let arrow = i.querySelector('.pointerr');
		// }

		// var accordion = document.querySelectorAll('[data-accordion="accordion"]');
		// for (let i of accordion) add_accordion(i);

    // for (let p of packages) {
    //   let checkboxes = p.querySelectorAll('input[name=package]');
    //   let btns = p.querySelectorAll('.action');
    //   for (let i of checkboxes) i.addEventListener('click', updateSelect.bind(btns));
  //   }
	// }      
	//NEW PACKAGES END
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