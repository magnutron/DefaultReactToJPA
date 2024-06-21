import { useEffect, useState } from "react";
import { getAllResults, addResult, deleteResult, editResult, getAllParticipants, getAllDisciplines, Result, Participant, Discipline } from "../service/apiFacade";

export default function ResultComponent() {
  const [results, setResults] = useState<Result[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<number | null>(null);
  const [resultValue, setResultValue] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const [genderFilter, setGenderFilter] = useState<string>("F/M");
  const [ageGroupFilter, setAgeGroupFilter] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      await fetchParticipants();
      const fetchedDisciplines = await fetchDisciplines();
      const fetchedResults = await fetchResults();

      if (fetchedDisciplines.length > 0) {
        const firstDisciplineId = fetchedDisciplines[0].id;
        setSelectedDiscipline(firstDisciplineId);
        filterResults(fetchedResults, firstDisciplineId, "F/M", null);
      }
    };
    initializeData();
  }, []);

  const fetchResults = async () => {
    const fetchedResults = await getAllResults();
    setResults(fetchedResults);
    return fetchedResults;
  };

  const fetchParticipants = async () => {
    const fetchedParticipants = await getAllParticipants();
    setParticipants(fetchedParticipants);
  };

  const fetchDisciplines = async () => {
    const fetchedDisciplines = await getAllDisciplines();
    setDisciplines(fetchedDisciplines);
    return fetchedDisciplines;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedParticipant || !selectedDiscipline || resultValue.trim() === "" || date.trim() === "") {
      alert("All fields must be filled");
      return;
    }

    const resultData = {
      participant: participants.find((p) => p.id === selectedParticipant)!,
      discipline: disciplines.find((d) => d.id === selectedDiscipline)!,
      resultValue,
      date,
    };

    if (editingResult) {
      const updatedResult = await editResult(editingResult.id, resultData);
      const updatedResults = results.map((r) => (r.id === updatedResult.id ? updatedResult : r));
      setResults(updatedResults);
      filterResults(updatedResults, selectedDiscipline!, genderFilter, ageGroupFilter);
      setEditingResult(null); // Clear editing state
    } else {
      await addResult(resultData);
      const updatedResults = await fetchResults(); // Refetch results to ensure consistency
      setResults(updatedResults);
      filterResults(updatedResults, selectedDiscipline!, genderFilter, ageGroupFilter);
    }

    setSelectedParticipant(null);
    setSelectedDiscipline(selectedDiscipline); // Ensure the selected discipline is preserved
    setResultValue("");
    setDate("");
  };

  const handleDelete = async (id: number) => {
    await deleteResult(id);
    const updatedResults = await fetchResults(); // Refetch results to ensure consistency
    setResults(updatedResults);
    filterResults(updatedResults, selectedDiscipline!, genderFilter, ageGroupFilter);
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setSelectedParticipant(result.participant.id);
    setSelectedDiscipline(result.discipline.id);
    setResultValue(result.resultValue);
    setDate(result.date);
  };

  const calculateAgeAtResult = (dateOfBirth: string, resultDate: string) => {
    const birthDate = new Date(dateOfBirth);
    const resultDateObj = new Date(resultDate);
    let age = resultDateObj.getFullYear() - birthDate.getFullYear();
    const monthDifference = resultDateObj.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && resultDateObj.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filterResults = (allResults: Result[], disciplineId: number, gender: string, ageGroup: string | null) => {
    let filtered = allResults.filter((result) => result.discipline.id === disciplineId);

    if (gender !== "F/M") {
      filtered = filtered.filter((result) => result.participant.gender === (gender === "M" ? "Male" : "Female"));
    }

    if (ageGroup) {
      filtered = filtered.filter((result) => {
        const age = calculateAgeAtResult(result.participant.dateOfBirth, result.date);
        if (ageGroup === "Children") return age >= 6 && age <= 9;
        if (ageGroup === "Young") return age >= 10 && age <= 13;
        if (ageGroup === "Junior") return age >= 14 && age <= 22;
        if (ageGroup === "Adult") return age >= 23 && age <= 40;
        if (ageGroup === "Senior") return age >= 41;
        return false;
      });
    }

    const discipline = disciplines.find((d) => d.id === disciplineId);
    if (discipline) {
      filtered = filtered.sort((a, b) => {
        if (discipline.sortingDirection === "ASCENDING") {
          return parseFloat(a.resultValue) - parseFloat(b.resultValue);
        } else {
          return parseFloat(b.resultValue) - parseFloat(a.resultValue);
        }
      });
    }
    setFilteredResults(filtered);
  };

  const handleDisciplineClick = (disciplineId: number) => {
    setSelectedDiscipline(disciplineId);
    filterResults(results, disciplineId, genderFilter, ageGroupFilter);
  };

  const handleGenderFilterClick = (gender: string) => {
    setGenderFilter(gender);
    filterResults(results, selectedDiscipline!, gender, ageGroupFilter);
  };

  const handleAgeGroupFilterClick = (ageGroup: string | null) => {
    setAgeGroupFilter(ageGroup);
    filterResults(results, selectedDiscipline!, genderFilter, ageGroup);
  };

  const getSelectedParticipantGender = () => {
    const participant = participants.find((p) => p.id === selectedParticipant);
    return participant ? participant.gender : "";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Results</h1>
        <div className="flex flex-wrap mb-4">
          {disciplines.map((discipline) => (
            <button
              key={discipline.id}
              onClick={() => handleDisciplineClick(discipline.id)}
              className={`font-bold py-2 px-4 rounded mr-2 ${selectedDiscipline === discipline.id ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
            >
              {discipline.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap mb-4">
          <button onClick={() => handleGenderFilterClick("F/M")} className={`font-bold py-2 px-4 rounded mr-2 ${genderFilter === "F/M" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            F/M
          </button>
          <button onClick={() => handleGenderFilterClick("M")} className={`font-bold py-2 px-4 rounded mr-2 ${genderFilter === "M" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            M
          </button>
          <button onClick={() => handleGenderFilterClick("F")} className={`font-bold py-2 px-4 rounded mr-2 ${genderFilter === "F" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            F
          </button>
        </div>
        <div className="flex flex-wrap mb-4">
          <button onClick={() => handleAgeGroupFilterClick(null)} className={`font-bold py-2 px-4 rounded mr-2 ${ageGroupFilter === null ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            All
          </button>
          <button onClick={() => handleAgeGroupFilterClick("Children")} className={`font-bold py-2 px-4 rounded mr-2 ${ageGroupFilter === "Children" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            Children (6-9)
          </button>
          <button onClick={() => handleAgeGroupFilterClick("Young")} className={`font-bold py-2 px-4 rounded mr-2 ${ageGroupFilter === "Young" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            Young (10-13)
          </button>
          <button onClick={() => handleAgeGroupFilterClick("Junior")} className={`font-bold py-2 px-4 rounded mr-2 ${ageGroupFilter === "Junior" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            Junior (14-22)
          </button>
          <button onClick={() => handleAgeGroupFilterClick("Adult")} className={`font-bold py-2 px-4 rounded mr-2 ${ageGroupFilter === "Adult" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            Adult (23-40)
          </button>
          <button onClick={() => handleAgeGroupFilterClick("Senior")} className={`font-bold py-2 px-4 rounded mr-2 ${ageGroupFilter === "Senior" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700 text-white"}`}>
            Senior (41+)
          </button>
        </div>
        <table className="min-w-full bg-gray-800 text-white mb-4">
          <thead>
            <tr>
              <th className="text-left py-2 px-4">Gender</th>
              <th className="text-left py-2 px-4">Participant</th>
              <th className="text-left py-2 px-4">Discipline</th>
              <th className="text-left py-2 px-4">Result</th>
              <th className="text-left py-2 px-4">Result Type</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result) => (
              <tr key={result.id}>
                {editingResult && editingResult.id === result.id ? (
                  <>
                    <td className="border px-4 py-2">
                      <input type="text" value={getSelectedParticipantGender()} disabled className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                    </td>
                    <td className="border px-4 py-2">
                      <select value={selectedParticipant ?? ""} onChange={(e) => setSelectedParticipant(Number(e.target.value))} className="border rounded px-2 py-1 bg-gray-800 text-white w-full">
                        <option value="" disabled>
                          Select Participant
                        </option>
                        {participants.map((participant) => (
                          <option key={participant.id} value={participant.id}>
                            {participant.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <select value={selectedDiscipline ?? ""} onChange={(e) => setSelectedDiscipline(Number(e.target.value))} className="border rounded px-2 py-1 bg-gray-800 text-white w-full">
                        <option value="" disabled>
                          Select Discipline
                        </option>
                        {disciplines.map((discipline) => (
                          <option key={discipline.id} value={discipline.id}>
                            {discipline.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <input type="text" value={resultValue} onChange={(e) => setResultValue(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" placeholder="Result Value" />
                    </td>
                    <td className="border px-4 py-2">
                      <input type="text" value={disciplines.find((d) => d.id === selectedDiscipline)?.resultType ?? ""} disabled className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                    </td>
                    <td className="border px-4 py-2">
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                    </td>
                    <td className="border px-4 py-2">
                      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2">{result.participant.gender}</td>
                    <td className="border px-4 py-2">{result.participant.name}</td>
                    <td className="border px-4 py-2">{result.discipline.name}</td>
                    <td className="border px-4 py-2">{result.resultValue}</td>
                    <td className="border px-4 py-2">{result.discipline.resultType}</td>
                    <td className="border px-4 py-2">{new Date(result.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(result)} className="bg-blue-500 text-white px-2 py-1 rounded">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(result.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {!editingResult && (
              <tr>
                <td className="border px-4 py-2">
                  <input type="text" value={getSelectedParticipantGender()} disabled className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                </td>
                <td className="border px-4 py-2">
                  <select value={selectedParticipant ?? ""} onChange={(e) => setSelectedParticipant(Number(e.target.value))} className="border rounded px-2 py-1 bg-gray-800 text-white w-full">
                    <option value="" disabled>
                      Select Participant
                    </option>
                    {participants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <select value={selectedDiscipline ?? ""} onChange={(e) => setSelectedDiscipline(Number(e.target.value))} className="border rounded px-2 py-1 bg-gray-800 text-white w-full">
                    <option value="" disabled>
                      Select Discipline
                    </option>
                    {disciplines.map((discipline) => (
                      <option key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <input type="text" value={resultValue} onChange={(e) => setResultValue(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" placeholder="Result Value" />
                </td>
                <td className="border px-4 py-2">
                  <input type="text" value={disciplines.find((d) => d.id === selectedDiscipline)?.resultType ?? ""} disabled className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                </td>
                <td className="border px-4 py-2">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                </td>
                <td className="border px-4 py-2">
                  <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                    Add Result
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
