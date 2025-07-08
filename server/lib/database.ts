// Simple in-memory database for demo purposes
// In production, replace with PostgreSQL/MongoDB with proper ORM

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  plan: "free" | "creator" | "pro";
  credits: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Generation {
  id: string;
  userId: string;
  type: "image" | "video";
  prompt: string;
  model: string;
  url: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  liked?: boolean;
  cost: number;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// In-memory storage (replace with real database)
const users: Map<string, User> = new Map();
const generations: Map<string, Generation> = new Map();
const sessions: Map<string, UserSession> = new Map();

// User operations
export const createUser = (
  userData: Omit<User, "id" | "createdAt" | "updatedAt">,
): User => {
  const user: User = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.set(user.id, user);
  return user;
};

export const findUserByEmail = (email: string): User | undefined => {
  return Array.from(users.values()).find((user) => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.get(id);
};

export const updateUser = (
  id: string,
  updates: Partial<User>,
): User | undefined => {
  const user = users.get(id);
  if (!user) return undefined;

  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  users.set(id, updatedUser);
  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  return users.delete(id);
};

// Generation operations
export const createGeneration = (
  generationData: Omit<Generation, "id" | "createdAt" | "updatedAt">,
): Generation => {
  const generation: Generation = {
    ...generationData,
    id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  generations.set(generation.id, generation);
  return generation;
};

export const findGenerationsByUserId = (userId: string): Generation[] => {
  return Array.from(generations.values())
    .filter((gen) => gen.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const findGenerationById = (id: string): Generation | undefined => {
  return generations.get(id);
};

export const updateGeneration = (
  id: string,
  updates: Partial<Generation>,
): Generation | undefined => {
  const generation = generations.get(id);
  if (!generation) return undefined;

  const updatedGeneration = {
    ...generation,
    ...updates,
    updatedAt: new Date(),
  };
  generations.set(id, updatedGeneration);
  return updatedGeneration;
};

// Session operations
export const createSession = (userId: string, token: string): UserSession => {
  const session: UserSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    token,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    createdAt: new Date(),
  };
  sessions.set(session.id, session);
  return session;
};

export const findSessionByToken = (token: string): UserSession | undefined => {
  return Array.from(sessions.values()).find(
    (session) => session.token === token && session.expiresAt > new Date(),
  );
};

export const deleteSession = (token: string): boolean => {
  const session = Array.from(sessions.values()).find((s) => s.token === token);
  if (session) {
    sessions.delete(session.id);
    return true;
  }
  return false;
};

// Initialize with some demo data
export const initializeDatabase = () => {
  console.log(
    "Database initialized. Use /api/auth/create-demo to create demo user.",
  );
};

// Initialize the database with demo data
initializeDatabase();
