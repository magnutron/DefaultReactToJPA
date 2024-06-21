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

  useEffect(() => {
    const initializeData = async () => {
      await fetchParticipants();
      const fetchedDisciplines = await fetchDisciplines();
      const fetchedResults = await fetchResults();

      if (fetchedDisciplines.length > 0) {
        const firstDisciplineId = fetchedDisciplines[0].id;
        setSelectedDiscipline(firstDisciplineId);
        filterResultsByDiscipline(fetchedResults, firstDisciplineId, fetchedDisciplines[0].sortingDirection);
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
      filterResultsByDiscipline(updatedResults, selectedDiscipline!);
    } else {
      const newResult = await addResult(resultData);
      const updatedResults = [...results, newResult];
      setResults(updatedResults);
      filterResultsByDiscipline(updatedResults, selectedDiscipline!);
    }

    setSelectedParticipant(null);
    setSelectedDiscipline(null);
    setResultValue("");
    setDate("");
    setEditingResult(null);
  };

  const handleDelete = async (id: number) => {
    await deleteResult(id);
    const updatedResults = results.filter((result) => result.id !== id);
    setResults(updatedResults);
    filterResultsByDiscipline(updatedResults, selectedDiscipline!);
  };

  const handleEdit = (result: Result) => {
    setSelectedParticipant(result.participant.id);
    setSelectedDiscipline(result.discipline.id);
    setResultValue(result.resultValue);
    setDate(result.date);
    setEditingResult(result);
  };

  const filterResultsByDiscipline = (allResults: Result[], disciplineId: number, sortingDirection: string) => {
    let filtered = allResults.filter((result) => result.discipline.id === disciplineId);
    filtered = filtered.sort((a, b) => {
      if (sortingDirection === "ASCENDING") {
        return parseFloat(a.resultValue) - parseFloat(b.resultValue);
      } else {
        return parseFloat(b.resultValue) - parseFloat(a.resultValue);
      }
    });
    setFilteredResults(filtered);
  };

  const handleDisciplineClick = (disciplineId: number) => {
    const selectedDiscipline = disciplines.find((d) => d.id === disciplineId);
    setSelectedDiscipline(disciplineId);
    filterResultsByDiscipline(results, disciplineId, selectedDiscipline?.sortingDirection || "DESCENDING");
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
              </tr>
            ))}
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
                  {editingResult ? "Save Result" : "Add Result"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
