function passToServer() {
    let server = this.url.split('/')[2].split('.')[0];
    eval(`deelWithRequest_${server}.apply(this)`);  
}