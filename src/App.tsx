import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import Home from './pages/Home';
import RegisterMemberPage from './pages/RegisterMemberPage';
import UseCouponPage from './pages/UseCouponPage';
import MemberListPage from './pages/admin/MemberListPage';
import CouponListPage from './pages/admin/CouponListPage';
import CouponDetailPage from './pages/admin/CouponDetailPage';
import CouponCreatePage from './pages/admin/CouponCreatePage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4 flex gap-4">
          <Link to="/" className="text-blue-500">Home</Link>
          <Link to="/register" className="text-blue-500">会員登録</Link>
          <Link to="/use" className="text-blue-500">クーポン利用</Link>
          <Link to="/admin/members" className="text-blue-500">管理画面</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterMemberPage />} />
          <Route path="/use" element={<UseCouponPage />} />

          {/* 管理画面 */}
          <Route path="/admin/members" element={<MemberListPage />} />
          <Route path="/admin/coupons" element={<CouponListPage />} />
          <Route path="/admin/coupons/new" element={<CouponCreatePage />} />
          <Route path="/admin/coupons/:id" element={<CouponDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 