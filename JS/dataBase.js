function getData(user, typeOfSearch, key = null) {
    let data;
    let userContacts;
    switch (typeOfSearch) {
        case "search":
            let regExp = new RegExp(key.toLowerCase());
            userContacts = JSON.parse(localStorage.getItem(`${user}.contacts`));
            if (!userContacts) {
                throw `no search results for ${key}`;
            }
            if (!((/[^0-9]/g).test(key))) {//the input is a number.
                data = userContacts.filter(contact => contact&&(regExp.test(contact.mobile) || regExp.test(contact.landline)));
            }
            else {//the input is a name or email
                data = userContacts.filter(contact => contact&&(regExp.test(contact.name.toLowerCase()) ||
                 regExp.test(contact.comment.toLowerCase()) || regExp.test(contact.email.toLowerCase())));
            }
            break;
        case "load":
            userContacts = JSON.parse(localStorage.getItem(`${user}.contacts`));
            console.log(userContacts);
            data = userContacts.filter((contact, index) => (index >= key * 7 && index < (key + 1) * 7) && contact);
            if (!userContacts[(key + 1) * 7]) {
                data = JSON.stringify(data);
                return [data, 205];
            }
            data = JSON.stringify(data);
            return [data, 200];
        case "user":
            data = JSON.parse(localStorage.getItem(user));
            if (!data) {
                throw `no results for ${user}`;
            }
            break;
        default:
            throw "wrong url at getData dataBase!";
    }
    if (!data) {
        throw "wrong url!";
    }
    data = JSON.stringify(data);
    return data;
}

function postData(data, user, specificContact) {

    if (specificContact) {
        let userContacts = JSON.parse(localStorage.getItem(`${user}.contacts`));
        if (userContacts[0]===0) {
            userContacts = [JSON.parse(data), 0];
        }
        else if (userContacts.find(contact => contact.email === JSON.parse(data).email)) {
            throw "exist";
        }
        else {
            data = JSON.parse(data);
            let index;
            for (let i = 0; i < userContacts.length-1; i++) {
                if(userContacts[i].name.localeCompare(data.name)>0){
                    userContacts.splice(i,0,data);
                    break;
                }
                if(i===userContacts.length-2){
                    userContacts.splice(i+1,0,data);
                    break;
                }
            }
        }
        localStorage.setItem(`${user}.contacts`, JSON.stringify(userContacts));
    }
    else {
        if (localStorage.getItem(user)) {
            throw "wrong url! user exist";
        }
        localStorage.setItem(user, data);
        localStorage.setItem(`${user}.contacts`, JSON.stringify([0]));
    }
}

function putData(data, user, specificContact) {
    if (specificContact) {
        data = JSON.parse(data);
        let userContacts = JSON.parse(localStorage.getItem(`${user}.contacts`));
        if (!(userContacts.find(contact => contact.email === data.email))) {
            throw "not exist";
        }
        userContacts[userContacts.indexOf(contact => contact.email === data.email)] = data;
        localStorage.setItem(`${user}.contacts`, JSON.stringify(userContacts));
    }
    else {
        let myUser = JSON.parse(localStorage.getItem(user));
        if (!myUser) {
            throw "not exist";
        }
        localStorage.setItem(user, data);
    }
}

function deleteData(user, type, key = null) {
    let userContacts;
    switch (type) {
        case "user":
            localStorage.removeItem(user);
            localStorage.removeItem(`${user}.contacts`);
            break;
        case "allContacts":
            userContacts = JSON.parse(localStorage.getItem(`${user}.contacts`));
            userContacts = [0];
            localStorage.setItem(`${user}.contacts`, JSON.stringify(userContacts));
            break;
        case "specificContact":
            userContacts = JSON.parse(localStorage.getItem(`${user}.contacts`));
            userContacts=userContacts.filter(contact => contact===0||contact.email !== key);
            localStorage.setItem(`${user}.contacts`, JSON.stringify(userContacts));
            break;
        default:
            break;
    }
}