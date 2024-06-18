const endpoint = "http://localhost:1337";

interface Entity1 {
  id: number;
  name: string;
}

async function getAllEntity1() {
  const res = await fetch(endpoint + "/entity1");
  return res.json() as Promise<Entity1[]>; // Type assertion
}

async function addEntity1(name: string) {
  const res = await fetch(endpoint + "/entity1", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<Entity1>; // Type assertion
}

async function deleteEntity1(id: number) {
  await fetch(`${endpoint}/entity1/${id}`, {
    method: "DELETE",
  });
}

async function editEntity1(id: number, name: string) {
  const res = await fetch(`${endpoint}/entity1/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<Entity1>;
}

export { getAllEntity1, addEntity1, deleteEntity1, editEntity1 };
export type { Entity1 };
