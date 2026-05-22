import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import AssetCreateForm from './AssetCreateForm';

export default async function NewItemPage() {
  const { data } = await supabaseAdmin().from('buyers').select('tags').eq('status', 'active');
  const existingTags = Array.from(new Set((data || []).flatMap((row) => row.tags || []))).sort();

  return (
    <>
      <section className="hero">
        <div className="kicker">New asset</div>
        <h1>Feed the system once.</h1>
        <p>Add the asset sheet, drawings, images and buying terms. Then publish from the asset page when ready.</p>
      </section>

      <AssetCreateForm existingTags={existingTags} />
    </>
  );
}
