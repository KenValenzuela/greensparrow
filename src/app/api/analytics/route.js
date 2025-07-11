import { supabase } from '@/utils/supabaseClient';

export async function POST(req) {
  try {
    const { name, value, id, url } = await req.json();

    const { error } = await supabase
      .from('metrics')
      .insert([{ metric_name: name, metric_value: value, metric_id: id, page_url: url }]);

    if (error) throw error;
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Analytics Error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
