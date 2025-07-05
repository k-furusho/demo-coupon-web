// Simple Express + lowdb API server
import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const adapter = new JSONFile('./server/db.json');
const db = new Low(adapter);
await db.read();

// default structure
db.data ||= { members: [], coupons: [], usages: [] };
await db.write();

// helpers
const getCollection = (name) => db.data[name];

app.get('/api/members', (_, res) => res.json(getCollection('members')));
app.post('/api/members', (req, res) => {
  const member = { ...req.body, id: nanoid(), registeredAt: Date.now() };
  db.data.members.push(member);
  db.write();
  res.cookie('memberId', member.id, { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 });
  res.json(member);
});

app.get('/api/coupons', (_, res) => res.json(getCollection('coupons')));
app.post('/api/coupons', (req, res) => {
  const coupon = { ...req.body, id: nanoid(), createdAt: Date.now() };
  db.data.coupons.push(coupon);
  db.write();
  res.json(coupon);
});
app.get('/api/coupons/:id', (req, res) => {
  const item = db.data.coupons.find((c) => c.id === req.params.id);
  item ? res.json(item) : res.status(404).end();
});

app.get('/api/usages', (req, res) => {
  const { couponId } = req.query;
  const list = couponId ? db.data.usages.filter((u) => u.couponId === couponId) : db.data.usages;
  res.json(list);
});
app.post('/api/usages', (req, res) => {
  const usage = { ...req.body, id: nanoid(), usedAt: Date.now() };
  db.data.usages.push(usage);
  db.write();
  res.json(usage);
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { memberId } = req.body || {};
  const member = db.data.members.find((m) => m.id === memberId);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.cookie('memberId', memberId, { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 });
  res.json(member);
});
app.get('/api/auth/me', (req, res) => {
  const memberId = req.cookies.memberId;
  const member = db.data.members.find((m) => m.id === memberId);
  if (!member) return res.status(401).json({ member: null });
  res.json(member);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API server running on ${PORT}`)); 