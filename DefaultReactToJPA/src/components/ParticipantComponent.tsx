import { getAllParticipants, addParticipant, deleteParticipant, editParticipant, Participant, Discipline, getAllDisciplines } from "../service/apiFacade";
import { useEffect, useState } from "react";

export default function ParticipantComponent() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [club, setClub] = useState<string>("");
  const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>([]);
  const [showNewDisciplineOptions, setShowNewDisciplineOptions] = useState<boolean>(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [editingParticipantDisciplines, setEditingParticipantDisciplines] = useState<Discipline[]>([]);
  const [showDisciplineOptions, setShowDisciplineOptions] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // State to track active filter
  const [sortBy, setSortBy] = useState<string>("id"); // State to track sorting criteria
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // State to track sorting order

  useEffect(() => {
    fetchParticipantsAndDisciplines();
  }, []);

  const fetchParticipantsAndDisciplines = async () => {
    const participants = await getAllParticipants();
    const disciplines = await getAllDisciplines();
    setParticipants(participants);
    setDisciplines(disciplines);
    setFilteredParticipants(participants); // Initialize filteredParticipants with all participants
  };

  const handleFilterByAgeGroup = (minAge: number, maxAge: number, label: string) => {
    const today = new Date();
    const minDateOfBirth = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    const maxDateOfBirth = new Date(today.getFullYear() - minAge - 1, today.getMonth(), today.getDate());

    const filtered = participants.filter((participant) => {
      const participantDateOfBirth = new Date(participant.dateOfBirth);
      return participantDateOfBirth >= minDateOfBirth && participantDateOfBirth <= maxDateOfBirth;
    });

    setFilteredParticipants(filtered); // Update filteredParticipants state with age-filtered participants
    setActiveFilter(label); // Set active filter label
  };

  const handleClearFilter = () => {
    setFilteredParticipants(participants); // Reset filteredParticipants to include all participants
    setActiveFilter(null); // Clear active filter label
  };

  const handleSortBy = (criteria: string) => {
    if (criteria === sortBy) {
      // Toggle sorting order if the same criteria is clicked again
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sorting criteria and default to ascending order
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() === "" || dateOfBirth === "" || club.trim() === "") {
      alert("All fields must be filled");
      return;
    }
    const participantData = { name, gender, dateOfBirth, club, disciplines: selectedDisciplines, results: [] };
    const newParticipant = await addParticipant(participantData);
    setParticipants([...participants, newParticipant]);
    setFilteredParticipants([...participants, newParticipant]); // Also add to filteredParticipants
    setName("");
    setGender("Male");
    setDateOfBirth("");
    setClub("");
    setSelectedDisciplines([]);
    setShowNewDisciplineOptions(false);
  };

  const handleDelete = async (id: number) => {
    await deleteParticipant(id);
    const updatedParticipants = participants.filter((participant) => participant.id !== id);
    setParticipants(updatedParticipants);
    setFilteredParticipants(updatedParticipants); // Update filteredParticipants when deleting
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setName(participant.name);
    setGender(participant.gender);
    setDateOfBirth(participant.dateOfBirth);
    setClub(participant.club);
    setEditingParticipantDisciplines(participant.disciplines);
    setShowDisciplineOptions(false);
  };

  const handleSave = async () => {
    if (editingParticipant) {
      const formattedDisciplines = editingParticipantDisciplines.map((discipline) => ({
        id: discipline.id,
        name: discipline.name,
        resultType: discipline.resultType,
        sortingDirection: discipline.sortingDirection,
        participants: [],
        results: [],
      }));

      const participantData: Participant = {
        id: editingParticipant.id,
        name,
        gender,
        dateOfBirth,
        club,
        disciplines: formattedDisciplines,
        results: editingParticipant.results,
      };

      try {
        const updatedParticipant = await editParticipant(editingParticipant.id, participantData);
        // Update the participants list with the updated data
        setParticipants((prevParticipants) => prevParticipants.map((p) => (p.id === updatedParticipant.id ? updatedParticipant : p)));
        setFilteredParticipants((prevParticipants) => prevParticipants.map((p) => (p.id === updatedParticipant.id ? updatedParticipant : p)));

        // Reset the form and editing state
        setEditingParticipant(null);
        setName("");
        setGender("Male");
        setDateOfBirth("");
        setClub("");
        setEditingParticipantDisciplines([]);
        setShowDisciplineOptions(false);
      } catch (error) {
        console.error("Failed to update participant:", error);
        // Optionally handle errors, such as displaying a message to the user
      }
    }
  };

  const handleAddDiscipline = (discipline: Discipline, isEditing: boolean) => {
    if (isEditing) {
      setEditingParticipantDisciplines([...editingParticipantDisciplines, discipline]);
      setShowDisciplineOptions(false);
    } else {
      setSelectedDisciplines([...selectedDisciplines, discipline]);
      setShowNewDisciplineOptions(false);
    }
  };

  const handleRemoveDiscipline = (discipline: Discipline, isEditing: boolean) => {
    if (isEditing) {
      const updatedDisciplines = editingParticipantDisciplines.filter((d) => d.id !== discipline.id);
      setEditingParticipantDisciplines(updatedDisciplines);
    } else {
      const updatedDisciplines = selectedDisciplines.filter((d) => d.id !== discipline.id);
      setSelectedDisciplines(updatedDisciplines);
    }
  };

  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    const aValue = a[sortBy as keyof Participant];
    const bValue = b[sortBy as keyof Participant];

    if (sortBy === "dateOfBirth") {
      // For date sorting, convert strings to Date objects for comparison
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    } else if (typeof aValue === "string") {
      // Case insensitive string comparison
      return sortOrder === "asc" ? (aValue as string).localeCompare(bValue as string) : (bValue as string).localeCompare(aValue as string);
    } else {
      // Numeric comparison
      return sortOrder === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Participants</h1>
        <div className="mb-4 flex space-x-2 items-center">
          <input type="text" placeholder="Search by Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white" />
          <button onClick={() => handleFilterByAgeGroup(6, 9, "Age 6-9")} className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${activeFilter === "Age 6-9" ? "bg-blue-700" : ""}`}>
            Children (6-9)
          </button>
          <button onClick={() => handleFilterByAgeGroup(10, 13, "Age 10-13")} className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${activeFilter === "Age 10-13" ? "bg-blue-700" : ""}`}>
            Young (10-13)
          </button>
          <button onClick={() => handleFilterByAgeGroup(14, 22, "Age 14-22")} className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${activeFilter === "Age 14-22" ? "bg-blue-700" : ""}`}>
            Junior (14-22)
          </button>
          <button onClick={() => handleFilterByAgeGroup(23, 40, "Age 23-40")} className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${activeFilter === "Age 23-40" ? "bg-blue-700" : ""}`}>
            Adult (23-40)
          </button>
          <button onClick={() => handleFilterByAgeGroup(41, 999, "Age 41+")} className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${activeFilter === "Age 41+" ? "bg-blue-700" : ""}`}>
            Senior (41+)
          </button>
          <button onClick={handleClearFilter} className="bg-blue-500 text-white px-4 py-2 rounded">
            Clear Filter
          </button>
        </div>
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 cursor-pointer" onClick={() => handleSortBy("name")}>
                Name
              </th>
              <th className="text-left py-2 px-4 cursor-pointer" onClick={() => handleSortBy("gender")}>
                Gender
              </th>
              <th className="text-left py-2 px-4 cursor-pointer" onClick={() => handleSortBy("dateOfBirth")}>
                Date of Birth
              </th>
              <th className="text-left py-2 px-4 cursor-pointer" onClick={() => handleSortBy("club")}>
                Club
              </th>
              <th className="text-left py-2 px-4 cursor-pointer" onClick={() => handleSortBy("disciplines")}>
                Disciplines
              </th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedParticipants
              .filter((participant) => participant.name.toLowerCase().includes(searchName.toLowerCase()))
              .map((participant) => (
                <tr key={participant.id}>
                  <td className="border px-4 py-2">
                    {editingParticipant?.id === participant.id ? (
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                    ) : (
                      participant.name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingParticipant?.id === participant.id ? (
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      participant.gender
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingParticipant?.id === participant.id ? (
                      <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                    ) : (
                      new Date(participant.dateOfBirth).toLocaleDateString()
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingParticipant?.id === participant.id ? (
                      <input type="text" value={club} onChange={(e) => setClub(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                    ) : (
                      participant.club
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingParticipant?.id === participant.id ? (
                      <>
                        {editingParticipantDisciplines.map((discipline) => (
                          <button key={discipline.id} className="bg-red-500 text-white px-2 py-1 rounded mr-1" onClick={() => handleRemoveDiscipline(discipline, true)}>
                            {discipline.name} X
                          </button>
                        ))}
                        <div className="relative inline-block">
                          <button onClick={() => setShowDisciplineOptions(!showDisciplineOptions)} className="bg-green-500 text-white px-2 py-1 rounded">
                            +
                          </button>
                          {showDisciplineOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                              {disciplines
                                .filter((d) => !editingParticipantDisciplines.some((sd) => sd.id === d.id))
                                .map((discipline) => (
                                  <div key={discipline.id} className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleAddDiscipline(discipline, true)}>
                                    {discipline.name}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      participant.disciplines.map((discipline) => (
                        <span key={discipline.id} className="bg-gray-700 text-white px-2 py-1 rounded mr-1">
                          {discipline.name}
                        </span>
                      ))
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex space-x-2">
                      {editingParticipant?.id === participant.id ? (
                        <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">
                          Save
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(participant)} className="bg-blue-500 text-white px-2 py-1 rounded">
                          Edit
                        </button>
                      )}
                      <button onClick={() => handleDelete(participant.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            <tr>
              <td className="border px-4 py-2">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
              </td>
              <td className="border px-4 py-2">
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
              </td>
              <td className="border px-4 py-2">
                <input type="text" value={club} onChange={(e) => setClub(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
              </td>
              <td className="border px-4 py-2 w-1/4">
                {selectedDisciplines.map((discipline) => (
                  <button key={discipline.id} className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleRemoveDiscipline(discipline, false)}>
                    {discipline.name} X
                  </button>
                ))}
                <div className="relative inline-block">
                  <button onClick={() => setShowNewDisciplineOptions(!showNewDisciplineOptions)} className="bg-green-500 text-white px-2 py-1 rounded">
                    +
                  </button>
                  {showNewDisciplineOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                      {disciplines
                        .filter((d) => !selectedDisciplines.some((sd) => sd.id === d.id))
                        .map((discipline) => (
                          <div key={discipline.id} className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleAddDiscipline(discipline, false)}>
                            {discipline.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </td>
              <td className="border px-4 py-2">
                <button onClick={handleSubmit} className="bg-green-500 text-white px-2 py-1 rounded">
                  Submit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
