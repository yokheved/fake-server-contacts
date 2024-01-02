
function deelWithRequest_ucontacts() {
    let path = this.url.substring(22, this.url.length);
    try {
        switch (this.method) {
            case "GET":
                methodGET.apply(this, [path]);
                break;
            case "POST":
                methodPOST.apply(this, [path]);
                break;
            case "PUT":
                methodPUT.apply(this, [path]);
                break;
            case "DELETE":
                methodDELETE.apply(this, [path]);
                break;

            default:
                throw `ERROR: wrong method! ${this.method}`;
                break;
        }
        if (!this.status)
            this.status = 200;
    }
    catch (e) {
        console.log(e);
        this.status = 400;
    }
    this.readyState = 4;
    this.dispatchEvent(this.FXMLHttpRequestLoad);
}

function methodGET(path) {
    let pathData = path.split('/');
    if ((/#search/).test(path)) {
        this.responseText = getData(pathData[0], "search", pathData[pathData.length - 1]);
    }
    else if ((/contacts/).test(path)) {
        let result = getData(pathData[0], "load", pathData[pathData.length - 1]);
        this.responseText = result[0];
        this.status = result[1];
    }
    else if ((/@/).test(path)) {
        this.responseText = getData(pathData[0], "user");
    }
    else {
        throw "wrong path at methodGET server!";
    }
}

function methodPOST(path) {
    let pathData = path.split('/');
    if ((/specificContact/).test(path)) {
        postData(this.requestText, pathData[0], true);
    }
    else {
        postData(this.requestText, pathData[0], false);
    }
}

function methodPUT(path) {
    let pathData = path.split('/');
    if ((/specificContact/).test(path)) {
        putData(this.requestText, pathData[0], true);
    }
    else {
        putData(this.requestText, pathData[0], false);
    }
}

function methodDELETE(path) {
    let pathData = path.split('/');
    if ((/specificContact/).test(path)) {
        deleteData(pathData[0], "specificContact", pathData[2]);
    }
    else if ((/allContacts/).test(path)) {
        deleteData(pathData[0], "allContacts");
    }
    else {
        deleteData(pathData[0], "user");
    }
}
