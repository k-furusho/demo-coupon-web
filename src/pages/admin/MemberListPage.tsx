import React from 'react';
import { useMembers } from '../../lib/api';
import { Member } from '../../types';

const MemberListPage: React.FC = () => {
  const { data: members = [] } = useMembers() as { data: Member[] };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">会員リスト</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">名前</th>
            <th className="border px-2 py-1">メール</th>
            <th className="border px-2 py-1">電話</th>
            <th className="border px-2 py-1">登録日</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td className="border px-2 py-1">{m.id}</td>
              <td className="border px-2 py-1">{m.name}</td>
              <td className="border px-2 py-1">{m.email}</td>
              <td className="border px-2 py-1">{m.phone}</td>
              <td className="border px-2 py-1">{new Date(m.registeredAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberListPage; 