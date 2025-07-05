import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers } from '../../lib/api';
import { createCoupon } from '../../lib/api';
import { Coupon } from '../../types';

const CouponCreatePage: React.FC = () => {
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState('');
  const navigate = useNavigate();
  const { data: members = [] } = useMembers();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let str = '';
    for (let i = 0; i < 120; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  };

  const [code, setCode] = useState<string>('');
  useEffect(() => {
    setCode(generateCode());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCoupon: Omit<Coupon, 'id' | 'createdAt'> = {
      code,
      status: 'active',
      maxUses,
      expiresAt: new Date(expiresAt).getTime(),
      eligibleMemberIds: selectedMemberIds,
    } as const;
    const saved = await createCoupon(newCoupon);
    navigate(`/admin/coupons/${saved.id}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">クーポン登録</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">自動生成コード (120桁)</label>
          <div className="flex gap-2">
            <input className="border p-2 w-full text-xs" value={code} readOnly />
            <button type="button" className="bg-gray-300 px-2 rounded" onClick={() => setCode(generateCode())}>再生成</button>
          </div>
        </div>
        <div>
          <label className="block mb-1">最大利用回数</label>
          <input type="number" className="border p-2 w-full" value={maxUses} min={1} onChange={(e) => setMaxUses(Number(e.target.value))} required />
        </div>
        <div>
          <label className="block mb-1">有効期限</label>
          <input type="date" className="border p-2 w-full" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1">対象会員</label>
          <div className="border p-2 h-40 overflow-y-auto">
            {members.map((m: any) => (
              <label key={m.id} className="block text-sm">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={selectedMemberIds.includes(m.id)}
                  onChange={(e) => {
                    setSelectedMemberIds((ids) =>
                      e.target.checked ? [...ids, m.id] : ids.filter((id) => id !== m.id),
                    );
                  }}
                />
                {m.name} ({m.email})
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">登録</button>
      </form>
    </div>
  );
};

export default CouponCreatePage; 