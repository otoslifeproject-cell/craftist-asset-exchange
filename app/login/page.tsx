import { loginAction } from './actions';

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  return <LoginContent searchParams={searchParams} />;
}

async function LoginContent({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith('/') ? params.next : '/admin';

  return (
    <main className="shell">
      <section className="hero narrow">
        <div className="kicker">Admin access</div>
        <h1>Control room login.</h1>
        <p>For The Craftist team only. Buyers do not log in here; they use private alert links.</p>
        <div className="card stack">
          {params.error ? <p className="error-copy">Wrong passcode.</p> : null}
          <form action={loginAction} className="form">
            <input type="hidden" name="next" value={next} />
            <label>
              Admin passcode
              <input name="passcode" type="password" autoFocus required />
            </label>
            <button className="button green" type="submit">Enter admin</button>
          </form>
        </div>
      </section>
    </main>
  );
}
