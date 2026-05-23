import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { formatDate, formatMoney } from '../../../lib/format';
import type { Item } from '../../../lib/types';
import { createItemAction } from '../items/actions';
import '../room.css';

function tagLabel(tag: string) {
  return tag.replace(/-/g, ' ');
}

export default async function AssetsPage() {
  const { data, error } = await supabaseAdmin()
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const assets = (data || []) as Item[];
  const draftCount = assets.filter((item) => item.status === 'draft').length;
  const liveCount = assets.filter((item) => item.status === 'live').length;
  const soldCount = assets.filter((item) => item.status === 'sold').length;

  return (
    <section className="room-page">
      <div className="room-hero">
        <div>
          <div className="kicker">Assets</div>
          <h1>Build, review, publish.</h1>
          <p>One clean asset room: create the opportunity on the left, then open any saved asset from the list on the right.</p>
        </div>
        <div className="room-stat-card">
          <strong>{assets.length}</strong>
          <span>{draftCount} draft · {liveCount} live · {soldCount} sold</span>
        </div>
      </div>

      <div className="room-steps">
        <div className="room-step"><span>01</span><strong>Capture</strong><small>title, price, files</small></div>
        <div className="room-step"><span>02</span><strong>Tag</strong><small>buyer lane</small></div>
        <div className="room-step"><span>03</span><strong>Review</strong><small>private deal page</small></div>
        <div className="room-step"><span>04</span><strong>Publish</strong><small>alert batch</small></div>
      </div>

      <div className="room-grid">
        <div className="card room-form-card">
          <div className="section-head compact">
            <div>
              <div className="kicker">Step 01</div>
              <h2 className="section-title">Add asset</h2>
              <p>Use the slimmer intake here for speed. Full files, notes and refinement can happen inside the asset record.</p>
            </div>
          </div>

          <form action={createItemAction} className="form room-form">
            <input type="hidden" name="currency" value="gbp" />
            <input type="hidden" name="status" value="draft" />
            <label>Title<input name="title" required placeholder="12ft Giant Cherry Bar" /></label>
            <label>Description<textarea name="description" placeholder="What it is, what it was built for, and repurpose ideas." /></label>
            <label>Category<input name="category" placeholder="Giant prop / bar / scenic build" /></label>
            <label>Buyer tags<input name="tags" placeholder="PROP-BIG, BAR, FESTIVAL, IMMERSIVE" /></label>
            <div className="room-two">
              <label>Asset price GBP<input name="guide_price" inputMode="decimal" placeholder="4500" /></label>
              <label>Transport GBP<input name="transport_price" inputMode="decimal" placeholder="0" /></label>
            </div>
            <div className="room-two">
              <label>Dimensions<input name="dimensions" placeholder="12ft x 12ft x 12ft" /></label>
              <label>Dispatch postcode<input name="dispatch_postcode" placeholder="CB25..." /></label>
            </div>
            <label>Decision deadline<input name="decision_deadline" type="datetime-local" /></label>
            <label>Image URLs<textarea name="image_urls" placeholder="https://... one per line" /></label>
            <label>File URLs<textarea name="file_urls" placeholder="https://...asset-sheet.pdf" /></label>
            <button className="button green" type="submit">Create draft asset</button>
          </form>
        </div>

        <div className="card room-list-card">
          <div className="section-head compact">
            <div>
              <div className="kicker">Step 02</div>
              <h2 className="section-title">Asset list</h2>
              <p>Click any asset to open its record, review it, then publish when ready.</p>
            </div>
          </div>

          <div className="room-list">
            {assets.map((asset) => (
              <Link className="room-list-row" href={`/admin/items/${asset.id}`} key={asset.id}>
                <div>
                  <strong>{asset.title}</strong>
                  <small>{asset.dimensions || asset.category || 'No dimensions yet'}</small>
                </div>
                <div className="room-row-meta">
                  <span className={`status ${asset.status}`}>{asset.status}</span>
                  <span>{formatMoney((asset.guide_price_pence || 0) + (asset.transport_price_pence || 0), asset.currency)}</span>
                  <small>{formatDate(asset.decision_deadline)}</small>
                </div>
                <div className="room-tags">{(asset.tags || []).slice(0, 4).map((tag) => <span className="pill subtle" key={tag}>{tagLabel(tag)}</span>)}</div>
              </Link>
            ))}
            {!assets.length ? <div className="room-empty">No assets yet. Create the first one on the left.</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
