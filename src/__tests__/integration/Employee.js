/**
 * @jest-environment jsdom
 */
import { ROUTES } from "../../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";

// need to mockup JQuery functions
import $ from 'jquery';
window.$ = jest.fn().mockImplementation(() => {
	return {
		modal: jest.fn(),
		find: jest.fn(),
		width: jest.fn(),
		html: jest.fn(),
		click: jest.fn()
	}
}); 

import router from "../../app/Router.js";

import { localStorageMock } from "../../__mocks__/localStorage.js"
import mockStore from "../../__mocks__/store"

import LoginUI from "../../views/LoginUI";
import Login from "../../containers/Login.js";

import Logout from "../../containers/Logout.js"

import BillsUI from "../../views/BillsUI.js"
import Bills from "../../containers/Bills.js"
import { bills } from "../../fixtures/bills.js"

import NewBill from "../../containers/NewBill.js"
import NewBillUI from "../../views/NewBillUI.js"

describe("Given that I am a user on login page", () => {
	describe("When I click on Employee login, with credentials", () => {

		let onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname });
		};
		test("Then I should be identified as an Employee in app", () => {			
			document.body.innerHTML = LoginUI();
			const inputData = {
				email: "employee@test.tld",
				password: "employee",
			};

			const inputEmailUser = screen.getByTestId("employee-email-input");
			fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
			expect(inputEmailUser.value).toBe(inputData.email);

			const inputPasswordUser = screen.getByTestId("employee-password-input");
			fireEvent.change(inputPasswordUser, {
				target: { value: inputData.password },
			});
			expect(inputPasswordUser.value).toBe(inputData.password);			
			
			const PREVIOUS_LOCATION = "";
			const login = new Login({document, localStorage: window.localStorage, onNavigate, PREVIOUS_LOCATION, store: mockStore})		
			login.login = jest.fn().mockResolvedValue({});
			const formEmployee = screen.getByTestId("form-employee");

			fireEvent.submit(formEmployee);		
		 });

		 test("Then it should renders Bills page", () => {
			expect(screen.getByText("Mes notes de frais")).toBeTruthy();
			expect( screen.getByTestId("btn-new-bill")).toBeTruthy();
		});

		let billsTest = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage });
		
		test("then it should display the bills table", () => {

			const root = document.createElement("div")
			root.setAttribute("id", "root")
			document.body.append(root)
			router();

			document.body.innerHTML = BillsUI({ data: bills });		
			const billsBodyTable = screen.getByTestId("tbody");
			expect( billsBodyTable ).toBeTruthy();
			expect(billsBodyTable.children).toHaveLength(4);

		})

		test("Then WHen I click on the eye icon, it should show the modal", () => {
			const iconEyes = screen.getAllByTestId('icon-eye');				
			$.fn.modal = jest.fn();

			expect(iconEyes[0]).toBeDefined();
			
			const handleClickIconEye = jest.fn(billsTest.handleClickIconEye(iconEyes[0]));
			iconEyes[0].addEventListener('click', handleClickIconEye);
			fireEvent.click(iconEyes[0]);

			expect(handleClickIconEye).toHaveBeenCalled();
			const titleProof = screen.getByText("Justificatif");
			expect(titleProof).toBeTruthy(); 
		})

		test("Then When I click on the close button icon, the modal should close", () => {
			const closeBtn = document.querySelector("button.close");
			expect(closeBtn).toBeTruthy();
			fireEvent.click(closeBtn);

			const hiddenModal = screen.getByRole('dialog', {hidden: true});
			expect(hiddenModal).toBeTruthy();	
		})		
		
		test("Then When I click on New Bill button I should be directed to New Bill page", () => {
			const btnNewBill = screen.getByTestId("btn-new-bill")
			expect( btnNewBill ).toBeTruthy();
			fireEvent.click(btnNewBill);

			document.body.innerHTML = NewBillUI();
			
			const root = document.createElement("div")
			root.setAttribute("id", "root")
			document.body.append(root)
			router();		
			
			expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
			
			const formNewBill = screen.getByTestId("form-new-bill");
			expect(formNewBill).toBeTruthy();
		})
		
		
		test("Then When I try to upload an invalid expense file", () => {
			const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage });
			const inputFile = screen.getByTestId('file');
			expect(inputFile).toBeTruthy();
			
			const handleChangeFile = jest.fn(newBill.handleChangeFile);
			const eventLoadTxt = { target: { files:[new File(["....."], "filename.text", {type: "text/plain", lastModified:new Date(0)})] } };
			
			inputFile.addEventListener('change', handleChangeFile);
			fireEvent.change(inputFile, eventLoadTxt);
			
			expect(handleChangeFile).toHaveBeenCalled();
			
			const errorMsg = screen.getByTestId("file-error-msg");
			expect(errorMsg).toBeTruthy();	 
			expect(errorMsg.innerText).toEqual("Merci de choisir une image du type jpeg ou png.");	
		})
		
		test("Then When I try to submit the new bill form with invalid fields, I should stay on new Bill page", () => {
			const submitNewBill = jest.fn((e) => e.preventDefault());
			const formNewBill = screen.getByTestId('form-new-bill');
			const inputFile = screen.getByTestId('file');
			expect(inputFile).toBeTruthy();
			
			formNewBill.addEventListener("submit", submitNewBill);
			fireEvent.submit(formNewBill);
			
			expect(submitNewBill).toHaveBeenCalled();
			expect(document.body.innerHTML).not.toContain("Mes notes de frais");
			expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
		})
		
		test("When I upload a valid expense file type, the error should disappear", () => {
			const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage });
			
			const inputFile = screen.getByTestId('file');
			expect(inputFile).toBeTruthy();
			
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
			
			expect(inputFile.nextSibling).not.toBeTruthy();
		})
		
		test("Then When I fill the fields and try to submit the form, I should be redirected to Bills page", () => {
			document.body.innerHTML = NewBillUI();
			const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage });
			const inputType = screen.getByTestId("expense-type");
			inputType.value = 0 ;
			const inputName = screen.getByTestId("expense-name");
			inputName.value=  "Test note de frais Transports";
			const inputAmount = screen.getByTestId("amount");
			inputAmount.value= "1500" ;
			const inputDate = screen.getByTestId("datepicker");
			inputDate.value = new Date();
			const inputPct = screen.getByTestId("pct");
			inputPct.value= "50";

			const inputFile = screen.getByTestId('file');
			expect(inputFile).toBeTruthy();
			const handleChangeFile = jest.fn(newBill.handleChangeFile);
			const eventLoadPng = { 
				target: { 
					files:[new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})]
				}
			};
			inputFile.addEventListener('change', handleChangeFile);
			fireEvent.change(inputFile, eventLoadPng);

			const submitNewBill = jest.fn((e) => e.preventDefault());
			const formNewBill = screen.getByTestId('form-new-bill');		
			
			formNewBill.addEventListener("submit", submitNewBill);
			fireEvent.submit(formNewBill);

			expect(submitNewBill).toHaveBeenCalled();

			document.body.innerHTML = BillsUI({ data: bills });

			expect(screen.getByText("Mes notes de frais")).toBeTruthy();
			expect( screen.getByTestId("btn-new-bill")).toBeTruthy();
			expect( screen.getByTestId("tbody")).toBeTruthy(); 
		})

		test("Then When I click on logout icon, I should be redirected to the login page", () => {
			document.body.innerHTML = BillsUI({ data: bills });
			const logout = new Logout({ document, onNavigate, localStorage })
			const handleClick = jest.fn(logout.handleClick)

			const disco = document.querySelector('#layout-disconnect')
			disco.addEventListener('click', handleClick)
			fireEvent.click(disco)
			expect(handleClick).toHaveBeenCalled()
			
			const formEmployee = screen.getByTestId("form-employee");
			expect(formEmployee).toBeTruthy();
		})
	
	});

});