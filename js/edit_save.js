// ---------------------------------------------------------------------------------------------------- 
// --------           Javascript hack to implement the 2 functions:                            --------
// --------           editProfile()    gets invoked when you click the edit profile button     -------- 
// --------           saveProfile()    gets invoked when you click the save profile button     --------
// --------                                                                                    --------
// --------           'container' and 'container-edit' are HTML classes and so are referrenced --------
// --------           using the dot prefix, '.container'  and '.container-edit'  but           --------
// --------           'name', 'input-name', 'email', 'input-email' etc are identifiers (id)    --------
// --------           and are referrenced using the # prefix with '#name', '#input-name' etc   --------
// --------           this is exactly the same syntax used in CSS.                             --------      
// ---------------------------------------------------------------------------------------------------- 
function cancelButton() {
        // Make the display screen visible and the editor screen invisible.
        document.querySelector(".container").style.display = 'block';
        document.querySelector(".container-edit").style.display = 'none';
}

function searchname() {
let display_name = document.querySelector('#name').textContent
    displlay_name = prompt('Search for a new Name, current is [' + display_name + ']');
    document.querySelector('#name').textContent = display_name;
}
function editProfile() {

    let url = 'http://127.0.0.1:3000/get-profile';
    let outputresp;

    // Make the display screen invisible and the editor screen visible.
    document.querySelector(".container").style.display = 'none';
    document.querySelector(".container-edit").style.display = 'block';

    // Get the input values off the screen as they currently appear...
    // Gosh this is such a hack!!!
    let inputvalues = [document.querySelector('#email').textContent,
                        document.querySelector('#interests').textContent, 
                        document.querySelector('#name').textContent];
    let jdata =

            {
                userid: -1,
                email: inputvalues[0],
                interests: inputvalues[1],
                name: inputvalues[2]
            };

    // because AJAX is Asynchronouse I have defined this callback function that takes what we would
    // normally return and allows us to use its value here. outputresp is a JSON object returned
    // by the server from the database in response to the get query.
    ajax_get(url, jdata, function (outputresp) {

        if (outputresp != null) {
            console.log('outputresp from the callback = ', outputresp);
            console.log('The email component = ',outputresp.email);

            let name = document.querySelector('#name').textContent;
            document.querySelector('#input-name').value = outputresp.name;
        
            let email = document.querySelector('#email').textContent;
            document.querySelector('#input-email').value = outputresp.email;
        
            let interests = document.querySelector('#interests').textContent;
            document.querySelector('#input-interests').value = outputresp.interests;
        }
    });

}
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------
function saveProfile() {

    let url = 'http://127.0.0.1:3000/update-profile';
  
    let inputvalues = [document.querySelector('#input-email').value,
                        document.querySelector('#input-interests').value, 
                        document.querySelector('#input-name').value];

    document.querySelector('#name').textContent = inputvalues[2];
    document.querySelector('#email').textContent = inputvalues[0];
    document.querySelector('#interests').textContent = inputvalues[1];
    
    // setup a JSON object of the data entered onto the browser during the 'edit profile' 
    // you then convert the resulting JSON object into a valid string version of the JSON object
    // and then send to the server to send to the database.
    let jdata = 
            {
                userid: -1,
                email: inputvalues[0],
                interests: inputvalues[1],
                name: inputvalues[2]
            };
    console.log('data object',jdata);

    // convert the JSON object to a valid json string object if you don't do this the server
    // gets upset and throws an invalide JSON syntax error message.
    ajax_post(url, JSON.stringify(jdata));

    // Make the display screen visible and the editor screen invisible.
    document.querySelector(".container").style.display = 'block';
    document.querySelector(".container-edit").style.display = 'none';
}
// ----------------------------------------------------------------------------------------------------
// implement the AJAX post function, it uses JSON not XML to transfer the new record
// ----------------------------------------------------------------------------------------------------
function ajax_post(url, stringed_jdata) {

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    // setup the request and content type headers so you dont get rejectsS
    xhr.setRequestHeader('Accept', '*/*');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate,br');

    console.log('url sent', url)
    console.log('In ajax_post jdata = ', stringed_jdata);

   // you have to convert the JSON object to a valid JSON object string otherwise the server hates it.
   // throwing it out with invalid JSON syntax errors.
   xhr.send(stringed_jdata);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        };
    };

}
// ----------------------------------------------------------------------------------------------------
// dont forget this AJAX shit is ASYNCHRONOUS so you cant just return values in the normal way,
// you will just get undefined at the calling module because the code will have executed and returned
// before any values get set.
//
// NOTE:     Unlike post requests it makes NO sense to send a BODY component in a get request. So
//           one way of sending some data to a server, say to interrogate a database is to package
//           it as part of the URL. Then at the server end you don't look for a req.body, you look
//           you look for req.query.
//
//           The part of the URL that contains the payload must have the form:
//           ?key1=value1&key2=value2
// ----------------------------------------------------------------------------------------------------

function ajax_get(url, stringed_jdata, callback)  {
    let responseback;
    let xhr = new XMLHttpRequest();
    //let ival = 2;
    let name_str = stringed_jdata.name;

    //let url_query_params = `?userid=${ival}`;       //This should be setup by a function that gets values from the browser

    //console.log('In ajax_get with name_str=',name_str);

    url_query_params = `?name=${name_str}`;
    url += url_query_params;
    xhr.open("GET", url);

    // setup the request and content type headers so you dont get rejects

    xhr.setRequestHeader('Accept', '*/*');
    xhr.setRequestHeader('Accept', 'Application/json');
    xhr.setRequestHeader('Content-Type', 'Content-Type', 'application/json;charset=UTF-8');
    xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate,br');

console.log('In ajax_get with url',url);
//console.log('In ajax_get with stringed_jdata',stringed_jdata);

    xhr.send(JSON.stringify(stringed_jdata));
    xhr.onreadystatechange = function () {

        // readystate 4 signifies a valid response and status 200 means OK.
        if ((xhr.readyState === 4) && (xhr.status == 200)){
            console.log('xhr.status', xhr.status);
            //console.log('xhr.responseText=',xhr.responseText);            
            //console.log('JSON xhr.responseText=',JSON.parse(xhr.responseText));
            responseback = JSON.parse(xhr.responseText);
            console.log('outputresp = ', responseback);
            callback(responseback);
        };
     };
}