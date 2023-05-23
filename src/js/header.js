import headerTemplate from '../templates/header.mustache';

var userInfo = null; // global user information variable

(async function doRender(){
    const response = await fetch('/user');
    const data = await response.json();
    userInfo = data;

    // Set the rendered HTML as the content of the page
    const header = document.getElementById('header-container');
    header.insertAdjacentHTML('beforeend', headerTemplate(data));
})();

export default userInfo;
