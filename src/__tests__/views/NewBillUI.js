/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { screen, fireEvent, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../../views/NewBillUI.js"
import NewBill from "../../containers/NewBill.js"

import { localStorageMock } from "../../__mocks__/localStorage.js"

import mockStore from "../../__mocks__/store"


jest.mock("../../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    
    test("Then, it should the 2 option of expense type select form", () => {
      document.body.innerHTML = NewBillUI();		  
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

  describe("When I am on NewBill Page, and try to upload something other than an image", () => {
    test("Then, it should display an error message when the file type is not an image" , () => {
          document.body.innerHTML = NewBillUI();		  
          Object.defineProperty(window, 'localStorage', { value: localStorageMock });
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee',
            email :"a@a"
          }));

          const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) };
          const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });	
          const inputFile = screen.getByTestId('file');
      
          const handleChangeFile = jest.fn(newBill.handleChangeFile);
          const eventLoadTxt = { target: { files:[new File(["....."], "filename.txt", {type: "text/plain", lastModified:new Date(0)})] } };

          inputFile.addEventListener('change', handleChangeFile);
          fireEvent.change(inputFile, eventLoadTxt);

          expect(inputFile).not.toHaveValue();

          const errorMsg = screen.getByTestId("file-error-msg");
          expect(errorMsg).toBeTruthy();	 
      })
    });
    describe("When I am on NewBill Page, and try to upload an image", () => {
      test("Then, it should display a blue border when the file type is an image on the input form element" , () => {
        document.body.innerHTML = NewBillUI();		
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
				window.localStorage.setItem('user', JSON.stringify({
					type: 'Employee',
					email :"a@a"
				}));

				const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) };
				const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });		
        const inputFile = screen.getByTestId('file');
    
        const handleChangeFile = jest.fn(newBill.handleChangeFile);  
        const eventLoadPng = { 
					target: { 
						files:[new File(["(⌐□_□)"], "filename.png", {type: "image/png", lastModified:new Date(0)})]
					}
				};

				inputFile.addEventListener('change', handleChangeFile);
				fireEvent.change(inputFile, eventLoadPng);
        

        expect(inputFile).toHaveClass("blue-border");
      })
    });

})
