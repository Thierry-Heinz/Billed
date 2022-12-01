/**
 * @jest-environment jsdom
 */

import LoginUI from "../../views/LoginUI";
import Login from "../../containers/Login.js";
import { ROUTES } from "../../constants/routes";
import { fireEvent, screen } from "@testing-library/dom";

describe("Given that I am a user on login page", () => {

  describe("When an error occurs when login as an Employee", () => {
	test("Then a new user should have been created", async () => {
		document.body.innerHTML = LoginUI();

		const inputData = {
			email: "ErrorEmployee@email.com",
			password: "azerty",
		};

		const inputEmailUser = screen.getByTestId("employee-email-input");
		fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
		expect(inputEmailUser.value).toBe(inputData.email);

		const inputPasswordUser = screen.getByTestId("employee-password-input");
		fireEvent.change(inputPasswordUser, {
			target: { value: inputData.password },
		});
		expect(inputPasswordUser.value).toBe(inputData.password);

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

		const store = null;
		const PREVIOUS_LOCATION = "";

		const login = new Login({document, localStorage: window.localStorage, onNavigate, PREVIOUS_LOCATION, store})		

		const formEmployee = screen.getByTestId("form-employee");

		const handleSubmit = jest.fn(login.handleSubmitEmployee);
		login.login = jest.fn().mockRejectedValue(new Error("Error"))
		formEmployee.addEventListener("submit", handleSubmit)
		fireEvent.submit(formEmployee);

		expect(handleSubmit).toHaveBeenCalled();
		expect(login.login).toHaveBeenCalled();
		expect(login.login).toReturn();
/*
		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			"user",
			JSON.stringify({
				type: "Employee",
				email: inputData.email,
				password: inputData.password,
				status: "connected",
			})
		);
*/

	})	
})

describe("When an error occurs when login as an Admin", () => {
	test("Then a new user should have been created", async () => {
		document.body.innerHTML = LoginUI();

		const inputData = {
			email: "ErrorAdmin@email.com",
			password: "azerty",
		};

		const inputEmailUser = screen.getByTestId("employee-email-input");
		fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
		expect(inputEmailUser.value).toBe(inputData.email);

		const inputPasswordUser = screen.getByTestId("employee-password-input");
		fireEvent.change(inputPasswordUser, {
			target: { value: inputData.password },
		});
		expect(inputPasswordUser.value).toBe(inputData.password);

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

		const store = null;
		const PREVIOUS_LOCATION = "";

		const login = new Login({document, localStorage: window.localStorage, onNavigate, PREVIOUS_LOCATION, store})		

		const formAdmin = screen.getByTestId("form-admin");

		const handleSubmitAdmin = jest.fn(login.handleSubmitAdmin);
		login.login = jest.fn().mockRejectedValue(new Error("Error"))
		formAdmin.addEventListener("submit", handleSubmitAdmin)
		fireEvent.submit(formAdmin);

		expect(handleSubmitAdmin).toHaveBeenCalled();
		expect(login.login).toHaveBeenCalled();
		expect(login.login).toReturn();
/*
		expect(window.localStorage.setItem).toHaveBeenCalledWith(
			"user",
			JSON.stringify({
				type: "Admin",
				email: inputData.email,
				password: inputData.password,
				status: "connected",
			})
		);
*/
	})	
  })
 
});
