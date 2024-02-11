async function sendMail(e){
    e.preventDefault();
    try {
        let recoveryMail = document.getElementById('recovery-mail').value;
        let response = await axios.post('http://localhost:3000/password/forgotpassword',{recoveryMail})
        document.getElementById('resultMessage').textContent = response.data.message;
    }catch(err){
        document.getElementById('resultMessage').textContent = "something went wrong!";
    }
    
}


document.getElementById("recoveryForm").onsubmit = sendMail