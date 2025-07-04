import React, { createContext, useContext, useEffect, useState } from 'react';
import { Member } from '../types';
import { memberDB } from '../stores/MemberStore';

interface AuthContextValue {
  member: Member | null;
  login: (memberId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('currentMemberId');
    if (storedId) {
      const m = memberDB.get(storedId);
      if (m) setMember(m);
    }
  }, []);

  const login = (memberId: string) => {
    const m = memberDB.get(memberId);
    if (m) {
      setMember(m);
      localStorage.setItem('currentMemberId', memberId);
    }
  };
  const logout = () => {
    setMember(null);
    localStorage.removeItem('currentMemberId');
  };

  return <AuthContext.Provider value={{ member, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not found');
  return ctx;
}; 