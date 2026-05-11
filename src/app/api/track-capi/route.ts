import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

function hashData(data: string) {
  if (!data) return '';
  return createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { 
      pixel_id, 
      access_token, 
      event_name, 
      user_data,
      source_url 
    } = await JSON.parse(await req.text());

    if (!pixel_id || !access_token) {
      return NextResponse.json({ error: 'Missing config' }, { status: 400 });
    }

    const payload = {
      data: [
        {
          event_name: event_name || 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: source_url,
          user_data: {
            em: [hashData(user_data.email)],
            ph: [hashData(user_data.phone)],
            fn: [hashData(user_data.name?.split(' ')[0])],
            ln: [hashData(user_data.name?.split(' ').slice(1).join(' '))],
            client_user_agent: req.headers.get('user-agent'),
            client_ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
          }
        }
      ]
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixel_id}/events?access_token=${access_token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
