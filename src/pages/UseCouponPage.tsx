import React, { useState } from 'react';
import QrScanner from '../components/QrScanner';
import { usageDB } from '../stores/UsageStore';
import { v4 as uuidv4 } from 'uuid';
import { CouponUsage } from '../types';
import { couponDB } from '../stores/CouponStore';
import { useAuth } from '../contexts/AuthContext';

const UseCouponPage: React.FC = () => {
  const { member } = useAuth();
  if (!member) return <div>ログインしてからご利用ください。</div>;
  const [memberId] = useState<string>(member.id);
  const [step, setStep] = useState<'scanCoupon' | 'input' | 'done' | 'error'>('scanCoupon');
  const [qrValue, setQrValue] = useState('');
  const [count, setCount] = useState(1);
  const [location, setLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [errorMsg, setErrorMsg] = useState('');
  const [couponId, setCouponId] = useState<string | null>(null);

  const handleCouponScan = (text: string) => {
    setQrValue(text);
    const coupon = couponDB.list().find((c) => c.code === text);
    if (!coupon) {
      setErrorMsg('クーポンが見つかりません');
      setStep('error');
      return;
    }
    if (coupon.status !== 'active' || Date.now() > coupon.expiresAt) {
      setErrorMsg('クーポンは無効または期限切れです');
      setStep('error');
      return;
    }
    if (!coupon.eligibleMemberIds.includes(memberId)) {
      setErrorMsg('この会員はクーポン対象外です');
      setStep('error');
      return;
    }
    if (usageDB.list().filter(u=>u.couponId===coupon.id).reduce((sum,u)=>sum+u.count,0) >= coupon.maxUses) {
      setErrorMsg('クーポンの利用上限に達しています');
      setStep('error');
      return;
    }
    setCouponId(coupon.id);
    setStep('input');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;
    const newUsage: CouponUsage = {
      id: uuidv4(),
      couponId: couponId!,
      memberId,
      usedAt: Date.now(),
      count,
      latitude: location.lat,
      longitude: location.lng,
    };
    usageDB.add(newUsage);
    setStep('done');
  };

  if (step === 'scanCoupon') {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">クーポンQRをスキャンしてください</h2>
        <QrScanner onResult={handleCouponScan} />
      </div>
    );
  }

  if (step === 'input' && memberId) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">クーポン利用入力</h2>
        <p className="mb-2">会員ID: {memberId}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">利用回数</label>
            <input type="number" min={1} className="border p-2 w-full" value={count} onChange={(e) => setCount(Number(e.target.value))} required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">利用する</button>
        </form>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">利用記録しました</h2>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">エラーが発生しました</h2>
        <p>{errorMsg}</p>
        <button onClick={() => setStep('scanCoupon')} className="bg-blue-600 text-white px-4 py-2 rounded">再試行</button>
      </div>
    );
  }

  return null;
};

export default UseCouponPage; 