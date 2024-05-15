import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it('renders the welcome message, description, and "Register Now" button', () => {
    // Render the Home component
    render(<Home />);

    // Check if the welcome message is rendered
    const welcomeMessage = screen.getByText(/Welcome to Evergreen Trust Bank/i);
    expect(welcomeMessage).toBeInTheDocument();

    // Check if the description is rendered
    const description = screen.getByText(
      /Experience financial excellence with our trusted guidance and seamless banking solutions./i
    );
    expect(description).toBeInTheDocument();

    // Check if the "Register Now" button is rendered
    const registerButton = screen.getByRole("button", {
      name: /Register Now/i,
    });
    expect(registerButton).toBeInTheDocument();
  });

  it('does not render a "Log In" button', () => {
    // Render the Home component
    render(<Home />);

    // Attempt to find the "Log In" button
    const logInButton = screen.queryByText("Log In");

    // Expect that the "Log In" button does not exist
    expect(logInButton).not.toBeInTheDocument();
  });
});
