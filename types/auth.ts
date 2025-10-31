export interface User {
  email: string;
}

export interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
