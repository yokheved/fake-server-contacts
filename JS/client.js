window.addEventListener("popstate", poppingHistory);
const loginPage = document.querySelector("#loginTemplate");
const registrationPage = document.querySelector("#registrationTemplate");
const personalAreaPage = document.querySelector("#personalAreaTemplate");
const main = document.querySelector("main");
const profile_picture = ["🥰", "😎", "😁", "😶", "😛", "😜", "🥸", "🥳", "😇", "🤠", "🤓"];
let thisPage = loginPage;
let back = false;
let currentUser = null;
let mailRegularExpression = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
let mobileRegularExpression = /^[0-9]{10}/;
let landlineRegularExpression = /^[0-9]{9}/;
let contactsRequestPage = 0;
let indexContactOnPage = 0;
passToLogin();

function changeProfile(event) {
    let allProfiles = document.querySelectorAll(".userProfile");
    let profile = document.querySelector(`#${event.currentTarget.parentElement.parentElement.id} .profile-pic`);
    let indexProfile = profile_picture.indexOf(profile.innerText);
    if (event.currentTarget == document.querySelector(".fa-caret-right")) {
        if (indexProfile === 10) {
            indexProfile = 0;
        }
        else {
            indexProfile++;
        }
    }
    else {
        if (indexProfile === 0) {
            indexProfile = 10;
        }
        else {
            indexProfile--;
        }
    }
    allProfiles.forEach(profilepic => profilepic.innerText = profile_picture[indexProfile])
    return profile_picture[indexProfile];
}

function appendContacts(contacts) {
    contacts = JSON.parse(contacts);
    contacts.forEach(element => {
        let contacItem = document.querySelector("#contactPersonTemplate").content.cloneNode(true);
        document.querySelector("article").append(contacItem);
        document.querySelector("div.contactPerson:last-of-type").setAttribute("id", `contactPerson${indexContactOnPage}`);
        document.querySelector(`#contactPerson${indexContactOnPage} .contactPersonName`).innerText = `שם: ${element.name}`;
        document.querySelector(`#contactPerson${indexContactOnPage} .contactPersonEmail`).innerText = `אימייל: ${element.email}`;
        document.querySelector(`#contactPerson${indexContactOnPage} .contactPersonMobile`).innerText = `פלאפון: ${element.mobile}`;
        if (element.landline) {
            document.querySelector(`#contactPerson${indexContactOnPage} .contactPersonLandline`).innerText = `טלפון: ${element.landline}`;
        }
        if (element.comment) {
            document.querySelector(`#contactPerson${indexContactOnPage} .contactPersonComment`).innerText = element.comment;
        }
        contactAddListeners(element);
        contactSetAttributes();
        indexContactOnPage++;
    });
    contactsRequestPage++;
}

function contactAddListeners(element) {
    document.querySelector(`#contactPerson${indexContactOnPage} .fa-trash-can`).addEventListener("click", (e) => {
        let deleteContact = new fxmlHTTPRequest();
        deleteContact.open("DELETE", `https://ucontacts.com/${currentUser.email}/specificContact/${element.email}`);
        deleteContact.onload = function () {
            if (this.readyState === 4 && this.status === 200) {
                document.querySelector(`#${e.currentTarget.parentElement.parentElement.id}`).remove();
            }
        };
        deleteContact.send();
    });
    document.querySelector(`#contactPerson${indexContactOnPage} .fa-pen`).addEventListener("click", (e) => {
        let indexOfContact = e.currentTarget.parentElement.parentElement.id;
        document.querySelector(`#${indexOfContact} .contactPersonDetails`).style.display = "none";
        document.querySelector(`#${indexOfContact} .contactPersonEdit`).style.display = "inline-block";
        document.querySelector(`#${indexOfContact} input.nameContactPersonEdit`).value = element.name;
        document.querySelector(`#${indexOfContact} input.mailContactPersonEdit`).value = element.email;
        document.querySelector(`#${indexOfContact} input.mobileContactPersonEdit`).value = element.mobile;
        document.querySelector(`#${indexOfContact} input.landlineContactPersonEdit`).value = element.landline;
        document.querySelector(`#${indexOfContact} textarea.commentContactPersonEdit`).value = element.comment;
    });
    document.querySelector(`#contactPerson${indexContactOnPage} .cancelEditContacatPerson`).addEventListener("click", (e) => {
        document.querySelector(`#${e.currentTarget.parentElement.parentElement.id} .contactPersonDetails`).style.display = "inline-block";
        document.querySelector(`#${e.currentTarget.parentElement.parentElement.id} .contactPersonEdit`).style.display = "none";
    });
    document.querySelector(`#contactPerson${indexContactOnPage} .contactPersonEditBtn`).addEventListener("click", (e) => { e.preventDefault(); editContact(e, element); });
}

function editContact(e, element) {
    let indexOfContact = e.currentTarget.parentElement.parentElement.parentElement.id[13];
    let editContactName = document.querySelector(`#nameContactPersonEdit${indexOfContact}`).value;
    if (editContactName.includes('@')) {
        editContactName.setCustomValidity("@ לא מורשה");
    }
    else if (!mailRegularExpression.test(document.querySelector(`#mailContactPersonEdit${indexOfContact}`).value)) {
        document.querySelector(`#mailContactPersonEdit${indexOfContact}`).setCustomValidity("אימייל לא תקין");
    }
    else if (!mobileRegularExpression.test(document.querySelector(`#mobileContactPersonEdit${indexOfContact}`).value)) {
        document.querySelector(`#mobileContactPersonEdit${indexOfContact}`).setCustomValidity("מספר פלאפון לא תקין");
    }
    else if (!landlineRegularExpression.test(document.querySelector(`#landlineContactPersonEdit${indexOfContact}`).value)) {
        document.querySelector(`#landlineContactPersonEdit${indexOfContact}`).setCustomValidity("מספר טלפון לא תקין");
    }
    else {
        element.name = document.querySelector(`#nameContactPersonEdit${indexOfContact}`).value !== '' ? document.querySelector(`#nameContactPersonEdit${indexOfContact}`).value : element.name;
        element.email = document.querySelector(`#mailContactPersonEdit${indexOfContact}`).value !== '' ? document.querySelector(`#mailContactPersonEdit${indexOfContact}`).value : element.email;
        element.mobile = document.querySelector(`#mobileContactPersonEdit${indexOfContact}`).value !== '' ? document.querySelector(`#mobileContactPersonEdit${indexOfContact}`).value : element.mobile;
        element.landline = document.querySelector(`#landlineContactPersonEdit${indexOfContact}`).value !== '' ? document.querySelector(`#landlineContactPersonEdit${indexOfContact}`).value : element.landline;
        element.comment = document.querySelector(`#commentContactPersonEdit${indexOfContact}`).value !== '' ? document.querySelector(`#commentContactPersonEdit${indexOfContact}`).value : element.comment;
        let editContact = new fxmlHTTPRequest();
        editContact.open("PUT", `https://ucontacts.com/${currentUser.email}/specificContact`);
        editContact.onload = function () {
            document.querySelector(`#contactPerson${indexOfContact} .contactPersonDetails`).style.display = "inline-block";
            document.querySelector(`#contactPerson${indexOfContact} .contactPersonEdit`).style.display = "none";
            document.querySelector(`#contactPerson${indexOfContact} .contactPersonName`).innerText = `שם: ${element.name}`;
            document.querySelector(`#contactPerson${indexOfContact} .contactPersonEmail`).innerText = `אימייל: ${element.email}`;
            document.querySelector(`#contactPerson${indexOfContact} .contactPersonMobile`).innerText = `פלאפון: ${element.mobile}`;
            if (element.landline) {
                document.querySelector(`#contactPerson${indexOfContact} .contactPersonLandline`).innerText = `טלפון: ${element.landline}`;
            }
            if (element.comment !== '') {
                document.querySelector(`#contactPerson${indexOfContact} .contactPersonComment`).innerText = element.comment;
            }
        }
        let data = JSON.stringify(element);
        editContact.send(data);
    }
}

function contactSetAttributes() {
    document.querySelector(`#contactPerson${indexContactOnPage} label.nameContactPersonEdit`).setAttribute('for', `nameContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} label.mailContactPersonEdit`).setAttribute('for', `mailContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} label.mobileContactPersonEdit`).setAttribute('for', `mobileContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} label.landlineContactPersonEdit`).setAttribute('for', `landlineContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} label.commentContactPersonEdit`).setAttribute('for', `commentContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} input.nameContactPersonEdit`).setAttribute('id', `nameContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} input.mailContactPersonEdit`).setAttribute('id', `mailContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} input.mobileContactPersonEdit`).setAttribute('id', `mobileContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} input.landlineContactPersonEdit`).setAttribute('id', `landlineContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} textarea.commentContactPersonEdit`).setAttribute('id', `commentContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} input.nameContactPersonEdit`).setAttribute('name', `nameContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} input.mailContactPersonEdit`).setAttribute('name', `mailContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} input.mobileContactPersonEdit`).setAttribute('name', `mobileContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} input.landlineContactPersonEdit`).setAttribute('name', `landlineContactPersonEdit${indexContactOnPage}`);
    document.querySelector(`#contactPerson${indexContactOnPage} textarea.commentContactPersonEdit`).setAttribute('name', `commentContactPersonEdit${indexContactOnPage}`);
}

function requestContacts() {
    document.querySelector("#loadMore").style.display = "inline-block";
    let loadContact = new fxmlHTTPRequest();
    loadContact.open("GET", `https://ucontacts.com/${currentUser.email}/contacts/${contactsRequestPage}`);
    loadContact.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            appendContacts(this.responseText);
        }
        if (this.readyState === 4 && this.status === 205) {
            document.querySelector("#loadMore").style.display = "none";
            appendContacts(this.responseText);
        }
    }
    loadContact.send();
}

function deleteSearch(e) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector("input[type='search']").value = "";
    search();
}

function search() {
    document.querySelector("article").innerHTML = "";
    document.querySelector(".fa-arrow-right").style.display = "inline-block";
    document.querySelector(".fa-arrow-right").addEventListener("click", deleteSearch);
    let key = document.querySelector("input[type='search']").value;
    let searchForContact = new fxmlHTTPRequest();
    searchForContact.open("GET", `https://ucontacts.com/${currentUser.email}/#search/${key}`);
    searchForContact.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText === "[]") {
                document.querySelector("article").innerHTML = "אופס... לא נמצאו תוצאות";
            }
            else {
                document.querySelectorAll(".contactPerson").forEach(element => element.remove());
                appendContacts(this.responseText);
                contactsRequestPage = 0;
                document.querySelector("#loadMore").style.display = "none";
            }
        }
    }
    searchForContact.send();
}

function openPersonalDetails() {
    if (!document.querySelector("#personalDetails")) {
        main.append(document.querySelector("#personalDetailsTemplate").content.cloneNode(true));
        document.querySelector("#showPersonalDetails .userProfile").innerText = currentUser.profile;
        document.querySelector("#editPersonalDetailsForm .userProfile").innerText = currentUser.profile;
        document.querySelector("#showPersonalDetails .userName").innerText = `שם: ${currentUser.name}`;
        document.querySelector("#showPersonalDetails .userEmail").innerText = `אימייל: ${currentUser.email}`;
        document.querySelector("#showPersonalDetails .userMobile").innerText = `פלאפון: ${currentUser.mobile}`;
        document.querySelector("#showPersonalDetails .userLandline").innerText = `טלפון: ${currentUser.landline}`;
        document.querySelector("#nameEditUser").value = currentUser.name;
        document.querySelector("#mobileEditUser").value = currentUser.mobile;
        document.querySelector("#landlineEditUser").value = currentUser.landline ? currentUser.landline : undefined;
        addListenersPersonalDetails();
    }
    else {
        document.querySelector("#personalDetails").remove();
    }
}

function addListenersPersonalDetails() {
    document.querySelector("#editPersonalDetails .fa-caret-right").addEventListener("click", (event) => changeProfile(event));
    document.querySelector("#editPersonalDetails .fa-caret-left").addEventListener("click", (event) => changeProfile(event));
    document.querySelector("#deleteAccount").addEventListener("click", () => {
        let deleteAccount = new fxmlHTTPRequest();
        deleteAccount.open("DELETE", `https://ucontacts.com/${currentUser.email}`);
        deleteAccount.onload = function () {
            currentUser = null;
            passToRegistration();
        }
        deleteAccount.send();
    });
    document.querySelector("#exitAccount").addEventListener("click", (e) => {
        e.preventDefault();
        currentUser = null;
        passToLogin();
    });
    document.querySelector("#editAccountBtn").addEventListener("click", () => {
        document.querySelector("#showPersonalDetails").style.display = "none";
        document.querySelector("#editPersonalDetails").style.display = "inline-block";
    });
    document.querySelector("#openEditPassword").addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#editPassword").style.display = "inline-block";
        document.querySelector("#openEditPassword").style.display = "none";
    });
    document.querySelector("#cancelEditPersonalDetailsBtn").addEventListener("click", () => document.querySelector("#personalDetails").remove());
    document.querySelector("#editPersonalDetailsBtn").addEventListener("click", editUser);
}

function editUser() {
    let repassword;
    repassword = checkEditUser(repassword);
    let reprofile = document.querySelector("#editPersonalDetailsForm .profile-pic").innerText;
    let rename = document.querySelector("#nameEditUser").value !== '' ? document.querySelector("#nameEditUser").value : currentUser.name;
    let remobile = document.querySelector("#mobileEditUser").value !== '' ? document.querySelector("#mobileEditUser").value : currentUser.mobile;
    let relandline = document.querySelector("#landlineEditUser").value !== '' ? document.querySelector("#landlineEditUser").value : currentUser.landline;
    let reuser = new user(rename, currentUser.email, repassword, remobile, reprofile, relandline);
    let changeUserDetails = new fxmlHTTPRequest();
    changeUserDetails.open("PUT", `https://ucontacts.com/${currentUser.email}`);
    changeUserDetails.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            currentUser = reuser;
            document.querySelector("#personalDetails").remove();
            openPersonalDetails();
        }
    }
    let data = JSON.stringify(reuser);
    changeUserDetails.send(data);
}

function checkEditUser(repassword) {
    if (document.querySelector("#editPassword").style.display === "block") {
        let checkRepassword = document.querySelector("#chekNewPasswordEditUser").value;
        repassword = document.querySelector("#newPasswordEditUser").value;
        let oldPassword = document.querySelector("#currentPasswordEditUser").value;
        if (checkRepassword !== '' || repassword !== '' || oldPassword !== '') {
            if (checkRepassword === '' || repassword === '' || oldPassword === '') {
                document.querySelector("#newPasswordEditUser").setCustomValidity("לא מילאת שדות נצרכים");
                return;
            }
            if (checkRepassword !== repassword) {
                document.querySelector("#newPasswordEditUser").setCustomValidity("הסיסמאות אינם שוים");
                return;
            }
            if (oldPassword !== currentUser.password) {
                document.querySelector("#currentPasswordEditUser").setCustomValidity("סיסמה שגויה");
                return;
            }
        }
        else {
            repassword = currentUser.password
        }
    }
    else {
        repassword = currentUser.password;
    }
    return repassword;
}

function registrateUser() {
    let userProfile = document.querySelector("#registrationForm .userProfile").innerText;
    let userEmail = document.querySelector("#mailRegistration").value;
    let userName = document.querySelector("#nameRegistration").value;
    let userPassword = document.querySelector("#passwordRegistration").value;
    let userMobile = document.querySelector("#mobileRegistration").value;
    let userLandline = document.querySelector("#landlineRegistration").value;
    let checkUserExist = new fxmlHTTPRequest();
    checkUserExist.open("GET", `https://ucontacts.com/${userEmail}`);
    checkUserExist.onload = function () {
        if (this.readyState === 4 && this.status === 400) {
            if (userName.includes('@')) {
                userName.setCustomValidity("@ לא מורשה");
            }
            else if (!mailRegularExpression.test(userEmail)) {
                document.querySelector("#mailRegistration").setCustomValidity("אימייל לא תקין");
            }
            else if (!mobileRegularExpression.test(userMobile)) {
                document.querySelector("#mobileRegistration").setCustomValidity("מספר פלאפון לא תקין");
            }
            else if (!landlineRegularExpression.test(userLandline)) {
                document.querySelector("#landlineRegistration").setCustomValidity("מספר טלפון לא תקין");
            }
            else {
                if (userPassword === document.querySelector("#checkPasswordRegistration").value) {
                    let insertNewUser = new fxmlHTTPRequest();
                    currentUser = new user(userName, userEmail, userPassword, document.querySelector("#mobileRegistration").value, userProfile, document.querySelector("#landlineRegistration").value);
                    insertNewUser.open("POST", `https://ucontacts.com/${userEmail}`);
                    insertNewUser.onload = function () {
                        passToPersonalArea();
                    }
                    let data = JSON.stringify(currentUser);
                    insertNewUser.send(data);
                }
                else {
                    document.querySelector("#passwordRegistration").setCustomValidity("הסיסמאות אינם שוים");
                }
            }
        }
        else {
            document.querySelector("#mailRegistration").setCustomValidity("המשתמש כבר קיים");
        }
    }
    checkUserExist.send();
}

function loginUser() {
    let mailLogin = document.querySelector("#mailLogin").value;
    let password = document.querySelector("#passwordLogin");
    let checkUserExist = new fxmlHTTPRequest();
    checkUserExist.open("GET", `https://ucontacts.com/${mailLogin}`);
    checkUserExist.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            currentUser = JSON.parse(this.responseText);
            if (password.value !== currentUser.password) {
                currentUser = null;
                password.setCustomValidity("סיסמה לא תקינה");
                return;
            }
            passToPersonalArea();
        }
        else {
            document.querySelector("#mailLogin").setCustomValidity("המשתמש לא תקין");
        }
    }
    checkUserExist.send();
}

function openAddContactPerson() {
    if (!document.querySelector("#addNewContactPerson")) {
        main.append(document.querySelector("#addNewContactPersonTemplate").content.cloneNode(true));
        document.querySelector("#addNewContactPersonBtn").addEventListener("click", () => {
            let newContactName = document.querySelector("#nameNewContact").value;
            if (newContactName.includes('@')) {
                document.querySelector("#nameNewContact").setCustomValidity("@ לא מורשה");
            }
            else if (!mailRegularExpression.test(document.querySelector("#mailNewContact").value)) {
                document.querySelector("#mailNewContact").setCustomValidity("אימייל לא תקין");
            }
            else if (!mobileRegularExpression.test(document.querySelector("#mobileNewContact").value)) {
                document.querySelector("#mobileNewContact").setCustomValidity("מספר פלאפון לא תקין");
            }
            else if ((document.querySelector("#landlineNewContact").value !== '') && !landlineRegularExpression.test(document.querySelector("#landlineNewContact").value)) {
                document.querySelector("#landlineNewContact").setCustomValidity("מספר טלפון לא תקין");
            }
            else {
                let newContactPerson = new userContact(newContactName, document.querySelector("#mailNewContact").value,
                    document.querySelector("#mobileNewContact").value, document.querySelector("#landlineNewContact").value,
                    document.querySelector("#commentNewContact").value);
                let addContactPerson = new fxmlHTTPRequest();
                addContactPerson.open("POST", `https://ucontacts.com/${currentUser.email}/specificContact`);
                addContactPerson.onload = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        document.querySelector("#addNewContactPerson").remove();
                        document.querySelector("#addContactPerson").innerHTML = "איש הקשר הוסף בהצלחה!";
                        setTimeout(() => {
                            document.querySelector("#addContactPerson").innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
                        }, 3000);
                        document.querySelectorAll(".contactPerson").forEach(element => element.remove());
                        contactsRequestPage = 0;
                        requestContacts();
                    }
                    if (this.readyState === 4 && this.status === 400) {
                        document.querySelector("#mailNewContact").setCustomValidity("איש הקשר כבר קיים!");
                    }
                }
                let data = JSON.stringify(newContactPerson);
                addContactPerson.send(data);
            }
        });
        document.querySelector("#cancelNewContactPersonBtn")
            .addEventListener("click", () => document.querySelector("#addNewContactPerson").remove());
    }
}

function goToPage(pageName, page) {
    while (main.firstChild) {
        main.removeChild(main.lastChild);
    }
    thisPage = page.content.cloneNode(true);
    main.append(thisPage);
    if (!back) {
        history.pushState({}, "", `#${pageName}`);
    }
    back = false;
}

function passToPersonalArea() {
    goToPage("personalArea", personalAreaPage);
    let searchBtn = document.querySelector("#searchBtn");
    searchBtn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); search(); });
    let navUserName = document.querySelector("#personalArea .userName");
    let navUsetProfile = document.querySelector("#personalArea .userProfile");
    navUserName.innerText = currentUser.name;
    navUsetProfile.innerText = currentUser.profile;
    navUserName.addEventListener("click", openPersonalDetails);
    navUsetProfile.addEventListener("click", openPersonalDetails);
    let loadMoreBtn = document.querySelector("#loadMore");
    loadMoreBtn.addEventListener("click", requestContacts);
    let addContactPersonBtn = document.querySelector("#addContactPerson");
    addContactPersonBtn.addEventListener("click", openAddContactPerson);
    let clearAllContactsBtn = document.querySelector("#clearAllContacts");
    requestContacts();
    clearAllContactsBtn.addEventListener("click", () => {
        let deleteAllContact = new fxmlHTTPRequest();
        deleteAllContact.open("DELETE", `https://ucontacts.com/${currentUser.email}/allContacts`);
        deleteAllContact.onload = function () {
            if (this.readyState === 4 && this.status === 200) {
                document.querySelectorAll(".contactPerson").forEach(element => element.remove());
                contactsRequestPage = 0;
            }
        }
        deleteAllContact.send();
    })
}

function passToRegistration() {
    goToPage("registration", registrationPage);
    document.querySelector("#registrationForm .profile-pic").innerText = profile_picture[Math.floor(Math.random() * profile_picture.length)];
    let carentRight = document.querySelector(".fa-caret-right");
    let carentLeft = document.querySelector(".fa-caret-left");
    carentRight.addEventListener("click", changeProfile);
    carentLeft.addEventListener("click", changeProfile);
    let linkToLogin = document.querySelector("#passToLoginBtn");
    linkToLogin.addEventListener("click", (e) => { e.preventDefault(); passToLogin(); });
    let registrationBtn = document.querySelector("#registrationBtn");
    registrationBtn.addEventListener("click", registrateUser);
}

function passToLogin() {
    goToPage("login", loginPage);
    let loginBtn = document.querySelector("#loginBtn");
    loginBtn.addEventListener("click", loginUser);
    let linkToRegistration = document.querySelector("#passToRegistrationBtn");
    linkToRegistration.addEventListener("click", (e) => { e.preventDefault(); passToRegistration(); });
}

function poppingHistory(e) {
    e.preventDefault();
    let hash = location.hash.replace("#", '');
    back = true;
    switch (hash) {
        case "login":
            passToLogin();
            break;
        case "registration":
            passToRegistration();
            break;
        case "personalArea":
            passToPersonalArea();
            break;
        default:
            break;
    }

}
