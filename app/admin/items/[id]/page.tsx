import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { formatDate, formatMoney } from '../../../../lib/format';
import type { AlertRecipient, Item } from '../../../../lib/types';
import { expireItemAction, publishItemAction } from '../actions';

export default async function ItemPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ published?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const supabase = supabaseAdmin();
  const [{ data: item }, { data: recipients }, { data: batches }] = await Promise.all([
    supabase.from('items').select('*').eq('id', id).single(),
    supabase.from('alert_recipients').select('*, buyers(company_name, email)').eq('item_id', id).order('created_at', { ascending: false }).limit(100),
    supabase.from('alert_batches').select('*').eq('item_id', id).order('created_at', { ascending: false }).limit(10)
  ]);

  if (!item) notFound();
  const asset = item as Item;
  const allPrice = (asset.guide_price_pence || 0) + (asset.transport_price_pence || 0);

  return (
    <>
      <section className="hero">
        <div className="kicker">Asset control</div>
        <h1>{asset.title}</h1>
        <p>{asset.description}</p>
        {sp.published ? <div className="notice">Private alerts were triggered. Check recipient rows below.</div> : null}
      </section>

      <section className="grid">
        <div className="card span-7">
          <h2>Asset sheet</h2>
          <p><strong>Status:</strong> <span className={`status ${asset.status}`}>{asset.status}</span></p>
          <p><strong>Total checkout price:</strong> {formatMoney(allPrice, asset.currency)} <small>({formatMoney(asset.guide_price_pence, asset.currency)} asset + {formatMoney(asset.transport_price_pence, asset.currency)} transport)</small></p>
          <p><strong>Dimensions:</strong> {asset.dimensions || 'Not set'}</p>
          <p><strong>Dispatch postcode:</strong> {asset.dispatch_postcode || 'Not set'}</p>
          <p><strong>Deadline:</strong> {formatDate(asset.decision_deadline)}</p>
          <p>{(asset.tags || []).map((tag) => <span className="pill" key={tag}>{tag}</span>)}</p>

          <h3>Files</h3>
          {(asset.files || []).length ? (asset.files || []).map((file) => <p key={file.url}><a href={file.url} target="_blank">{file.name}</a></p>) : <p>No files uploaded yet.</p>}
        </div>

        <div className="card span-5 form">
          <h2>Actions</h2>
          <form action={publishItemAction}>
            <input type="hidden" name="item_id" value={asset.id} />
            <button className="button gold" type="submit" disabled={asset.status === 'sold'}>Publish + send buyer alerts</button>
          </form>
          <form action={expireItemAction}>
            <input type="hidden" name="item_id" value={asset.id} />
            <button className="button danger" type="submit" disabled={asset.status === 'sold'}>Expire / remove from sale</button>
          </form>
          <p className="help">Publishing sends private token links only to active buyers whose tags match this asset.</p>
        </div>

        {(asset.image_urls || []).length ? (
          <div className="card span-12">
            <h2>Images</h2>
            <div className="asset-gallery">
              {(asset.image_urls || []).map((url) => <img key={url} src={url} alt={asset.title} />)}
            </div>
          </div>
        ) : null}

        <div className="card span-6">
          <h2>Terms</h2>
          <h3>Included</h3><p>{asset.included || 'Not set'}</p>
          <h3>Exclusions</h3><p>{asset.exclusions || 'Not set'}</p>
          <h3>Transport</h3><p>{asset.transport_notes || 'Not set'}</p>
        </div>

        <div className="card span-6">
          <h2>Compliance / risk</h2>
          <h3>Compliance</h3><p>{asset.compliance_notes || 'Not set'}</p>
          <h3>Condition</h3><p>{asset.condition_notes || 'Not set'}</p>
          <h3>Assembly</h3><p>{asset.assembly_notes || 'Not set'}</p>
        </div>

        <div className="card span-12">
          <h2>Alert batches</h2>
          <table className="table">
            <thead><tr><th>Created</th><th>Status</th><th>Buyer count</th><th>Sent</th><th>Failed</th></tr></thead>
            <tbody>
              {(batches || []).map((batch: any) => <tr key={batch.id}><td>{formatDate(batch.created_at)}</td><td>{batch.status}</td><td>{batch.buyer_count}</td><td>{batch.sent_count}</td><td>{batch.failed_count}</td></tr>)}
              {!(batches || []).length ? <tr><td colSpan={5}>No alerts sent yet.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div className="card span-12">
          <h2>Recipients</h2>
          <table className="table">
            <thead><tr><th>Buyer</th><th>Status</th><th>Private link</th><th>Sent</th></tr></thead>
            <tbody>
              {(recipients || []).map((recipient: AlertRecipient & { buyers?: { company_name: string; email: string } }) => (
                <tr key={recipient.id}>
                  <td>{recipient.buyers?.company_name}<br/><small>{recipient.buyers?.email}</small></td>
                  <td>{recipient.status}</td>
                  <td><Link href={`/deal/${recipient.token}`} target="_blank">Open deal</Link></td>
                  <td>{formatDate(recipient.sent_at)}</td>
                </tr>
              ))}
              {!(recipients || []).length ? <tr><td colSpan={4}>No recipients yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
