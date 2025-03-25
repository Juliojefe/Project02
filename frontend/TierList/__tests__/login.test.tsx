// // __tests__/LoginPage.test.tsx
//
// import React from "react";
// import { render, fireEvent } from "@testing-library/react-native";
// import LoginPage from "../app/login";
//
// describe("LoginPage", () => {
//   it("renders the login page correctly", () => {
//     const { getByText, getByPlaceholderText } = render(<LoginPage />);
//
//     expect(getByText("Welcome Back!")).toBeTruthy();
//     expect(getByText("Username")).toBeTruthy();
//     expect(getByText("Password")).toBeTruthy();
//     expect(getByPlaceholderText("Enter your username")).toBeTruthy();
//     expect(getByPlaceholderText("Enter your password")).toBeTruthy();
//     expect(getByText("Login")).toBeTruthy();
//   });
//
//   it("updates username and password fields correctly", () => {
//     const { getByPlaceholderText } = render(<LoginPage />);
//
//     const usernameInput = getByPlaceholderText("Enter your username");
//     const passwordInput = getByPlaceholderText("Enter your password");
//
//     fireEvent.changeText(usernameInput, "testuser");
//     fireEvent.changeText(passwordInput, "password123");
//
//     expect(usernameInput.props.value).toBe("testuser");
//     expect(passwordInput.props.value).toBe("password123");
//   });
//
//   it("calls handleLogin when login button is pressed", () => {
//     const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
//
//     const { getByText, getByPlaceholderText } = render(<LoginPage />);
//
//     const usernameInput = getByPlaceholderText("Enter your username");
//     const passwordInput = getByPlaceholderText("Enter your password");
//     const loginButton = getByText("Login");
//
//     fireEvent.changeText(usernameInput, "testuser");
//     fireEvent.changeText(passwordInput, "password123");
//     fireEvent.press(loginButton);
//
//     expect(consoleSpy).toHaveBeenCalledWith("Login pressed", {
//       username: "testuser",
//       password: "password123",
//     });
//
//     consoleSpy.mockRestore();
//   });
// });
