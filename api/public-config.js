const env = (name, fallback = '') => String(process.env[name] || fallback);
const wifiValue = (name, fallback) => {
  const value = env(name, fallback).trim();
  if (name === 'PUBLIC_WIFI_SSID' && /^TSIGOURA$/i.test(value)) return 'TSIGOURA 5G';
  if (name === 'PUBLIC_WIFI_PASS' && value === 'tsigoura2023') return 'Tsigoura2023';
  return value || fallback;
};

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  return res.status(200).json({
    ok: true,
    venue: {
      name: env('PUBLIC_VENUE_NAME', 'Tsigoura Verde Resort'),
      subtitle: env('PUBLIC_VENUE_SUBTITLE', ''),
    },
    contact: {
      email: env('PUBLIC_BOOKING_EMAIL', env('BOOKING_TO_EMAIL', env('BOOKING_EMAIL', 'reservations@tsigouraverderesort.gr'))),
      phone: env('PUBLIC_PHONE'),
      instagram: env('PUBLIC_INSTAGRAM'),
      facebook: env('PUBLIC_FACEBOOK'),
      maps: env('PUBLIC_MAPS_URL'),
      website: env('PUBLIC_WEBSITE_URL'),
    },
    wifi: {
      ssid: wifiValue('PUBLIC_WIFI_SSID', 'TSIGOURA 5G'),
      pass: wifiValue('PUBLIC_WIFI_PASS', 'Tsigoura2023'),
      enc: env('PUBLIC_WIFI_ENC', 'WPA'),
    },
    legal: {
      companyName: env('PUBLIC_COMPANY_NAME'),
      afm: env('PUBLIC_AFM'),
      doy: env('PUBLIC_DOY'),
      gemi: env('PUBLIC_GEMI'),
      address: env('PUBLIC_ADDRESS'),
      mhte: env('PUBLIC_MHTE'),
      agoranomikos: env('PUBLIC_AGORANOMIKOS'),
    },
  });
};
