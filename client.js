

var lastBrowse; 
var loggedinusr;
displayView = function(){
    if(localStorage.getItem('token') != null){
        document.getElementById("show_view").innerHTML = document.getElementById("profileview").innerHTML;
    } else {
        document.getElementById("show_view").innerHTML = document.getElementById("welcomeview").innerHTML;
    }
};

window.onload=function(){
    displayView();
};


function submitLogin(form){
    var password = document.getElementById('login_pass').value;
    var username = document.getElementById('login_email').value;
    let user={"email":username,"password":password};
    if(checkCharaters(password)){
        let request = new XMLHttpRequest();
        request.open("PUT", "/sign_in", true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.onreadystatechange=function(){
            if (this.readyState==4){
                if(this.status==200){
                    Show_message("Signed in!");
                    localStorage.setItem('token', request.responseText);
                    loggedinusr=username;
                    //window.confirm("tjena"+loggedinusr);
                    displayView();
                    getProfile(username);
                    UpdateWall();
                }else if (request.status==500){
                    Show_message("Username or password were incorect");
                }else if(request.status==400){
                    Show_message("Bad request :(");
                }
            }
        }
        request.send(JSON.stringify(user));
    }
};

function submitSignUp(form){
    var password = document.getElementById('signup_pass').value;
    var repeat_password = document.getElementById('signup_repeatpass').value;
    if(checkSame(password, repeat_password) && checkCharaters(password)){
        var signUpData = {
            "email": form.signup_email.value,
            "password": form.signup_pass.value,
            "firstname": form.signup_fname.value,
            "familyname": form.signup_lname.value,
            "gender": form.signup_gender.value,
            "city": form.signup_city.value,
            "country": form.signup_country.value
        };
        let request = new XMLHttpRequest();
        request.open("PUT", "/sign_up", true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.onreadystatechange=function(){
            if (this.readyState==4){
                if(this.status==201){
                    //document.getElementById(form).reset();
                    Show_message("Successful signup");

                }else if(this.status==500){
                    Show_message("Error while signing up");

                }else if(this.status==400){
                    Show_message("Either the password is too short or the password and repeat password does not match.");
                }
            }
        }
        request.send(JSON.stringify(signUpData));
    }  
};

function checkSame(password, repeat_password){
    if (password == repeat_password) {
           return true;
    } else {
            return false;
    } 
};


function checkCharaters(password){
    if ( password.length < 8) {
              return false;
    } else {
            return true;  
    } 
};

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tabs");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    document.getElementById(tabName).style.display = "block";  
};


function submitSignOut(){
    var token = localStorage.getItem('token');
    let request = new XMLHttpRequest();
        request.open("GET", "/sign_out", true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var noQuotes = token.split('"').join('');
        request.setRequestHeader("Authorization",noQuotes);
        request.onreadystatechange=function(){
            if (this.readyState==4){
                if(this.status==200){
                    localStorage.removeItem('token');
                    Show_message("Successfully signed out");
                    displayView();
                }else if(this.status==400){
                    Show_message("bad request");
                }else if(this.status==500){
                    Show_message("Error while signing out");

                }
            }
        }
    request.send();
};

function submitChangePassword(form){
    var old_password = form.change_old.value;
    var new_password = form.change_new.value;
    var repeat_password = form.change_repeat.value;
    var token = localStorage.getItem('token');
    let pswrd={"oldPassword":old_password,"newPassword":new_password};

    if(checkSame(new_password, repeat_password) && checkCharaters(new_password)){
        let request = new XMLHttpRequest();
        request.open("PUT", "/Change_password", true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var noQuotes = token.split('"').join('');
        request.setRequestHeader("Authorization",noQuotes);
        request.onreadystatechange=function(){
            if (this.readyState==4){
                if(this.status==200){
                    Show_message("Successfully changed password");
                }else if(this.status==400){
                    Show_message("bad request");
                }else if(this.status==500){
                    Show_message("Error: either too long password or wrong old password");

                }
            }
        }
        request.send(JSON.stringify(pswrd));
    }
        
    
};

function getProfile(email){
    //var response = serverstub.getUserDataByEmail(localStorage.getItem('token'), email);
        var token = localStorage.getItem('token');
        let input={"email":email};
        let request = new XMLHttpRequest();
        request.open("GET", "/get_user_data_by_email/"+email, true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var noQuotes = token.split('"').join('');
        request.setRequestHeader("Authorization",noQuotes);
        request.onreadystatechange=function(){
            if (this.readyState==4){
                //window.confirm("4");
                if(this.status==200){
                    result=JSON.parse(request.responseText);
                    result.forEach(function(c){
                        document.getElementById("profile_email").innerHTML = "Email: " + c.email;
                        document.getElementById("profile_fName").innerHTML = "First name: " +  c.firstname;
                        document.getElementById("profile_lName").innerHTML = "Last name: " + c.familyname;
                        document.getElementById("profile_gender").innerHTML = "Gender: " + c.gender;
                        document.getElementById("profile_city").innerHTML = "City: " + c.city;
                        document.getElementById("profile_country").innerHTML = "Country: " + c.country;
                    });
                    
                    //window.confirm("200");
                }else if(this.status=500){
                    Show_message("Either the user does not exist or current user is not logged in");
                }else if(this.status=400){
                    Show_message("Bad request");
                }

            }
        }
        //window.confirm(JSON.stringify(input));
        request.send();

};

function getOtherProfile(){
    var token = localStorage.getItem('token');
    let input={"email":lastBrowse};
    let request = new XMLHttpRequest();
    request.open("GET", "/get_user_data_by_email/"+lastBrowse, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var noQuotes = token.split('"').join('');
    request.setRequestHeader("Authorization",noQuotes);
    request.onreadystatechange=function(){
        if (this.readyState==4){
            if(this.status==200){
                result=JSON.parse(request.responseText);
                result.forEach(function(c){
                    document.getElementById("browse_email").innerHTML = "Email: " + c.email;
                    document.getElementById("browse_fName").innerHTML = "First name: " +  c.firstname;
                    document.getElementById("browse_lName").innerHTML = "Last name: " + c.familyname;
                    document.getElementById("browse_gender").innerHTML = "Gender: " + c.gender;
                    document.getElementById("browse_city").innerHTML = "City: " + c.city;
                    document.getElementById("browse_country").innerHTML = "Country: " + c.country;
                });
                
                //window.confirm(":D");
            }else if(this.status=500){
                Show_message("Either the user does not exist or current user is not logged in");
            }else if(this.status=400){
                Show_message("Bad request");
            }

        }
    }
    //window.confirm(JSON.stringify(input));
    request.send();
};
 
function UpdateWall(){
    // var response = serverstub.getUserMessagesByToken(localStorage.getItem('token'));
    // if(response.success == true){
    //     var amount = response.data;
    //     document.getElementById('wall_messages').innerHTML =""; 
    //     for(var i = 0; i < amount.length; i++){
    //         document.getElementById('wall_messages').innerHTML += "<div>" + response.data[i].writer + " : " + response.data[i].content + "</div>";
    //     }
    // } else {
    //     Show_message(response.message);
    // }
    var token = localStorage.getItem('token');
    
    let request = new XMLHttpRequest();
    request.open("GET", "/Get_user_messages_by_token", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var noQuotes = token.split('"').join('');
    request.setRequestHeader("Authorization",noQuotes);
    request.onreadystatechange=function(){
        if (this.readyState==4){
            if(this.status==200){
                result=JSON.parse(request.responseText);
                //window.confirm("re"+JSON.stringify(result));
                result.forEach(function(c){
                    
                    document.getElementById('wall_messages').innerHTML += "<div>" + c[0] + " : " + c[1] + "</div>"; 
                });
            }else if (request.status==500){
                Show_message("Username or token were incorect");
            }else if(request.status==400){
                Show_message("Bad request :(");
            }
        }
    }
    request.send();    
    
};
 
function submitPost(){ //uppdaterar inte wallen själv
    var message = document.getElementById("postText").value;
    //window.confirm("hej");
    var token = localStorage.getItem('token');
    //window.confirm("igen");
    let msg={"email":loggedinusr,"message":message};
        let request = new XMLHttpRequest();
        request.open("PUT", "/post_message", true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var noQuotes = token.split('"').join('');
        request.setRequestHeader("Authorization",noQuotes);
        request.onreadystatechange=function(){
            if (this.readyState==4){
                if(this.status==201){
                    UpdateWall();
                }else if (request.status==500){
                    Show_message("Username or password were incorect");
                }else if(request.status==400){
                    Show_message("Bad request :(");
                }
            }
        }
        request.send(JSON.stringify(msg));
    
};

function submitBrowse(form){
   var email = form.browse_useremail.value;
   lastBrowse = email;
    getOtherProfile();
    UpdateWallBrowse();
	
};

function openBrowse(browseName) {
    var i;
    var x = document.getElementsByClassName("browsebox");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    document.getElementById(browseName).style.display = "block";  

};

function submitPostBrowse(){ 
    var message = document.getElementById("postTextBrowse").value;
    var token = localStorage.getItem('token');
    
    let msg={"email":lastBrowse,"message":message};
        let request = new XMLHttpRequest();
        request.open("PUT", "/post_message", true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var noQuotes = token.split('"').join('');
        request.setRequestHeader("Authorization",noQuotes);
        request.onreadystatechange=function(){
            if (this.readyState==4){
                if(this.status==201){
                    UpdateWallBrowse();
                }else if (request.status==500){
                    Show_message("Username or password were incorect");
                }else if(request.status==400){
                    Show_message("Bad request :(");
                }
            }
        }
        request.send(JSON.stringify(msg));
    
};



function UpdateWallBrowse(){
    var token = localStorage.getItem('token');
    
        let request = new XMLHttpRequest();
        request.open("GET", "/get_user_messages_by_email/"+lastBrowse, true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var noQuotes = token.split('"').join('');
        request.setRequestHeader("Authorization",noQuotes);
        request.onreadystatechange=function(){
            if (this.readyState==4){
                if(this.status==200){
                    result=JSON.parse(request.responseText);
                    //window.confirm("re"+JSON.stringify(result));
                    result.forEach(function(c){
                        
                        document.getElementById('wall_messagesBrowse').innerHTML += "<div>" + c[0] + " : " + c[1] + "</div>"; 
                    });
                }else if (request.status==500){
                    Show_message("Username or token were incorect");
                }else if(request.status==400){
                    Show_message("Bad request :(");
                }
            }
        }
        request.send();
};

function Show_message(message) {
    var x = document.getElementById("message_field");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
};