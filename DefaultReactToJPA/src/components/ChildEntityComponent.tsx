import { addChildEntity, deleteChildEntity, editChildEntity, getAllParentEntities } from "../service/apiFacade";
import { ChildEntity } from "../service/apiFacade";
import { useEffect, useState } from "react";

interface ChildEntityProps {
  parentId: number;
}

export default function ChildEntityComponent({ parentId }: ChildEntityProps) {
  const [childEntities, setChildEntities] = useState<ChildEntity[]>([]);
  const [newChildName, setNewChildName] = useState<string>("");
  const [editChildName, setEditChildName] = useState<string>("");
  const [editChildId, setEditChildId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const parents = await getAllParentEntities();
      const parent = parents.find((p) => p.id === parentId);
      if (parent) {
        setChildEntities(parent.childEntities ? parent.childEntities.sort((a, b) => a.id - b.id) : []);
      }
    }
    fetchData();
  }, [parentId]);

  const handleAddChild = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newChildName.trim() === "") {
      alert("Child name cannot be empty");
      return;
    }
    const newChild = await addChildEntity(parentId, newChildName);
    setChildEntities([...childEntities, newChild].sort((a, b) => a.id - b.id));
    setNewChildName(""); // Clear the input field
  };

  const handleDeleteChild = async (childId: number) => {
    await deleteChildEntity(parentId, childId);
    setChildEntities(childEntities.filter((child) => child.id !== childId));
  };

  const handleEditChild = async (child: ChildEntity) => {
    if (editChildId === child.id) {
      // Save the changes
      if (editChildName.trim() === "") {
        alert("Child name cannot be empty");
        return;
      }
      const updatedChild = await editChildEntity(parentId, editChildId, editChildName);
      setChildEntities(childEntities.map((c) => (c.id === editChildId ? updatedChild : c)).sort((a, b) => a.id - b.id));
      setEditChildId(null);
      setEditChildName("");
    } else {
      // Enable edit mode
      setEditChildName(child.name);
      setEditChildId(child.id);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold">Child Entities for Parent {parentId}</h2>
      <ul>
        {childEntities.map((child) => (
          <li key={child.id} className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2 flex-grow">
              {editChildId === child.id ? (
                <input type="text" value={editChildName} onChange={(e) => setEditChildName(e.target.value)} className="border rounded px-2 py-1 bg-gray-800 text-white flex-grow" />
              ) : (
                <span>
                  {child.id} {child.name}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEditChild(child)} className="bg-blue-500 text-white px-2 py-1 rounded">
                {editChildId === child.id ? "Save" : "Edit"}
              </button>
              <button onClick={() => handleDeleteChild(child.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
        <li className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2 flex-grow">
            <input
              type="text"
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              placeholder="New Child Name"
              className="border rounded px-2 py-1 bg-gray-800 text-white"
              style={{ width: "200px" }} // Smaller width for the input field
            />
          </div>
          <button onClick={handleAddChild} className="bg-green-500 text-white px-2 py-1 rounded">
            Add Child
          </button>
        </li>
      </ul>
    </div>
  );
}
