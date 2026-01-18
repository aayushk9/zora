import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../env";
import { useConversationStore } from "../store/useConversationStore";
import { useMessageStore } from "../store/useMessageStore";

type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

   const setConversations = useConversationStore((conversation) => conversation.setConversations)
   const setMessages = useMessageStore((message) => message.setMessages)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include", 
    });
    setConversations([]);
    setMessages([]);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
