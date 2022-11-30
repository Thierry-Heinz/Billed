/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../../views/NewBillUI.js"

beforeEach(()=>{
      const html = NewBillUI()
      document.body.innerHTML = html
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    
    test("Then, it should the 2 option of expense type select form", () => {
      userEvent.selectOptions(screen.getByTestId('expense-type'), 'Restaurants et bars');
      let options = screen.getAllByTestId('select-option')
      expect(options[0].selected).toBe(false)
      expect(options[1].selected).toBe(true)
      expect(options[2].selected).toBe(false)
      expect(options[3].selected).toBe(false)
      expect(options[4].selected).toBe(false)
      expect(options[5].selected).toBe(false)
      expect(options[6].selected).toBe(false)
      
    })
  })

  test("Then, it should display an error message when the file type is not an image" , () => {
		const file = new File([""], "filename.txt", {type: "text/plain", lastModified:new Date(0)})
		const inputFile = screen.getByTestId('file');
		userEvent.upload(inputFile, file);
		expect(inputFile).not.toHaveValue();
    expect(screen.getByTestId("error-msg")).toBe(true);
	})

  	test("Then, it should display a blue border when the file type is an image on the input form element" , () => {
		  const file = new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})
		  const inputFile = screen.getByTestId('file');
		  userEvent.upload(inputFile, file);
		  expect(inputFile).toHaveClass("blue-border");
	})

})
