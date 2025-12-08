function swiper() {
	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		effect: 'coverflow',
		loop: true,
		autoplay: 2000,
		spaceBetween: '15%',
		centeredSlides: true,
		slidesPerView: 'auto',
		autoplayDisableOnInteraction: false,
		observer: true,
		observeParents: true,
		paginationClickable: true,
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		coverflow: {
			rotate: 0,
			stretch: 0,
			depth: 300,
			modifier: 1,
			slideShadows: true
		}
	});
}
module.exports = {
	swiper:swiper
}
