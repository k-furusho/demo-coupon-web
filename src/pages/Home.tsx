import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { member } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold">Demo Coupon Web</h1>
      {member && <p className="mt-2">こんにちは、<span className="font-semibold">{member.name}</span> さん！</p>}
      <p>ようこそ！メニューから操作を選択してください。</p>
    </div>
  );
};

export default Home; 