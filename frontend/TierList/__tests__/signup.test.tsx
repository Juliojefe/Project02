// import React from "react";
// import { render, fireEvent } from "@testing-library/react-native";
// import SignupPage from "../app/signup";
//
// describe("SignupPage", () => {
//   it("renders the signup page correctly", () => {
//     const { getByText, getByPlaceholderText } = render(<SignupPage />);
//
//     expect(getByText("Greetings, let's get you situated.")).toBeTruthy();
//     expect(getByText("Username")).toBeTruthy();
//     expect(getByText("Password")).toBeTruthy();
//     expect(getByText("Confirm Password")).toBeTruthy();
//     expect(getByPlaceholderText("Enter your username")).toBeTruthy();
//     expect(getByPlaceholderText("Enter your password")).toBeTruthy();
//     expect(getByPlaceholderText("Re-enter your password")).toBeTruthy();
//     expect(getByText("Sign up")).toBeTruthy();
//   });
//
//   it("updates username, password, and confirm password fields correctly", () => {
//     const { getByPlaceholderText } = render(<SignupPage />);
//
//     const usernameInput = getByPlaceholderText("Enter your username");
//     const passwordInput = getByPlaceholderText("Enter your password");
//     const confirmPasswordInput = getByPlaceholderText("Re-enter your password");
//
//     fireEvent.changeText(usernameInput, "testuser");
//     fireEvent.changeText(passwordInput, "password123");
//     fireEvent.changeText(confirmPasswordInput, "password123");
//
//     expect(usernameInput.props.value).toBe("testuser");
//     expect(passwordInput.props.value).toBe("password123");
//     expect(confirmPasswordInput.props.value).toBe("password123");
//   });
//
//   it("calls handleSignup when sign-up button is pressed", () => {
//     const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
//
//     const { getByText, getByPlaceholderText } = render(<SignupPage />);
//
//     const usernameInput = getByPlaceholderText("Enter your username");
//     const passwordInput = getByPlaceholderText("Enter your password");
//     const confirmPasswordInput = getByPlaceholderText("Re-enter your password");
//     const signupButton = getByText("Sign up");
//
//     fireEvent.changeText(usernameInput, "testuser");
//     fireEvent.changeText(passwordInput, "password123");
//     fireEvent.changeText(confirmPasswordInput, "password123");
//     fireEvent.press(signupButton);
//
//     expect(consoleSpy).toHaveBeenCalledWith("Signup pressed", {
//       username: "testuser",
//       password: "password123",
//       confirmPassword: "password123",
//     });
//
//     consoleSpy.mockRestore();
//   });
// });
