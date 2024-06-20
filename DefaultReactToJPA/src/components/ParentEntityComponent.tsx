import { getAllParentEntities, addParentEntity, deleteParentEntity, editParentEntity } from "../service/apiFacade";
import { ParentEntity } from "../service/apiFacade";
import { useEffect, useState } from "react";
import ChildEntityComponent from "./ChildEntityComponent";

export default function ParentEntityComponent() {
  const [parentEntities, setParentEntities] = useState<ParentEntity[]>([]);
  const [name, setName] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    getAllParentEntities().then((data) => {
      console.log(data);
      setParentEntities(data);
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() === "") {
      alert("Name cannot be empty");
      return;
    }
    if (editId !== null) {
      const updatedParentEntity = await editParentEntity(editId, name);
      setParentEntities(parentEntities.map((entity) => (entity.id === editId ? updatedParentEntity : entity)));
      setEditId(null);
    } else {
      const newParentEntity = await addParentEntity(name);
      setParentEntities([...parentEntities, newParentEntity]);
    }
    setName(""); // Clear the input field
  };

  const handleDelete = async (id: number) => {
    await deleteParentEntity(id);
    setParentEntities(parentEntities.filter((entity) => entity.id !== id));
  };

  const handleEdit = (entity: ParentEntity) => {
    setName(entity.name);
    setEditId(entity.id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold">Parents</h1>
        {parentEntities.map((entity) => (
          <div key={entity.id}>
            <p className="flex justify-between items-center mb-2">
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
            </p>
            <ChildEntityComponent parentId={entity.id} />
          </div>
        ))}
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
