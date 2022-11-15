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

import router from "../../app/Router.js";

describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {	

	Object.defineProperty(window, 'localStorage', { value: localStorageMock })
					window.localStorage.setItem('user', JSON.stringify({
						type: 'Employee'
					}))      
					const root = document.createElement("div")
					root.setAttribute("id", "root")
					document.body.append(root)
					router()
					window.onNavigate(ROUTES_PATH.Bills)
					const onNavigate = (pathname) => {
						document.body.innerHTML = ROUTES({ pathname })
					}

					document.body.innerHTML = BillsUI({ data: bills })
 
					const billsTest = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage });
				

		describe("When I click on the first bill eye icon", () => {
			test("Then the modal should show", async () => { 

				
				await waitFor(()=> screen.getAllByTestId('icon-eye'));
				const handleClickIconEye = jest.fn(Bills.handleClickIconEye)
				const iconEyes = screen.getAllByTestId('icon-eye');
				
				iconEyes[0].addEventListener('click', handleClickIconEye)
				userEvent.click(iconEyes[0])
				expect(handleClickIconEye).toHaveBeenCalled()

			})

		})

		describe("When I click on add a new bill button", () => {
			test("Then handleClickNewBill should be called", async () => {
				await waitFor(() => screen.getByTestId('btn-new-bill'))
				const handleClickNewBill = jest.fn(Bills.handleClickNewBill)
				const btnNewBill = screen.getByTestId('btn-new-bill')
				btnNewBill.addEventListener('click', handleClickNewBill)
				userEvent.click(btnNewBill);
				expect(handleClickNewBill).toHaveBeenCalled()

			})
		})
	});
});
