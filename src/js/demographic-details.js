import header from './header'
import demographicTemplate from '../templates/demographic-form.mustache'
;(async function doRender() {
	const element = document.getElementById('game-results')

	element.insertAdjacentHTML('beforeend', demographicTemplate())

	const button = document.getElementById("submissionButton")
	button.setAttribute('disabled', true)

	document.getElementById("demographicForm").addEventListener("change", function (event){
		const formData = new FormData(this)

		const hasAgeSelection = !!formData.get("age")
		const hasGenderSelection = !!formData.get("gender")
		const hasRacialCategorySelection = !!formData.get("racialCategories")

		if(hasAgeSelection && hasGenderSelection && hasRacialCategorySelection) {
			button.removeAttribute("disabled")
		} else {
			button.setAttribute('disabled', true)
		}
	})

	document.getElementById("demographicForm").addEventListener("submit", function (event){
		event.preventDefault()
		const formData = new FormData(this)

		const racialCategoriesCheckBox = this.querySelectorAll('input[name="racialCategories"]:checked')
		const racialCategorySelections = []
		racialCategoriesCheckBox.forEach(function (checkBox) {
			racialCategorySelections.push(checkBox.value)
		})


		const submissionData = {
			racialCategories: racialCategorySelections,
			age: formData.get("age"),
			gender: formData.get("gender"),
			yearsOfFormalEducation: formData.get("yearsOfFormalEducation"),
			hispanicOrLatinoOrLatinaOrLatinXOrSpanishOrigin: formData.get("hispanicOrLatinoOrLatinaOrLatinXOrSpanishOrigin"),
			handedness: formData.get("handedness"),
			timeOfDayPreference: formData.get("timeOfDayPreference"),
			additionalInformation: formData.get("additionalInformation")
		}

		const hasAgeSelection = !!formData.get("age")
		const hasGenderSelection = !!formData.get("gender")
		const hasRacialCategorySelection = !!formData.get("racialCategories")

		const jsonData = JSON.stringify(submissionData)

		if(hasAgeSelection && hasGenderSelection && hasRacialCategorySelection) {
			fetch('/demographic-details', {
				method: 'POST',
				body: jsonData,
				headers: {
					"Content-Type": 'application/json'
				}
			}).then(resp => {
				if(resp.status === 200) {
					window.location.href = '/game-complete.html';
				}
			})
		}
	})
})()
