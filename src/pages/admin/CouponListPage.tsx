import React from 'react';
import { Link } from 'react-router-dom';
import { useCoupons, useUsages } from '../../lib/api';

const CouponListPage: React.FC = () => {
  const { data: couponsData = [] } = useCoupons();
  const { data: usages = [] } = useUsages();
  const coupons = couponsData.map((c: any) => {
    const used = usages.filter((u: any) => u.couponId === c.id).reduce((sum: number, u: any) => sum + u.count, 0);
    const isExpired = Date.now() > c.expiresAt;
    const isUsedUp = used >= c.maxUses;
    return { ...c, used, isExpired, isUsedUp };
  });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">クーポン一覧</h2>
      <Link to="/admin/coupons/new" className="bg-green-600 text-white px-3 py-1 rounded inline-block mb-2">新規登録</Link>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">コード</th>
            <th className="border px-2 py-1">使用数 / 上限</th>
            <th className="border px-2 py-1">ステータス</th>
            <th className="border px-2 py-1">有効期限</th>
            <th className="border px-2 py-1">操作</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c: any) => (
            <tr key={c.id}>
              <td className="border px-2 py-1">{c.id}</td>
              <td className="border px-2 py-1">{c.code}</td>
              <td className="border px-2 py-1">{c.used}/{c.maxUses}</td>
              <td className={`border px-2 py-1 ${c.isExpired || c.isUsedUp ? 'text-red-600' : ''}`}>{c.isExpired ? '期限切れ' : c.isUsedUp ? '上限到達' : '有効'}</td>
              <td className="border px-2 py-1">{new Date(c.expiresAt).toLocaleDateString()}</td>
              <td className="border px-2 py-1 text-center">
                <Link to={`/admin/coupons/${c.id}`} className="text-blue-600 underline">詳細</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponListPage; 