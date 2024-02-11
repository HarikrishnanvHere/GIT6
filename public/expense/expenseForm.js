let expenseForm = document.getElementById("expenseForm");
let expenseList = document.getElementById("expenseEntries");
let leaderboardList = document.getElementById("leaderboardEntries")

document.getElementById("leaderboard").style.display = "none";
document.getElementById('downloadError').textContent = "";

let expensestoDisplay = document.getElementById('expensepreference');
expensestoDisplay.addEventListener('change',function(){

    const selectedValue = expensestoDisplay.value;
    saveExpensePreference(selectedValue);

})

function saveExpensePreference(expensepref) {
    localStorage.setItem('expensePreference', expensepref);
    fetchExpenses(1);
}





function displayElement(expense){

    let listElement = document.createElement("li");
    expenseList.appendChild(listElement);

    let text = `${expense.amount} - ${expense.description} - ${expense.category}`;
    let expenseEntry = document.createElement("span");
    expenseEntry.textContent = text;
    listElement.appendChild(expenseEntry);

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    listElement.appendChild(deleteButton);

    deleteButton.addEventListener("click",()=>{
        let url = `http://localhost:3000/expense/deleteexpense/${expense.id}`;
        axios.get(url,{headers:{"authorization": token}})
        .then((res)=>{
            expenseList.removeChild(listElement);
            console.log(res);
        })
        .catch(err=>console.log(err));
        
    });
}


function displayPremiumButton(premium){
    if(premium){
        document.getElementById('premium').style.display=('none');
        document.getElementById("premiumDisplay").textContent = "You are a premium user"
        document.getElementById("leaderboard").style.display = "block";
    }
}


function extractElements(data){
    console.log(data);
    for(let i=0;i<data.length;i++){
        displayElement(data[i]);
    }
}

let token = localStorage.getItem('token');
console.log(token);

document.getElementById('expensepreference').value = localStorage.getItem('expensePreference');
fetchExpenses(1);

function fetchExpenses(page){

    const expensepref = localStorage.getItem('expensePreference')
    const pageSize = expensepref;

    if(!page || page<1){
        page = 1;
    }

    console.log(page,pageSize);


    axios.get(`http://localhost:3000/expense/getexpense?page=${page}&pageSize=${pageSize}`,{headers: {"authorization": token}})
    .then((res)=>{
        //console.log(res);
        const {currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage} = res.data;
        document.getElementById("expenseEntries").innerHTML = "";
        extractElements(res.data.data);
        displayPremiumButton(res.data.premium);
        showPagination(currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage);
    })
    .catch(err=>console.log(err));

}

function showPagination(currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage) {
    const button = document.getElementById('page-button');
    if(!hasPreviousPage  && !hasNextPage){
        button.innerHTML = `No Previous Page.. <button>  1 </button> .. No Next page `;
    }
    else if(!hasPreviousPage && hasNextPage){
        button.innerHTML = ` ${currentPage} <button onclick="fetchExpenses(${nextPage})"> Next </button>`;
    }
    else if(hasNextPage && hasPreviousPage){
        button.innerHTML= `<button onclick="fetchExpenses(${previousPage})"> Previous  </button> ${currentPage} <button onclick="fetchExpenses(${nextPage})"> Next </button>`;
    }
    else if(!hasNextPage && hasPreviousPage){
        button.innerHTML= `<button onclick="fetchExpenses(${previousPage})"> Previous </button> ${currentPage}`;
    }
}



function addExpense(e){
    e.preventDefault();
    let amount = document.getElementById("amount").value;
    let description = document.getElementById("description").value;
    let category = document.getElementById("category").value;

    let obj = {
        amount,description,category
    }
    axios.post("http://localhost:3000/expense/addexpense",obj,{headers: {"authorization": token}})
    //.then(res=>console.log(res))
    .then((res)=>displayElement(res.data.data))
    .catch(err=>console.log(err));

}

expenseForm.addEventListener("submit",addExpense);

// >>>>>>> PREMIUM FEATURE 
//------------------------



document.getElementById('premium').onclick = async function (event) {

    
        //const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/purchase/purchasepremium", { headers: { "authorization": token } })
        console.log(response);
        const options = {
            "key": response.data.key_id_,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                    //console.log(response);
                    await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, { headers: { "authorization": token } })
                    .then((res)=>{
                        displayPremiumButton(true);
                        alert("You are a Premuim user now!");
                        document.getElementById('downloadError').textContent = "";
                    })
                    .catch(err=>console.log(err));
                    
                    
                 
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();
    
        rzp1.on('payment.failed', async function (response) {
            await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id // if transaction is failed no payment key is generated
                }, { headers: { "authorization": token } })
                .then((res)=>{
                    alert('Transaction FAILED!');
                })
                
                
           
        });
}



function displayLeaderBoard(info){
    console.log(info);

    let childNodes = leaderboardList.childNodes;
    console.log(childNodes);
    
    if(childNodes.length===1){

        for(let i=0;i<info.length;i++){
            //console.log(key);
            let listElement = document.createElement("li");
            leaderboardList.appendChild(listElement);
    
            let text = `Name: ${info[i].name} --- Total Expense : ${info[i].total}`;
            let leaderboardEntry = document.createElement("span");
            leaderboardEntry.textContent = text;
            listElement.appendChild(leaderboardEntry);
        }

    }

    else{
        document.getElementById("leaderboard").textContent = "Leaderboard Already Present!"
    }
    
}







document.getElementById("leaderboard").onclick = async function(){
    axios.get("http://localhost:3000/premium/showleaderboard")
// .then(data=>console.log(data.data))
.then(res=>displayLeaderBoard(res.data.data))
.catch(err=>console.log(err));

    
}


function displaylinks(data){
    let linkContainer = document.getElementById('urlEntries');
    let linkElement = document.createElement("li");
    linkContainer.appendChild(linkElement);
    let entry = document.createElement("a");
    entry.href = data.url;
    entry.textContent = data.filename;
    entry.download;
    linkElement.appendChild(entry);

}


document.getElementById("download").onclick = async ()=>{
    await axios.get("http://localhost:3000/expense/download",{headers: {"authorization": token}})
    .then((response)=>{
        console.log(response);
        if(response.data.message === "success"){
            document.getElementById('downloadError').textContent = "";
            console.log(response);

            let previouslyDownloaded = response.data.previouslyDownloaded;
            for(let i=0;i<previouslyDownloaded.length;i++){
                displaylinks(previouslyDownloaded[i]);
            }

            let a = document.createElement("a");
            a.href = response.data.url;
            a.download;
            a.click();
        }
        else if(response.data.message === "Not Authorized"){
            document.getElementById('downloadError').textContent = "Not Authorized!!";
        }
        else{
            document.getElementById('downloadError').textContent = "Please try again later!"
        }
    })
    .catch((err)=>{
        console.log(err);
        document.getElementById('downloadError').textContent = "Server Error!!!"
    })
    
    
    
}