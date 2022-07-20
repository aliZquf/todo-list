// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert")
const form = document.querySelector(".grocery-form")
const grocery = document.querySelector("#grocery")
const submitBtn = document.querySelector(".submit-btn")
const container = document.querySelector(".grocery-container")
const list = document.querySelector(".grocery-list")
const clearBtn = document.querySelector(".clear-btn")
// edit option
let editElement;
let editflag = false
let editID="";
// ****** EVENT LISTENERS **********
form.addEventListener("submit",addItem);
clearBtn.addEventListener("click",clearItem);
window.addEventListener("DOMcontentLoaded",setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault()
    let id = new Date().getTime().toString()
    let value = grocery.value
    if(value !=="" && !editflag) {
      
      createListItem(id, value)
        displayAlert("add item to the list","success")
       
        container.classList.add("show-container");
        setBacktoDifult()
        addLocalStorage()

    }
    else if(value !=="" && editflag){
        
        editElement.innerHTML = value
        displayAlert("editing","success")
        editLocalStorage(editID,value)
        setBacktoDifult()
    }
    else{
      displayAlert("empty value","danger")
    }
   
    
}

 // display alert message

 function displayAlert(text,action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(function(){
      alert.textContent ="";
      alert.classList.remove(`alert-${action}`);
  },1000)

}
//  back to defult
function setBacktoDifult(){
  grocery.value="";
   editflag = false
    editID="";
    submitBtn.textContent = "submit"
}
// clear item

function clearItem(){
  const items = document.querySelectorAll(".grocery-item")
 if(items.length > 0){
  items.forEach(function(item){
    list.removeChild(item);
   
  })
  container.classList.remove("show-container")  
  displayAlert("empty list","danger")
  setBacktoDifult()
  localStorage.removeItem("list");
 }
}

// delete item
function deleteItem(e){
  const element = e.currentTarget.parentElement.parentElement;
  id = element.dataset.id
   list.removeChild(element);
   if(list.children.length === 0){
     container.classList.remove("show-container")
   }
   displayAlert("item delete" , "danger")
   setBacktoDifult()
   removeFormLocalStorage(id)

}
// edit item
function editItem(e){
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editflag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit"

}

// ****** LOCAL STORAGE **********
function addLocalStorage(id,value) {
const grocery = {id,value}
let items = getLocalStorage()

items.push(grocery);
localStorage.setItem("list",JSON.stringify(items));
}
function removeFormLocalStorage(id) {
  let items = getLocalStorage()

  items = items.filter(function(item) {
    if(item.id !== id){
      return item;
    }
  })
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function(item) {
    if(item.id === id){
      item.value = value;
    }
    return item;
  })
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage(){
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")):[];
}
// ****** SETUP ITEMS **********
function setupItems(){
  let items = getLocalStorage();
  if(items.length>0 ){
    items.forEach(function(item){
      createListItem(item.id, item.value)
    })
    container.classList.add("show-container")
  }
}

function createListItem(id,value){
  const element = document.createElement("article");
  // add class
  element.classList.add("grocery-item");
  // add id
  const attr = document.createAttribute("data-id");
  attr.value=id
  element.setAttributeNode(attr);
  element.innerHTML=` <p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`
  // delete And Edit item
  const deleteBtn = element.querySelector(".delete-btn") 
  const editBtn = element.querySelector(".edit-btn") 

  deleteBtn.addEventListener("click",deleteItem)
  editBtn.addEventListener("click",editItem)

  // append chaild
  list.appendChild(element);
}
