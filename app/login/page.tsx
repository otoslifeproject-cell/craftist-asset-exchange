import { loginAction } from './actions';

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return <LoginContent searchParams={searchParams} />;
}

async function LoginContent({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="shell">
      <section className="hero" style={{ maxWidth: 560 }}>
        <div className="kicker">Admin access</div>
        <h1>Control room login.</h1>
        <p>For The Craftist team only. Buyers do not log in here; they use private alert links.</p>
        <div className="card">
          {params.error ? <p style={{ color: '#9b2f23', fontWeight: 800 }}>Wrong passcode.</p> : null}
          <form action={loginAction} className="form">
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
