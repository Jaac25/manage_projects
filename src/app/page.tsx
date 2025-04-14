import LoginForm from "./components/loginForm";

function Fallback({ error }: { error: { message: string } }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export default function Home() {

  return (
    <main className="flex flex-col w-full h-full justify-center items-center">
      <LoginForm />
    </main>
  );
}
