import { useEffect, useState } from "react";
import { getAllDisciplines, addDiscipline, deleteDiscipline, editDiscipline, Discipline } from "../service/apiFacade";

export default function DisciplineComponent() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [name, setName] = useState<string>("");
  const [resultType, setResultType] = useState<string>("");
  const [sortingDirection, setSortingDirection] = useState<string>("ASCENDING"); // Add this state
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(null);
  const [updateParticipants, setUpdateParticipants] = useState<boolean>(false);

  useEffect(() => {
    fetchDisciplines();
  }, []);

  useEffect(() => {
    if (updateParticipants) {
      setUpdateParticipants(false);
    }
  }, [updateParticipants]);

  const fetchDisciplines = async () => {
    const fetchedDisciplines = await getAllDisciplines();
    setDisciplines(fetchedDisciplines);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() === "" || resultType.trim() === "" || sortingDirection.trim() === "") {
      alert("All fields must be filled");
      return;
    }
    if (editingDiscipline) {
      await saveEditedDiscipline();
    } else {
      const newDiscipline = await addDiscipline({ name, resultType, sortingDirection });
      setDisciplines([...disciplines, newDiscipline]);
      setName("");
      setResultType("");
      setSortingDirection("ASCENDING");
    }
  };

  const saveEditedDiscipline = async () => {
    if (editingDiscipline) {
      const updatedDiscipline = await editDiscipline(editingDiscipline.id, { name, resultType, sortingDirection });
      const updatedDisciplines = disciplines.map((d) => (d.id === updatedDiscipline.id ? updatedDiscipline : d));
      setDisciplines(updatedDisciplines);
      setName("");
      setResultType("");
      setSortingDirection("ASCENDING");
      setEditingDiscipline(null);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteDiscipline(id);
    const updatedDisciplines = disciplines.filter((discipline) => discipline.id !== id);
    setDisciplines(updatedDisciplines);
    setUpdateParticipants(true);
  };

  const handleEdit = (discipline: Discipline) => {
    setName(discipline.name);
    setResultType(discipline.resultType);
    setSortingDirection(discipline.sortingDirection); // Include sortingDirection
    setEditingDiscipline(discipline);
  };

  const cancelEdit = () => {
    setEditingDiscipline(null);
    setName("");
    setResultType("");
    setSortingDirection("ASCENDING");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "resultType") {
      setResultType(value);
    } else if (name === "sortingDirection") {
      setSortingDirection(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Disciplines</h1>
        <table className="min-w-full bg-gray-800 text-white mb-4">
          <thead>
            <tr>
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Result Type</th>
              <th className="text-left py-2 px-4">Sorting Direction</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disciplines.map((discipline) => (
              <tr key={discipline.id}>
                <td className="border px-4 py-2">
                  {editingDiscipline?.id === discipline.id ? (
                    <input type="text" name="name" value={name} onChange={handleInputChange} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                  ) : (
                    discipline.name
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingDiscipline?.id === discipline.id ? (
                    <input type="text" name="resultType" value={resultType} onChange={handleInputChange} className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
                  ) : (
                    discipline.resultType
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingDiscipline?.id === discipline.id ? (
                    <select name="sortingDirection" value={sortingDirection} onChange={handleInputChange} className="border rounded px-2 py-1 bg-gray-800 text-white w-full">
                      <option value="ASCENDING">ASCENDING</option>
                      <option value="DESCENDING">DESCENDING</option>
                    </select>
                  ) : (
                    discipline.sortingDirection
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingDiscipline?.id === discipline.id ? (
                    <div className="flex space-x-2">
                      <button onClick={saveEditedDiscipline} className="bg-green-500 text-white px-2 py-1 rounded">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="bg-gray-500 text-white px-2 py-1 rounded">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(discipline)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(discipline.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2">
                <input type="text" name="name" value={name} onChange={handleInputChange} placeholder="Discipline Name" className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
              </td>
              <td className="border px-4 py-2">
                <input type="text" name="resultType" value={resultType} onChange={handleInputChange} placeholder="Result Type" className="border rounded px-2 py-1 bg-gray-800 text-white w-full" />
              </td>
              <td className="border px-4 py-2">
                <select name="sortingDirection" value={sortingDirection} onChange={handleInputChange} className="border rounded px-2 py-1 bg-gray-800 text-white w-full">
                  <option value="ASCENDING">ASCENDING</option>
                  <option value="DESCENDING">DESCENDING</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <button type="submit" onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                  {editingDiscipline ? "Save Discipline" : "Add Discipline"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
