import ParticipantComponent from "../components/ParticipantComponent";
import NavHeader from "../components/NavHeader";

export default function Participants() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <NavHeader />
        <ParticipantComponent />
      </div>
    </div>
  );
}
