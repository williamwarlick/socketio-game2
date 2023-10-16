import demographicTemplate from '../templates/demographic-form.mustache';
(async function doRender() {
	// Set the rendered HTML as the content of the page
	const element = document.getElementById('game-results')

	element.insertAdjacentHTML('beforeend', demographicTemplate())
})()