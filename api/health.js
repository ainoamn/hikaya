const phases = {
  '0-foundation': 'scaffolded',
  '1-accounts-data': 'specified',
  '2-visual-identity': 'specified',
  '3-narrative-engine': 'specified',
  '4-print-ready-digital': 'specified',
  '5-commerce': 'specified',
  '6-print-shipping': 'specified',
  '7-audio-video': 'specified',
  '8-global-growth': 'specified'
};

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({error: {code: 'method_not_allowed', message: 'Use GET'}});
    return;
  }
  res.status(200).json({
    ok: true,
    service: 'hikaya',
    version: '1.1.0',
    mode: 'prototype-ui-with-platform-scaffold',
    time: new Date().toISOString(),
    docs: {
      vision: '/docs are in the GitHub repository',
      liveSite: 'https://hikaya-nine.vercel.app'
    },
    phases
  });
}
