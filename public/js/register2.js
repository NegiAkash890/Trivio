function myFunction() {
  var x = document.getElementById("pass");
  if (x.type === "password") {
     x.type = "text";
  } else {
     x.type = "password";
  }
  }

 function validation(){
  var pass = document.getElementById('pass').value;
  var confirmpass = document.getElementById('conpass').value;
  if(pass == ""){
    document.getElementById('passwords').innerHTML =" ** Please fill the password field";
    return false;
  }
  if((pass.length <= 5) || (pass.length > 20)) {
    document.getElementById('passwords').innerHTML =" ** Passwords lenght must be between  5 and 20";
    return false;	
  }
  if(pass!=confirmpass){
    document.getElementById('confrmpass').innerHTML =" ** Password does not match the confirm password";
    return false;
  }
  if(confirmpass == ""){
    document.getElementById('confrmpass').innerHTML =" ** Please fill the confirmpassword field";
    return false;
  }			

}