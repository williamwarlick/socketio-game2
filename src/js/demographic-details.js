import header from './header'
import demographicTemplate from '../templates/demographic-form.mustache'
;(async function doRender() {
	const element = document.getElementById('game-results')

	element.insertAdjacentHTML('beforeend', demographicTemplate())
})()
