const endpoint = "http://localhost:8080";

// Interfaces
export interface Participant {
  id: number;
  name: string;
  gender: string;
  dateOfBirth: string; // Changed from age to dateOfBirth
  club: string;
  disciplines: Discipline[];
  results: Result[];
}

export interface Discipline {
  id: number;
  name: string;
  resultType: string;
  sortingDirection: string;
  participants: Participant[];
  results: Result[];
}

export interface Result {
  id: number;
  resultValue: string; // Changed from resultType to resultValue
  date: string;
  participant: Participant;
  discipline: Discipline;
}

// Participant API
export async function getAllParticipants() {
  const res = await fetch(endpoint + "/participants");
  return res.json() as Promise<Participant[]>;
}

export async function addParticipant(participant: Omit<Participant, "id" | "disciplines" | "results">, disciplineIds: number[] = [], resultIds: number[] = []) {
  const res = await fetch(endpoint + "/participants", {
    method: "POST",
    body: JSON.stringify({ ...participant, disciplineIds, resultIds }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<Participant>;
}

export async function deleteParticipant(id: number) {
  await fetch(`${endpoint}/participants/${id}`, {
    method: "DELETE",
  });
}

export async function editParticipant(id: number, participant: Participant) {
  const res = await fetch(`${endpoint}/participants/${id}`, {
    method: "PUT",
    body: JSON.stringify(participant),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<Participant>;
}

export const removeDisciplineFromParticipant = async (participantId: number, disciplineId: number): Promise<Participant> => {
  const response = await fetch(`${endpoint}/participants/${participantId}/disciplines/${disciplineId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to remove discipline from participant");
  }
  return response.json();
};

// Discipline API
export async function getAllDisciplines() {
  const res = await fetch(endpoint + "/disciplines");
  return res.json() as Promise<Discipline[]>;
}

export async function addDiscipline(discipline: Omit<Discipline, "id" | "participants" | "results">) {
  const res = await fetch(endpoint + "/disciplines", {
    method: "POST",
    body: JSON.stringify(discipline),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<Discipline>;
}

export async function deleteDiscipline(id: number) {
  await fetch(`${endpoint}/disciplines/${id}`, {
    method: "DELETE",
  });
}

export async function editDiscipline(id: number, discipline: Omit<Discipline, "id" | "participants" | "results">) {
  const res = await fetch(`${endpoint}/disciplines/${id}`, {
    method: "PUT",
    body: JSON.stringify(discipline),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<Discipline>;
}

// Result API
export async function getAllResults(): Promise<Result[]> {
  const response = await fetch(`${endpoint}/results`);
  return response.json();
}

export async function addResult(result: Omit<Result, "id">): Promise<Result> {
  const response = await fetch(`${endpoint}/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });
  return response.json();
}

export async function editResult(id: number, result: Omit<Result, "id">): Promise<Result> {
  const response = await fetch(`${endpoint}/results/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });
  return response.json();
}

export async function deleteResult(id: number): Promise<void> {
  await fetch(`${endpoint}/results/${id}`, {
    method: "DELETE",
  });
}
