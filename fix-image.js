
const BASE_URL = 'https://prime-property-id.vercel.app';
const EMAIL = 'superadmin@primeproperty.com';
const PASSWORD = 'Password123!';

const NEW_IMG_URL = 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

async function fixImage() {
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  
  if (!loginRes.ok) return console.error('Login failed');
  
  const cookies = loginRes.headers.getSetCookie();
  const cookieString = cookies.map(c => c.split(';')[0]).join('; ');
  
  const getRes = await fetch(`${BASE_URL}/api/properties?limit=100`, {
    headers: { 'Cookie': cookieString }
  });
  const getJson = await getRes.json();
  const existingProps = getJson.data || [];
  
  const malioboro = existingProps.find((p) => p.nama_property === 'Ruko Malioboro Indah');
  
  if (malioboro) {
    malioboro.image_url = NEW_IMG_URL;
    const updateRes = await fetch(`${BASE_URL}/api/properties/${malioboro.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieString },
      body: JSON.stringify(malioboro)
    });
    if (updateRes.ok) {
      console.log('✅ Image updated for Ruko Malioboro Indah');
    } else {
      console.log('❌ Failed to update image');
    }
  } else {
    console.log('Property not found');
  }
}

fixImage().catch(console.error);
