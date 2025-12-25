import { sign } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  const userUser = process.env.USER_USER;
  const userPass = process.env.USER_PASS;

  let role = null;
  if (username === adminUser && password === adminPass) role = 'admin';
  else if (username === userUser && password === userPass) role = 'user';

  if (!role) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

  const payload = { username, role, ts: Date.now() };
  const token = sign(payload);

  // Set HttpOnly cookie
  const maxAge = 60 * 60 * 8; // 8 hours
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  res.setHeader('Set-Cookie', `ai_session=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; ${secure}SameSite=Lax`);

  return res.status(200).json({ ok: true, role });
}
