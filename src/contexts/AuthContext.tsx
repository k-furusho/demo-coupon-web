import React, { createContext, useContext, useEffect, useState } from 'react';
import { Member } from '../types';
import { memberDB } from '../stores/MemberStore';
import { apiPost } from '../lib/api';

interface AuthContextValue {
  member: Member | null;
  login: (memberId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => m && setMember(m));
  }, []);

  const login = async (memberId: string): Promise<void> => {
    const m: Member = await apiPost('/api/auth/login', { memberId });
    setMember(m);
  };
  const logout = () => {
    setMember(null);
    document.cookie='memberId=; Max-Age=0; path=/;';
  };

  return <AuthContext.Provider value={{ member, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not found');
  return ctx;
}; 