const endpoint = "http://localhost:1337";

export interface ParentEntity {
  id: number;
  name: string;
  childEntities: ChildEntity[];
}

export interface ChildEntity {
  id: number;
  name: string;
  parentEntityId: number;
}

export async function getAllParentEntities() {
  const res = await fetch(endpoint + "/parent-entities");
  return res.json() as Promise<ParentEntity[]>;
}

export async function addParentEntity(name: string) {
  const res = await fetch(endpoint + "/parent-entities", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<ParentEntity>;
}

export async function deleteParentEntity(id: number) {
  await fetch(`${endpoint}/parent-entities/${id}`, {
    method: "DELETE",
  });
}

export async function editParentEntity(id: number, name: string) {
  const res = await fetch(`${endpoint}/parent-entities/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<ParentEntity>;
}

export async function addChildEntity(parentId: number, name: string) {
  const res = await fetch(`${endpoint}/child-entities/${parentId}`, {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<ChildEntity>;
}

export async function deleteChildEntity(parentId: number, childId: number) {
  await fetch(`${endpoint}/child-entities/${parentId}/${childId}`, {
    method: "DELETE",
  });
}

export async function editChildEntity(parentId: number, childId: number, name: string) {
  const res = await fetch(`${endpoint}/child-entities/${parentId}/${childId}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<ChildEntity>;
}
