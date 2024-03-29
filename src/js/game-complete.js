import header from './header'
import template from '../templates/game-complete.mustache'

;(async function doRender() {
	const response = await fetch('/gamestate')
	const data = await response.json()

	data.rounds = data.rounds.map((round, index) => ({
		...round,
		roundNum: index,
	}))

	if (data.user.sonaId) {
		data.hasSonaId = true
	} else {
		data.hasSonaId = false
	}

	// Set the rendered HTML as the content of the page
	const element = document.getElementById('game-results')

	element.insertAdjacentHTML('beforeend', template(data))

	// log out user
	fetch('/logout', {
		method: 'POST',
	})
})()
