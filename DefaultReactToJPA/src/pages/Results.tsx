import ResultComponent from "../components/ResultComponent";
import NavHeader from "../components/NavHeader";

export default function Results() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <NavHeader />
        <ResultComponent />
      </div>
    </div>
  );
}
