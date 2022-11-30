import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = e => {    
    e.preventDefault()    
    const fileInput = e.target;  
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    if(fileInput.nextSibling)  fileInput.nextSibling.remove();

    if(file) { 
      if(file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/png') {
        fileInput.classList.replace('red-border','blue-border');
      } else {
        e.target.value = "";
        const $span = document.createElement("span");
        $span.innerText = "Merci de choisir une image du type jpeg ou png.";
        $span.setAttribute('data-testid', "file-error-msg");
        $span.classList.add('error');
        fileInput.after($span);
        fileInput.classList.replace('blue-border','red-border');
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const $fileInput = this.document.querySelector(`input[data-testid="file"]`);
    const file = $fileInput.files[0];
    const $errorMsg = this.document.querySelector('span[data-testid="file-error-msg"]');
    
    
    if( !$errorMsg ) {

      const email = JSON.parse(localStorage.getItem("user")).email;
  
      const bill = {
        email,
        type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
        name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
        amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
        date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
        vat: e.target.querySelector(`input[data-testid="vat"]`).value,
        pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
        commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
        fileUrl: this.fileUrl,
        fileName: this.fileName,
        status: 'pending'
      }
      //console.log( bill.name, bill.amount, bill.date, bill.pct, file.name );

       console.log("--- before store update ---")
       
       if( bill.name !== "" && bill.amount !== "" && bill.pct !== ""  && file.name !== "" ) {   
         
         const formData = new FormData()
         formData.append('file', file)
         formData.append('email', email)
         
         if(this.store) {
           
           console.log("--- store update ---")
           
           this.store
           .bills()
           .create({
             data: formData,
            headers: {
              noContentType: true
            }
          })
          .then(({fileUrl, key}) => {
            this.billId = key
            this.fileUrl = fileUrl
            this.fileName = file.name

            console.log("--- call to updateBill ---")
            
            this.updateBill(bill)
            
          }).catch(error => console.error(error))
        }
          console.log("--- redirect to bills ---")
          this.onNavigate(ROUTES_PATH['Bills'])          
      }      
        console.log("--- after store update ---")        
    }     
      console.log("--- end of handle submit ---")
  }
    
    // not need to cover this function by tests
    updateBill = (bill) => {
      if (this.store) {
        this.store
        .bills()
        .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
    console.log("--- end of updateBill ---")
  }

}