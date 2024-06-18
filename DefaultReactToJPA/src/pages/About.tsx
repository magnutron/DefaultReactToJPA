import NavHeader from "../components/NavHeader";

export default function About() {
  return (
    <>
      <NavHeader />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold">About</h1>
        <p className="mt-4 text-lg">This is a simple React application that demonstrates how to connect to a JPA API.</p>
      </div>
    </>
  );
}
