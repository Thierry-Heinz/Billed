/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../../views/BillsUI.js"
import Bills from "../../containers/Bills.js"
import { bills } from "../../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../../constants/routes.js";
import {localStorageMock} from "../../__mocks__/localStorage.js";
import mockStore from "../../__mocks__/store"
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
		Object.defineProperty(window, 'localStorage', { value: localStorageMock })
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
		document.body.innerHTML = BillsUI({ data: bills })
		
		billsTest = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage });
	})
	//reset all
	afterEach(() => {				
		document.body.innerHTML = '';
		root = undefined;
		billsTest = undefined;
		onNavigate = undefined;
	})

		describe("When the table with all the bills is loaded", () => {
			test('Then it should display 4 bills', () => {
				const billsBodyTable = screen.getByTestId("tbody");
				expect(billsBodyTable.children).toHaveLength(4);
			})	
		})

 	 	describe("When I click on the first bill eye icon", () => {
			test("Then the handleClickIconEye should be called", async () => { 		
				const handleClickIconEye = jest.fn(billsTest.handleClickIconEye)
				const iconEyes = screen.getAllByTestId('icon-eye');
				
				iconEyes[0].addEventListener('click', handleClickIconEye(iconEyes[0]))
				userEvent.click(iconEyes[0])
				expect(handleClickIconEye).toHaveBeenCalled()
			})
		})   

  	 	describe("When I click on add a new bill button", () => {		
			test("Then handleClickNewBill should be called", async () => {
				const handleClickNewBill = jest.fn(billsTest.handleClickNewBill)
				const btnNewBill = screen.getByTestId('btn-new-bill')
				btnNewBill.addEventListener('click', handleClickNewBill)
				userEvent.click(btnNewBill);
				expect(handleClickNewBill).toHaveBeenCalled()
			})
		})   


		// test d'intégration GET
		  describe('When I navigate to Bills', () => {	
			test("fetches bills from mock API GET", async () => {
				const titleText = screen.getByText("Mes notes de frais");
				expect(titleText).toBeTruthy();
				const contentTable =  screen.getByTestId("bills-table");
				expect(contentTable).toBeTruthy();
				const newBillBtn = screen.getByTestId("btn-new-bill");
				expect(newBillBtn).toBeTruthy();
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
