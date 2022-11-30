/**
 * @jest-environment jsdom
 */

import LoginUI from "../../views/LoginUI";
import Login from "../../containers/Login.js";
import { ROUTES } from "../../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";
import { mockStore } from "../../__mocks__/store.js";
import Store from "../../app/Store.js";
import { localStorageMock } from "../../__mocks__/localStorage.js"


describe("Given that I am on the login page", () => {

	  beforeEach(()=> {
		  const html = LoginUI();
		  document.body.innerHTML = html;			  
		 // Object.defineProperty(window, 'localStorage', { value: localStorageMock });  
	  })

	/*   afterEach(() => {
		document.body.innerHTML = "";
	  }); */

	  describe("When I try to Login as an Employee", () => {		  
		  describe("When I click on Employee login with empty fields" , () => {
			test("Then I should stay on login page", () => {				
				const inputEmailUser = screen.getByTestId("employee-email-input");
				expect(inputEmailUser.value).toBe("");
				
				const inputPasswordUser = screen.getByTestId("employee-password-input");
				expect(inputPasswordUser.value).toBe("");
				
				const form = screen.getByTestId("form-employee");
				const handleSubmit = jest.fn((e) => e.preventDefault());
				
				form.addEventListener("submit", handleSubmit);
				fireEvent.submit(form);
				expect(screen.getByTestId("form-employee")).toBeTruthy();
			})			  
		})

		describe("When I click on Employee login with incorrect values in fields", () => {
			test("Then I should stay on login page", () => {
				const inputEmailUser = screen.getByTestId("employee-email-input");
				inputEmailUser.value = "notamail"
				expect(inputEmailUser.value).toBe("notamail");

				const inputPasswordUser = screen.getByTestId("employee-password-input");
				inputPasswordUser.value= "azerty";
				expect(inputPasswordUser.value).toBe("azerty");

				const form = screen.getByTestId("form-employee");
				const handleSubmit = jest.fn((e) => e.preventDefault());

				form.addEventListener("submit", handleSubmit);
				fireEvent.submit(form);
				expect(screen.getByTestId("form-employee")).toBeTruthy();
			})
		})

		describe("When I click on Employee login with correct values in fields", () => {
			/* test("Then I should be identified as an Employee", () => {
				
				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname });
				};

				Object.defineProperty(window, "localStorage", {
					value: {
						getItem: jest.fn(() => null),
						setItem: jest.fn(() => null),
					},
					writable: true,
				});

				const store = jest.fn();
				const PREVIOUS_LOCATION = "";

				window.localStorage.setItem = jest.fn();
				window.localStorage.getItem = jest.fn();

				const login = new Login({document, localStorage: window.localStorage, onNavigate, PREVIOUS_LOCATION, store})

				const inputEmailUser = screen.getByTestId("employee-email-input");
				 fireEvent.change(inputEmailUser, { target: { value: "employee@test.tld" } });
				expect(inputEmailUser.value).toBe("employee@test.tld");

				const inputPasswordUser = screen.getByTestId("employee-password-input");
				 fireEvent.change(inputPasswordUser, {        target: { value: "employee" },      });
				expect(inputPasswordUser.value).toBe("employee");

				const formEmployee = screen.getByTestId("form-employee");

				const handleSubmit = jest.fn(login.handleSubmitEmployee);
				login.login = jest.fn().mockResolvedValue({});

				formEmployee.addEventListener("submit", handleSubmit);

				console.log("-- before submit --")
				fireEvent.submit(formEmployee);
				//const event = new Event('click')
				//handleSubmit(event);

				expect(handleSubmit).toHaveBeenCalled();
				expect(window.localStorage.setItem).toHaveBeenCalled();
				expect(window.localStorage.setItem).toHaveBeenCalledWith(
					"user",
					JSON.stringify({
						type: "Employee",
						email: "employee@test.tld",
						password: "employee",
						status: "connected",
					})
				);		
				
				//expect(screen.getByText("Mes notes de frais")).toBeTruthy();
				expect( screen.getByTestId("btn-new-bill")).toBeTruthy();
				expect( screen.getByTestId("tbody")).toBeTruthy(); 
			}) */
			/* test("It should renders Bills page", () => {
				expect(screen.getByText("Mes notes de frais")).toBeTruthy();
				expect( screen.getByTestId("btn-new-bill")).toBeTruthy();
				expect( screen.getByTestId("tbody")).toBeTruthy(); 
			}); */

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

			const form = screen.getByTestId("form-employee");

			// localStorage should be populated with form data
			Object.defineProperty(window, "localStorage", {
				value: {
				getItem: jest.fn(() => null),
				setItem: jest.fn(() => null),
				},
				writable: true,
			});

			// we have to mock navigation to test it
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};

			let PREVIOUS_LOCATION = "";

			const store = jest.fn();

			const login = new Login({
				document,
				localStorage: window.localStorage,
				onNavigate,
				PREVIOUS_LOCATION,
				store,
			});

			const handleSubmit = jest.fn(login.handleSubmitEmployee);
			login.login = jest.fn().mockResolvedValue({});
			form.addEventListener("submit", handleSubmit);
			fireEvent.submit(form);
			expect(handleSubmit).toHaveBeenCalled();
			expect(window.localStorage.setItem).toHaveBeenCalled();
			expect(window.localStorage.setItem).toHaveBeenCalledWith(
				"user",
				JSON.stringify({
				type: "Employee",
				email: inputData.email,
				password: inputData.password,
				status: "connected",
				})
			);
			});
			test("It should renders Bills page", () => {
			expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
			});

		})
	})
})