import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { memberDB } from '../stores/MemberStore';
import { Member } from '../types';
import QRCode from 'react-qr-code';
import { useAuth } from '../contexts/AuthContext';

const RegisterMemberPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string>('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = uuidv4();
    const newMember: Member = {
      id,
      name,
      email,
      phone,
      registeredAt: Date.now(),
    };
    memberDB.add(newMember);
    login(id);
    setRegisteredId(id);
    setQrValue(generateQRValue(id));
  };

  const generateQRValue = (id: string): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let str = id.replace(/-/g, '').toUpperCase();
    while (str.length < 110) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str.slice(0, 110);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">会員登録</h2>
      {registeredId ? (
        <div>
          <p className="mb-2">登録完了！ 会員ID: <strong>{registeredId}</strong></p>
          <div className="bg-white p-4 inline-block">
            <QRCode value={qrValue} size={256} title="member-id-qr" />
          </div>
          <p className="text-xs mt-2">（QRコード内容文字数: {qrValue.length}）</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">名前</label>
            <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">メールアドレス</label>
            <input className="border p-2 w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">電話番号</label>
            <input className="border p-2 w-full" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">登録</button>
        </form>
      )}
    </div>
  );
};

export default RegisterMemberPage; 