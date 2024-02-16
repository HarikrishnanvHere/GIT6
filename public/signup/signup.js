let signUp = document.getElementById("signupForm");
let errorElement = document.getElementById("error");
errorElement.style.display = "none"


function signUpUser(e){
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let obj = {
        name,email,password
    }
    axios.post("http://16.171.149.0:3000/user/signup",obj)
    .then((res)=>{
        console.log(res);
        alert ("New User Created!");
        window.location.href = '../login/login.html'
    })
    .catch(err=> {
        errorElement.style.display = "block"
    });
}

signUp.addEventListener("submit",signUpUser)
