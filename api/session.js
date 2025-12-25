import { verify, parseCookies } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies.ai_session;
  const payload = verify(token);
  if (!payload) return res.status(200).json({ authenticated: false });

  return res.status(200).json({ authenticated: true, user: { username: payload.username, role: payload.role } });
}
