import headerTemplate from '../templates/header.mustache';

(async function doRender(){
    const response = await fetch('/user');
    const data = await response.json();

    // Set the rendered HTML as the content of the page
    const header = document.getElementById('header-container');
    header.insertAdjacentHTML('beforeend', headerTemplate(data));
})();