import { getAllEntity1, addEntity1, deleteEntity1, editEntity1 } from "../service/apiFacade";
import { Entity1 } from "../service/apiFacade";
import NavHeader from "../components/NavHeader";
import { useEffect, useState } from "react";

export default function Entity1Page() {
  const [entity1, setEntity1] = useState<Entity1[]>([]);
  const [name, setName] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    getAllEntity1().then((data) => {
      console.log(data);
      setEntity1(data);
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() === "") {
      alert("Name cannot be empty");
      return;
    }
    if (editId !== null) {
      const updatedEntity1 = await editEntity1(editId, name);
      setEntity1(entity1.map((entity) => (entity.id === editId ? updatedEntity1 : entity)));
      setEditId(null);
    } else {
      const newEntity1 = await addEntity1(name);
      setEntity1([...entity1, newEntity1]);
    }
    setName(""); // Clear the input field
  };

  const handleDelete = async (id: number) => {
    await deleteEntity1(id);
    setEntity1(entity1.filter((entity) => entity.id !== id));
  };

  const handleEdit = (entity: Entity1) => {
    setName(entity.name);
    setEditId(entity.id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavHeader />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold">Entity1</h1>
        <ul>
          {entity1.map((entity) => (
            <li key={entity.id} className="flex justify-between items-center mb-2">
              <span>
                {entity.id} {entity.name}
              </span>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(entity)} className="bg-blue-500 text-white px-2 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(entity.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block mb-2">Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-2 py-1 mb-2 bg-gray-800 text-white" />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            {editId !== null ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
