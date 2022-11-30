/* 
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { screen, fireEvent, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBill from "../../containers/NewBill.js"
import NewBillUI from "../../views/NewBillUI.js"

import { ROUTES, ROUTES_PATH } from "../../constants/routes"
import { localStorageMock } from "../../__mocks__/localStorage.js"
import mockStore from "../../__mocks__/store"


jest.mock("../../app/store", () => mockStore)
 

describe("Given I am connected as an employee", () => {
	
	describe("Given I am on NewBill Page", () => {  
		
	  beforeEach(()=> {
		  const html = NewBillUI();
		  document.body.innerHTML = html;
		  
		  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
		  window.localStorage.setItem('user', JSON.stringify({
			type: 'Employee',
			email :"a@a"
		  }));
	  })

	   afterEach(() => {
		document.body.innerHTML = "";
	  }); 

	describe("When I want to upload a documents", () => {		
		describe("When I upload an valid file type", ()=> {	
			test('Then the file should be stored', () =>{
				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname })
				}
				const newBill = new NewBill({
					document, onNavigate, store: mockStore, localStorage: window.localStorage
				})
				const inputFile = screen.getByTestId('file');
				const handleChangeFile = jest.fn(newBill.handleChangeFile);
				const eventLoadPng = { 
					target: { 
						files:[new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})]
					}
				};

				inputFile.addEventListener('change', handleChangeFile);
				fireEvent.change(inputFile, eventLoadPng);

				expect(inputFile.files.length).toBe(1);
				expect(handleChangeFile).toHaveBeenCalled();
				expect(inputFile.files[0].name).toBe("filename.png");
				expect(inputFile.files[0].type).toBe("image/png");
			});
		});

		describe("When I upload an invalid file type", ()=> {
			test('Then the file should not be stored, and an error displayed', async () =>{
				const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) };
				const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
				const inputFile = screen.getByTestId('file');
				const handleChangeFile = jest.fn(newBill.handleChangeFile);
				const eventLoadTxt = { target: { files:[new File(["....."], "filename.text", {type: "text/plain", lastModified:new Date(0)})] } };

				inputFile.addEventListener('change', handleChangeFile);
				fireEvent.change(inputFile, eventLoadTxt);
				
				expect(inputFile).not.toHaveValue();
				expect(inputFile).toHaveClass("red-border");
				expect(handleChangeFile).toHaveBeenCalled();

				const errorMsg = screen.getByTestId("file-error-msg");
				expect(errorMsg).toBeTruthy();	 
				expect(errorMsg.innerText).toEqual("Merci de choisir une image du type jpeg ou png.");			
			});
		});

		describe("When I change an invalid file for a valid one", () => {
			test('then the error message should disappear, and the file should be stored', () => {
				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname })
				}
				const newBill = new NewBill({
					document, onNavigate, store: mockStore, localStorage: window.localStorage
				})
				const inputFile = screen.getByTestId('file');
				const handleChangeFile = jest.fn(newBill.handleChangeFile);
				const errorMsg = document.createElement("span");

				errorMsg.innerText = "Merci de choisir une image du type jpeg ou png.";
				errorMsg.setAttribute('data-testid', "file-error-msg");
				errorMsg.classList.add('error');
				inputFile.after(errorMsg);
				inputFile.classList.replace('blue-border','red-border');

				const eventLoadPng = { 
					target: { 
						files:[new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})]
					}
				};
				inputFile.addEventListener('change', handleChangeFile);
				fireEvent.change(inputFile, eventLoadPng);

				expect(inputFile.files.length).toBe(1);
				expect(handleChangeFile).toHaveBeenCalled();
				expect(inputFile.files[0].name).toBe("filename.png");
				expect(inputFile.files[0].type).toBe("image/png");
				expect(inputFile).toHaveClass("blue-border");

				expect(inputFile.nextSibling).not.toBeTruthy();
			});
		});
		
	});

	describe("When I want to submit my expense", () => {
		describe("When I submit my form with valid values", () => {
			test("Then the data should be stored and I should be redirected on Bills page", async () =>{
				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname })
				} 
				const newBill = new NewBill({
					document, onNavigate, store: mockStore, localStorage: window.localStorage
				}) 
				
				const inputType = screen.getByTestId("expense-type");
				inputType.value = 3 ;
				const inputName = screen.getByTestId("expense-name");
				inputName.value=  "Test note de frais Services en ligne";
				const inputAmount = screen.getByTestId("amount");
				inputAmount.value= "800" ;
				const inputDate = screen.getByTestId("datepicker");
				inputDate.value = new Date();
				const inputPct = screen.getByTestId("pct");
				inputPct.value= "20";
				const inputFile = document.querySelector(`input[data-testid="file"]`)	
				const fakeFile = new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})			
				userEvent.upload(inputFile, fakeFile);

				console.log(inputFile.files.length)
				expect(inputFile.files[0].name).toBe("filename.png");
				
				//const submitNewBill = jest.spyOn(newBill, 'addEventListener');
				const formNewBill = screen.getByTestId('form-new-bill');
				/* formNewBill.addEventlistener = jest.fn().mockImplementationOnce((event, callback) => {
					callback();
				}) */
				
				//formNewBill.addEventListener("submit", submitNewBill);
				console.log("--- just before fire submit ---")

				fireEvent.submit(formNewBill);

				//expect(submitNewBill).toBeCalledWith('message', expect.any(Function), false);

				expect(screen.getByText("Mes notes de frais")).toBeTruthy();
				expect( screen.getByTestId("btn-new-bill")).toBeTruthy();
				expect( screen.getByTestId("tbody")).toBeTruthy(); 
			})
		}) 
		

		describe("When I submit my form with invalid values", () => {
			test("Then I should stay on NewBill page", () => {
				 const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname })
				} 
				 const newBill = new NewBill({
					document, onNavigate, store: mockStore, localStorage: window.localStorage
				}) 
				//const submitNewBill = jest.fn(newBill.handleSubmit);
				const formNewBill = screen.getByTestId('form-new-bill');
				const inputFile = screen.getByTestId('file');
				const errorMsg = document.createElement("span");
				errorMsg.innerText = "Merci de choisir une image du type jpeg ou png.";
				errorMsg.setAttribute('data-testid', "file-error-msg");
				errorMsg.classList.add('error');
				inputFile.after(errorMsg);
				inputFile.classList.replace('blue-border','red-border');

				//formNewBill.addEventListener("submit", submitNewBill);
				console.log("check 1")
				fireEvent.submit(formNewBill);
				console.log("check 2")

				//expect(newBill.handleSubmit).toHaveBeenCalled();
				expect(document.body.innerHTML).not.toContain("Mes notes de frais");
				expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
			})
		})
		
	})

	
	describe("When I do API calls", () => {

		describe("When an error 404 occures on submit",  () => {
			test("Then an error should appear in the console", async () => {	
				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname })
				} 
				 const newBill = new NewBill({
					document, onNavigate, store: mockStore, localStorage: window.localStorage
				}) 		

				const inputType = screen.getByTestId("expense-type");
				inputType.value = 3 ;
				const inputName = screen.getByTestId("expense-name");
				inputName.value=  "Test note de frais Services en ligne";
				const inputAmount = screen.getByTestId("amount");
				inputAmount.value= "800" ;
				const inputDate = screen.getByTestId("datepicker");
				inputDate.value = new Date();
				const inputPct = screen.getByTestId("pct");
				inputPct.value= "20";
				const inputFile = document.querySelector(`input[data-testid="file"]`)	
				const fakeFile = new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})			
				userEvent.upload(inputFile, fakeFile);

				console.log(inputFile.files.length)
				expect(inputFile.files[0].name).toBe("filename.png");

				const formNewBill = screen.getByTestId('form-new-bill');
				const store = mockStore;

				jest.spyOn(mockStore, "bills");
				jest.spyOn(console, "error");

				store.bills.mockImplementation(() => {
					return {
						create: (bill) => {
							return Promise.reject(new Error("Erreur 404"))
						}
					}
				})

				fireEvent.submit(formNewBill);

				await new Promise(process.nextTick);
				expect(console.error).toHaveBeenCalledWith(new Error('Erreur 404'))
			})
		})

		describe("When an error 500 occures on submit",  () => {
			test("Then an error should appear in the console", async () => {	
				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname })
				} 
				 const newBill = new NewBill({
					document, onNavigate, store: mockStore, localStorage: window.localStorage
				}) 		

				const inputType = screen.getByTestId("expense-type");
				inputType.value = 3 ;
				const inputName = screen.getByTestId("expense-name");
				inputName.value=  "Test note de frais Services en ligne";
				const inputAmount = screen.getByTestId("amount");
				inputAmount.value= "800" ;
				const inputDate = screen.getByTestId("datepicker");
				inputDate.value = new Date();
				const inputPct = screen.getByTestId("pct");
				inputPct.value= "20";
				const inputFile = document.querySelector(`input[data-testid="file"]`)	
				const fakeFile = new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})			
				userEvent.upload(inputFile, fakeFile);

				console.log(inputFile.files.length)
				expect(inputFile.files[0].name).toBe("filename.png");

				const formNewBill = screen.getByTestId('form-new-bill');
				const store = mockStore;

				jest.spyOn(mockStore, "bills");
				jest.spyOn(console, "error");

				store.bills.mockImplementation(() => {
					return {
						create: (bill) => {
							return Promise.reject(new Error("Erreur 500"))
						}
					}
				})

				fireEvent.submit(formNewBill);

				await new Promise(process.nextTick);
				expect(console.error).toHaveBeenCalledWith(new Error('Erreur 500'))
			})
		})

	});
	
  });

}); 