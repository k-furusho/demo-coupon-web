import React from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useMembers } from '../../lib/api';
import { useCoupon, useUsages } from '../../lib/api';

const CouponDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: coupon } = useCoupon(id || null);
  const { data: usages = [] } = useUsages(id);
  const { data: members = [] } = useMembers();
  const eligibleMembers = coupon?.eligibleMemberIds.map((mid: string) => members.find((m: any)=>m.id===mid)).filter(Boolean) || [];

  if (!coupon) return <div>クーポンが見つかりません</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">クーポン詳細</h2>
      <p>ID: {coupon.id}</p>
      <p>コード: {coupon.code}</p>
      <p>ステータス: {coupon.status}</p>
      <p>有効期限: {new Date(coupon.expiresAt).toLocaleString()}</p>
      <h3 className="text-lg font-semibold mt-4">使用履歴</h3>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">会員ID</th>
            <th className="border px-2 py-1">利用数</th>
            <th className="border px-2 py-1">日時</th>
            <th className="border px-2 py-1">位置情報</th>
          </tr>
        </thead>
        <tbody>
          {usages.map((u: any) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.memberId}</td>
              <td className="border px-2 py-1">{u.count}</td>
              <td className="border px-2 py-1">{new Date(u.usedAt).toLocaleString()}</td>
              <td className="border px-2 py-1">
                {u.latitude && u.longitude ? `${u.latitude.toFixed(3)}, ${u.longitude.toFixed(3)}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mt-4">QRコード</h3>
      <div className="bg-white inline-block p-2 mb-4">
        <QRCode value={coupon.code} size={200} title="coupon-code" />
      </div>
      <h3 className="text-lg font-semibold">対象会員</h3>
      <ul className="list-disc pl-6">
        {eligibleMembers.map((m: any) => (
          <li key={(m as any).id}>{(m as any).name} ({(m as any).email})</li>
        ))}
      </ul>
    </div>
  );
};

export default CouponDetailPage; 