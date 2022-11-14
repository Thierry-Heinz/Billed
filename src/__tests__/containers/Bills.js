/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import Bills from "../../containers/Bills.js"
import { bills } from "../../fixtures/bills.js"

describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {	
		describe("When I click on the first bill eye icon", () => {
			test("Then the modal should show", () => { 
				console.log(screen)       
				const handleClickIconEye = jest.fn(Bills.handleClickIconEye)
				const iconEye = screen.getByTestId('icon-eye');
				iconEye.addEventListener('click', handleClickIconEye)
				userEvent.click(eye)
				expect(handleClickIconEye).toHaveBeenCalled()

			})

		})
	});
});
