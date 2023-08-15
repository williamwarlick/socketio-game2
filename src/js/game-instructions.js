import getUser from './user';
import mab from '../../moveablock2';
import architectTemplate from '../templates/architect-inst1.mustache';
import helperTemplate from '../templates/helper-inst1.mustache';

(async function doRender(){
    const response = await fetch('/gamestate');
    const data = await response.json();

    // Set the rendered HTML as the content of the page
    const element = document.getElementById('instructions');

    var template = architectTemplate;

    if (data) {
        var userInfo = await getUser();
        var player = data.players.find((player) => player.id === userInfo.user);

        if (player.role === mab.PLAYER_ROLE.HELPER) {
            template = helperTemplate;
        }
    }

    element.insertAdjacentHTML('beforeend', template(data));
})();