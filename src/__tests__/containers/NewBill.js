/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { screen, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBill from "../../containers/NewBill.js"
import NewBillUI from "../../views/NewBillUI.js"

import { ROUTES, ROUTES_PATH } from "../../constants/routes"
import { localStorageMock } from "../../__mocks__/localStorage.js"
import mockStore from "../../__mocks__/store"

jest.mock("../../app/store", () => mockStore)

beforeEach(()=>{
   
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

	   const html = NewBillUI()
      document.body.innerHTML = html

  	const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

	  const newBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })


	/* test("Then, it should display an error message when the file type is not an image" , () => {
		const file = new File([""], "filename.txt", {type: "text/plain", lastModified:new Date(0)})
		const inputFile = screen.getByTestId('file');
		userEvent.upload(inputFile, file);
		expect(inputFile).not.toHaveValue();
	}) */

/* 	test("Then, it should display a blu border on the input form element" , () => {
		const file = new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})
		const inputFile = screen.getByTestId('file');
		userEvent.upload(inputFile, file);
		expect(inputFile).toHaveClass("blue-border");
	}) */
	  test("Then, it should display an error message when the file type is not an image" , () => {
		const file = new File([""], "", {type: "text/plain", lastModified:new Date(0)})
		const inputFile = screen.getByTestId('file');
		const event = {preventDefault() {}, target: {value:file}}
		userEvent.upload(inputFile, file);

		const handleChange = jest.fn((e) => newBill.handleChangeFile(e))
		console.log(handleChange)

		 inputFile.addEventListener('change', handleChange)
		 
		// inputFile.invoke('change', event)
		//fireEvent.change(inputFile, {preventDefault() {}})
		 userEvent.click(inputFile)
		expect(handleChange()).toHaveBeenCalled();
		expect(handleChange()).toBe(false);

		expect(inputFile).not.toHaveValue();
   		expect(screen.getByTestId("error-msg")).toBe(true);
	})

	// test("Then, it should ")
  });

});