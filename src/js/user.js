var userInfo = null; // global user information variable

async function getUser() {

    if(!userInfo) {
        const response = await fetch('/user');
        const data = await response.json();
        userInfo = data;
    }

    return userInfo;
}

export default getUser;