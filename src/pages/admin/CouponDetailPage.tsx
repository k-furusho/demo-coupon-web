import React from 'react';
import { useParams } from 'react-router-dom';
import { couponDB } from '../../stores/CouponStore';
import { usageDB } from '../../stores/UsageStore';
import QRCode from 'react-qr-code';
import { memberDB } from '../../stores/MemberStore';

const CouponDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const coupon = id ? couponDB.get(id) : undefined;
  const usages = usageDB.list().filter((u) => u.couponId === id);
  const eligibleMembers = coupon?.eligibleMemberIds.map((id) => memberDB.get(id)).filter(Boolean) || [];

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
          {usages.map((u) => (
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
        {eligibleMembers.map((m) => (
          <li key={(m as any).id}>{(m as any).name} ({(m as any).email})</li>
        ))}
      </ul>
    </div>
  );
};

export default CouponDetailPage; 