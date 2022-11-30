/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../../views/BillsUI.js"
import Bills from "../../containers/Bills.js"
import { bills } from "../../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../../constants/routes.js";
import {localStorageMock} from "../../__mocks__/localStorage.js";
import mockStore from "../../__mocks__/store"

import { formatDate, formatStatus } from "../../app/format";
import $ from 'jquery';

import router from "../../app/Router.js";


jest.mock("../../app/store", () => mockStore)

// need to mockup JQuery functions
			window.$ = jest.fn().mockImplementation(() => {
			return {
					modal: jest.fn(),
					find: jest.fn(),
					width: jest.fn(),
					html: jest.fn(),
					click: jest.fn()
				}
			}); 

describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {	 

 	let root;
	let onNavigate;
	let billsTest;
	beforeEach(()=> {	
		Object.defineProperty(window, 'localStorage', { value: localStorageMock });
		window.localStorage.setItem('user', JSON.stringify({
			type: 'Employee', email:'a@a'
		}))   			
		root = document.createElement("div")
		root.setAttribute("id", "root")
		document.body.append(root)
		router();				
		window.onNavigate(ROUTES_PATH.Bills)
		onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname })
		}
	})

	//reset all
	afterEach(() => {				
		document.body.innerHTML = '';
		root = undefined;
		billsTest = undefined;
		onNavigate = undefined;
	}) 

		describe("When the table is loaded but empty", () => {			
			
			test('Then no bills should be displayed', async () => {

				billsTest = new Bills({document, onNavigate, store: null, localStorage: window.localStorage });
				const emptyBills = await billsTest.getBills();
				document.body.innerHTML = BillsUI({ data: emptyBills });		

				const billsBodyTable = screen.getByTestId("tbody");
				expect(billsBodyTable.children).toHaveLength(0);

				const iconEye = screen.queryByTestId("icon-eye");      
				expect(iconEye).not.toBeTruthy();
			})	
		})


 		describe("When the table with all the bills is loaded", () => {			
			
			test('Then it should display 4 bills', () => {

				document.body.innerHTML = BillsUI({ data: bills });		
				billsTest = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage });

				const billsBodyTable = screen.getByTestId("tbody");
				expect(billsBodyTable.children).toHaveLength(4);
			})	
		})
 
 	 	describe("When I click on the first bill eye icon", () => {			
			  
			test("Then the handleClickIconEye should be called", async () => { 
					
				 document.body.innerHTML = BillsUI({ data: bills });		
				
				const iconEyes = screen.getAllByTestId('icon-eye');
				
				$.fn.modal = jest.fn();
				billsTest = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage });
				
				expect(iconEyes[0]).toBeDefined();
				
				const handleClickIconEye = jest.fn(billsTest.handleClickIconEye(iconEyes[0]));
				iconEyes[0].addEventListener('click', handleClickIconEye);
				fireEvent.click(iconEyes[0]);

				expect(handleClickIconEye).toHaveBeenCalled();

				 const titleProof = screen.getByText("Justificatif");

				 expect(titleProof).toBeTruthy(); 

			})
		})   

   	  	describe("When I click on add a new bill button", () => {							
				
			test("Then handleClickNewBill should be called", async () => {
					
				billsTest = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage });
				document.body.innerHTML = BillsUI({ data: bills })		

				const btnNewBill = screen.getByTestId('btn-new-bill')

				expect(btnNewBill).toBeDefined();

				const handleClickNewBill = jest.fn(billsTest.handleClickNewBill)
				btnNewBill.addEventListener('click', handleClickNewBill)
				userEvent.click(btnNewBill);
				expect(handleClickNewBill).toHaveBeenCalled()

				const textSendBill = screen.getByText("Envoyer une note de frais");
				expect(textSendBill).toBeTruthy();
			})
		})     

 
		// test d'intégration GET
		  describe('When I navigate to Bills', () => {				
			  
			  test("Then fetches bills from mock API GET", async () => {				  
				  const billsStoredMock = await mockStore.bills().list();
				  
				  const titleText = screen.getByText("Mes notes de frais");
				  expect(titleText).toBeTruthy();
				  
				  const contentTable =  await screen.getByTestId("tbody");
				  
				  expect(contentTable).toBeTruthy();
				  expect(contentTable.children).toHaveLength(billsStoredMock.length);
				  
				  const newBillBtn = screen.getByTestId("btn-new-bill");
				  expect(newBillBtn).toBeTruthy();
				})			
			})
			
			
			describe("When bills have been fetched from mock API GET", () => {
				test("Then if date isn't corrupted, bills should be displayed with date formatted & status", async () => {

					billsTest = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage });
				  	document.body.innerHTML = BillsUI({ data: await billsTest.getBills() });	 

					const billsStoredMock = await mockStore.bills().list();

					const dateInstore = formatDate(billsStoredMock[0].date)
					const statusInstore = formatStatus(billsStoredMock[0].status)

					const firstBill = screen.getByTestId("tbody").firstElementChild.innerHTML;

					expect(firstBill).toMatch(new RegExp(`${dateInstore}`));
					expect(firstBill).toMatch(new RegExp(`${statusInstore}`));

			})
		})

		describe("When an error occurs on API", () => {
			beforeEach(() => {
				jest.spyOn(mockStore, "bills")
				Object.defineProperty(window, 'localStorage', { value: localStorageMock })
				window.localStorage.setItem('user', JSON.stringify({
					type: 'Employee', email: 'a@a'
				}))      
				const root = document.createElement("div")
				root.setAttribute("id", "root")
				document.body.append(root)
				router()
			})
			test("fetches bills from an API and fails with 404 message error", async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
					list : () =>  {
						return Promise.reject(new Error("Erreur 404"))
					}
					}})
					window.onNavigate(ROUTES_PATH.Bills)
					 await new Promise(process.nextTick);
					const message = await screen.getByText(/Erreur 404/)
					expect(message).toBeTruthy()
				})	
			test("fetches messages from an API and fails with 500 message error", async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
					list : () =>  {
						return Promise.reject(new Error("Erreur 500"))
					}
				}})
				window.onNavigate(ROUTES_PATH.Bills)
				await new Promise(process.nextTick);
				const message = await screen.getByText(/Erreur 500/)
				expect(message).toBeTruthy()
			})				
		})  

	});
});
