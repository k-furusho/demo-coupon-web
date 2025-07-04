import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { couponDB } from '../../stores/CouponStore';
import { Coupon } from '../../types';
import { useNavigate } from 'react-router-dom';
import { memberDB } from '../../stores/MemberStore';

const CouponCreatePage: React.FC = () => {
  const [code, setCode] = useState('');
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState('');
  const navigate = useNavigate();
  const members = memberDB.list();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCoupon: Coupon = {
      id: uuidv4(),
      code,
      status: 'active',
      maxUses,
      expiresAt: new Date(expiresAt).getTime(),
      createdAt: Date.now(),
      eligibleMemberIds: selectedMemberIds,
    };
    couponDB.add(newCoupon);
    navigate('/admin/coupons');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">クーポン登録</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">コード (110桁)</label>
          <input className="border p-2 w-full" value={code} onChange={(e) => setCode(e.target.value)} maxLength={110} required />
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
            {members.map((m) => (
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