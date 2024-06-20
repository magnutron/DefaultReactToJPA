import NavHeader from "../components/NavHeader";
import DisciplineComponent from "../components/DisciplineComponent";

export default function Disciplines() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <NavHeader />
        <DisciplineComponent />
      </div>
    </div>
  );
}
