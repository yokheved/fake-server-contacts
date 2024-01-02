class userContact {//לזכור שכשמגדירים איש קשר צריך להוסיף אחכ את ההערה
    constructor(name, email, mobile, landline = null, comment = null) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.landline = landline;
        this.comment = comment;
    }
}
class user {
    constructor(name, email, password, mobile, profile, landline = null) {
        this.profile = profile;
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
        this.landline = landline;
    }
}
class fxmlHTTPRequest extends EventTarget {
    constructor() {
        super();
        this.method;
        this.url;
        this.asynchonic;
        this.readyState;
        this.requestText;
        this.responseText;
        this.status;
    }
    FXMLHttpRequestEvent = new Event("FXMLHttpRequestEvent");
    FXMLHttpRequestLoad = new Event("FXMLHttpRequestLoad");
    open(method, url, asynchonic = true) {
        this.method = method;
        this.url = url;
        this.asynchonic = asynchonic;
        this.readyState = 0;
        this.addEventListener("FXMLHttpRequestLoad", this.onload);
    }
    onload() {
        this.onload();
    }
    send(data = null) {
        this.requestText = data;
        this.addEventListener("FXMLHttpRequestEvent", passToServer);
        this.dispatchEvent(this.FXMLHttpRequestEvent);
    }
}