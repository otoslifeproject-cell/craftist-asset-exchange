import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer } from '../../../lib/types';
import { BUYER_CATEGORIES, BUYER_TAGS } from '../../../lib/buyerPreferences';
import { updateBuyerPreferencesAction } from '../actions';
import '../buyer.css';

export default async function BuyerPreferencesPage({ searchParams }: { searchParams: Promise<{ profile?: string }> }) {
  const sp = await searchParams;
  const token = sp.profile || '';
  let buyer: Buyer | null = null;

  if (token) {
    const { data } = await supabaseAdmin().from('buyers').select('*').eq('buyer_portal_token', token).single();
    buyer = data as Buyer | null;
  }

  if (!buyer) {
    return (
      <main className="buyer-page">
        <div className="shell">
          <nav className="nav buyer-nav"><Link className="brand" href="/">The Craftist Exchange</Link><div className="navlinks"><Link href="/buyer/signup">Sign up</Link></div></nav>
          <section className="buyer-hero buyer-payment-result"><div className="buyer-hero-card"><div className="kicker">Preferences</div><h1>Profile link needed.</h1><p>Use your private profile link to manage alert preferences.</p><Link className="button gold" href="/buyer/signup">Sign up</Link></div></section>
        </div>
      </main>
    );
  }

  const categories = buyer.preferred_categories || [];
  const tags = buyer.preferred_tags || buyer.tags || [];

  return (
    <main className="buyer-page">
      <div className="shell">
        <nav className="nav buyer-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks"><Link href={`/buyer/dashboard?profile=${token}`}>Buyer dashboard</Link><Link href="/buyer/terms">Buyer terms</Link></div>
        </nav>

        <section className="buyer-hero">
          <div className="buyer-hero-card">
            <div className="kicker">Preferences</div>
            <h1>Manage alerts.</h1>
            <p>Choose the categories and tags that should control which private opportunities reach you.</p>
          </div>
          <aside className="buyer-side-card"><strong>{buyer.company_name}</strong><p>Alerts only send when your profile is active, terms are accepted and a live asset matches these preferences.</p></aside>
        </section>

        <form action={updateBuyerPreferencesAction} className="stack">
          <input type="hidden" name="portal_token" value={token} />
          <section className="card buyer-panel">
            <div className="kicker">Categories</div><h2>Preferred categories</h2>
            <div className="buyer-card-grid">{BUYER_CATEGORIES.map((category) => <label className="buyer-choice" key={category.id}><input type="checkbox" name="preferred_categories" value={category.id} defaultChecked={categories.includes(category.id)} /><strong>{category.label}</strong><small>{category.tagHints.join(' · ')}</small></label>)}</div>
          </section>
          <section className="card buyer-panel">
            <div className="kicker">Tags</div><h2>Preferred tags</h2>
            <div className="buyer-tag-grid">{BUYER_TAGS.map((tag) => <label className="buyer-tag" key={tag.id}><input type="checkbox" name="preferred_tags" value={tag.id} defaultChecked={tags.includes(tag.id)} /> {tag.label}</label>)}</div>
            <div className="buyer-actions"><button className="button gold" type="submit">Manage alerts</button><Link className="button ghost" href={`/buyer/dashboard?profile=${token}`}>Buyer dashboard</Link></div>
          </section>
        </form>
      </div>
    </main>
  );
}
