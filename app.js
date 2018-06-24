// Contact section to handle the object related part

function contact(name, email, phone) {

    this.name = name;
    this.email = email;
    this.phone = phone;
}

// Ui section to handle the UI elements

function uiStuff() {}

uiStuff.prototype.addContact = function (contactObject,uiStuffObject) {

      
   
        const list = document.getElementById('contactList');
        
        const mediaRow = document.createElement('tr');
        mediaRow.innerHTML =     `
        <td>
        <img class="align-self-center mr-3" src="contuser.png" height=40px width=40px alt="Generic placeholder image"></td>
        <td>${contactObject.name}</td>
        <td>${contactObject.email}</td>
        <td>${contactObject.phone}</td>
        <td><a href="#"class="button delete">Delete</a></td>
        `;
        
        list.appendChild(mediaRow);

        // remove the data from fields after adding to the row
        clearFields();
}




// Show alert prototype to reuse the same prototype for success and fail
uiStuff.prototype.showAlert = function(message,alertClassName)
{
// create div 
const div = document.createElement('div');
//add classes to it
div.className = `alert ${alertClassName}`;
div.appendChild(document.createTextNode(message));

// Get Parent to show alert
const container = document.querySelector('.container');
const form = document.querySelector('#contactForm');

// Insert the alert before form and inside container
container.insertBefore(div,form);

// to make it dissappear after 3 seconds

setTimeout(function () {
    document.querySelector('.alert').remove();
},1000);

}



// remove the data from fields after adding to the row
function clearFields() {
    document.getElementById('name').value = '';
    document.getElementById('emailId').value = '';
    document.getElementById('contNum').value = '';

}


// Validate if the passed data is not filled ( is empty)
function validateData(contactName,contactEmail,contactPhone,uiStuffObject) {
    if (contactName.length == 0 || contactEmail.length == 0 || contactPhone.length == 0) {
        
        // create an alert with the error message 
        // this can be done in UI handler we have declared above.
        // we will create prototype which will show sucess / failure after pressing the button
        // it will take the class (.fail / .success we have created in heading style in html page dynamically to decide)

        return false;
    } else {
        return true;
    }
}





class LocalStore
{

    static getContacts()
    {
        let contactItems;
        if(localStorage.getItem('contacts') === null){
             contactItems = [];
        }else{
            contactItems = JSON.parse(localStorage.getItem('contacts'));
        }

        return contactItems;
    }
 

    static deleteContact(eventTarget){
        console.log(eventTarget.parentElement.previousElementSibling.previousElementSibling.textContent);
            const emailValueToDelete = eventTarget.parentElement.previousElementSibling.previousElementSibling.textContent;
           // To navigate to Email value of the row
           // eventarget(Del button) >> parentElement(td of button)>>previousElementSibling(td of the contact number value)>>previousElementSibling(td of the email value)
           // we want email because that cannot be used by 2 ppl.contact can be used by 2 ppl.
           
           const contacts = LocalStore.getContacts();

           contacts.forEach(function(cont,index){
               if(cont.email === emailValueToDelete )
               {
                    contacts.splice(index,1);
               }
           });
           localStorage.setItem('contacts',JSON.stringify(contacts));



    }

    static displayContacts(){
        const contactListFromLS = LocalStore.getContacts();
        console.log(contactListFromLS);


    
        contactListFromLS.forEach(function (cont){

            const ui  = new uiStuff();
          ui.addContact(cont);
                  });
    
    }
    static putContacts(ContactObject){
        
        const contactItems = LocalStore.getContacts();
        contactItems.push(ContactObject);
        localStorage.setItem('contacts',JSON.stringify(contactItems));
    }
}


/// Call display Contact method in document load

document.addEventListener('DOMContentLoaded',LocalStore.displayContacts);


document.getElementById('submitContact').addEventListener('click', addContactToList);
function addContactToList(e) {


    const name = document.getElementById('name').value;
    const email = document.getElementById('emailId').value;
    const phone = document.getElementById('contNum').value;

    let isvalid;
    const ui = new uiStuff();
    //first validate the data.
    isValid = validateData(name,email,phone,ui);
    //if the returned boolean flafg is true then create the object with data 
    if (isValid) {

    //instantiate the UI object
    const contactObj = new contact(name, email, phone);
    console.log(contactObj);
    ui.addContact(contactObj,ui);
  // Show an alert that the operation is success 
  ui.showAlert('Contact saved successfully !','success');
        LocalStore.putContacts(contactObj);


    }
    else{
        // FAILURE
         //param1 = message , param2 = class of the alert 
         ui.showAlert('Please fill all the fields to add a contact','fail');
    }
    e.preventDefault();
}


document.getElementById('contactList').addEventListener('click',deleteContactFromList);
function deleteContactFromList(e) {

    if(e.target.className === 'button delete')
    {
        // remove the whole row
        // that is button(e.target)'s parent ( td) and td's parent(tr) 
        e.target.parentElement.parentElement.remove();
        
        // Call the deletefrom localstorage method to delete the contact from local storage

        LocalStore.deleteContact(e.target);
        
        
        //show alert with sucess of deletion
        // Just call the prototype
        const ui = new uiStuff();
        ui.showAlert('Deletion Successful !','success');
    }
    



    e.preventDefault();
}


