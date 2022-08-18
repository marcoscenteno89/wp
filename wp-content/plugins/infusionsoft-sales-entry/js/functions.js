function getagiletoken() {
    console.log('login should pop up here');
    backgroundcover.style.display = 'flex';
    agilelogin.style.display = 'flex';
    document.addEventListener('keydown', presskey);       
    submitagiletoken.addEventListener('click', gettoken);
    function gettoken() {
        var user = document.querySelector('#username').value;
        var pss = document.querySelector('#password').value;
        var body = JSON.stringify({
            username: user,
            password: pss
        });
        var url = 'https://www.agileisp.com/api/auth-token/';
        var headers = { 'Content-Type': 'application/json; charset=utf-8' };
        apicall(url, body, headers).then(function (res) {

            sessionStorage.setItem("agiletoken", res.token);
            sessionStorage.setItem("agileuser", res.email);
            // var useremail = res.email;
            // var token = res.token;
            // verifytoken(res.token).then(function (res) { 
            //     if (res === true) {
            //         sessionStorage.setItem("agiletoken", token);
            //         sessionStorage.setItem("agileuser", useremail);
            //     } else {
            //         sessionStorage.setItem("agiletoken", null);
            //     }
            // });
        }); 
    }
    function presskey() {
        if (this.keyCode == 13 ) {
            gettoken();
        }
    }       
}

function verifytoken() {
    console.log('verification starts here');
    var token = sessionStorage.getItem('agiletoken');
    if ( token === false || token === undefined || token === null || token === '' ) {
        console.log('token does not exists here');
        getagiletoken();
        return false;
    }
    var body = JSON.stringify({ token: token });
    var url = 'https://www.agileisp.com/api/auth-token/verify/';
    var headers = { 'Content-Type': 'application/json; charset=utf-8' };
    return apicall(url, body, headers).then(function (res) {
        if (res.token !== token) {
            console.log("token does not match");
            getagiletoken();
        }
        // if (res.token === token) {
        //     sessionStorage.setItem("agiletoken", res.token); 
        //     hidepopups();
        //     document.querySelector('#salesrep').value = sessionStorage.getItem('agileuser'); 
        //     return res.token;
        // } else {
        //     sessionStorage.setItem("agiletoken", null);
        //     backgroundcover.style.display = 'flex';
        //     agilelogin.style.display = 'flex';
        //     document.addEventListener('keydown', function(e) {
        //         if (e.keyCode == 13 ) {
        //             getagiletoken();
        //         }
        //     }); 
        //     submitagiletoken.addEventListener('click', getagiletoken, false);
        //     return false;
        // }
    });    
}