import NavHeader from "../components/NavHeader";

export default function Home() {
  return (
    <>
      <NavHeader />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="mt-4 text-lg">Welcome Home</p>
      </div>
    </>
  );
}
