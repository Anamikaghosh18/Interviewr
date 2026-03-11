import { SignIn, SignInButton, SignOutButton, UserButton } from "@clerk/react";

function App() {
  return (
    <>
      <h1>Welcome to the App</h1>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Get Started</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </>
  );
}

export default App;
