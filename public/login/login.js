let logIn = document.getElementById("logInForm");
let messageElement = document.getElementById("message");
messageElement.style.display = "none";

function fetchLogInCredentials(e){
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let obj = {
        email,password
    }
    axios.post("http://16.171.14.149:3000/user/login",obj)
    .then((res)=>{
        alert(res.data.message);
        localStorage.setItem("token", res.data.token);
        window.location.href = "../expense/expenseForm.html";
        
        
        // if(messageElement.textContent === "LogIn Successful"){
        //     alert ("login successful!!");
        //     
        // }

        
    })
    .catch(err=>{
        console.log(JSON.stringify(err));
        messageElement.style.display = "block";
        messageElement.textContent = err.message;
        console.log(err);
    })
}


logIn.addEventListener("submit",fetchLogInCredentials)