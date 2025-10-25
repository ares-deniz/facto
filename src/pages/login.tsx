import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // ← uses your existing context

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setErr(null);

    if (mode === 'signup' && password !== confirm) {
      setErr('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/home', { replace: true });
    } catch (e: unknown) {
      setErr('Échec de connexion');
    } finally {
      setLoading(false);
    }
  }

  const handleGoogle = async () => {
    if (loading) return;
    setErr(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/home', { replace: true });
    } catch {
      setErr('Connexion Google échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-100/30 text-gray-900 mx-auto flex flex-col items-center justify-center p-4">
      <div>
        {/* Facto Header */}
        <div className="flex justify-center mb-2">
          <h1
            className="flex items-center gap-2 text-3xl md:text-[56px] md:leading-[1.1] leading-tight font-bold
               bg-gradient-to-r from-blue-500 via-green-400 to-blue-500
               bg-clip-text text-transparent tracking-wide py-1"
          >
            <FileText className="w-8 h-8 text-blue-600" />
            <span>Facto</span>
          </h1>
        </div>

        <p className="text-center text-sm text-gray-600 mb-4">
          Générateur de Factures Belges — Premium et rapide
        </p>

        <div className="flex mx-auto justify-center items-center">
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="text-lg font-medium text-white p-1.5 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 w-40 hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            Commencer
          </button>
        </div>

        {/* Collapsible panel */}
        <div
          className={[
            'overflow-hidden transition-all duration-300 mx-auto mt-4 w-full max-w-md',
            showForm ? 'max-h-[540px] opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
          aria-hidden={!showForm}
        >
          <div className="rounded-2xl border border-gray-200 bg-white/60 backdrop-blur p-5 shadow-xl">
            <h2 className="text-xl font-semibold mb-3 text-center">
              {mode === 'signup' ? 'Créer un compte' : 'Connexion'}
            </h2>

            <form className="space-y-3" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm mb-1">Adresse e-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-400"
                  placeholder="vous@example.com"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-400"
                  placeholder="••••••••"
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-400"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {err && <p className="text-sm text-red-500">{err}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 hover:opacity-90 transition disabled:opacity-60"
              >
                {loading
                  ? 'Veuillez patienter…'
                  : mode === 'signup'
                  ? 'Créer un compte'
                  : 'Se connecter'}
              </button>
            </form>

            {/* Google button */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogle}
                className="flex items-center justify-center gap-2 border border-gray-300 bg-white rounded-lg px-4 py-2 w-full hover:bg-gray-50 transition disabled:opacity-60"
              >
                <FcGoogle className="h-5 w-5" />
                <span>Continuer avec Google</span>
              </button>
            </div>

            <div className="mt-3 text-sm text-center text-gray-700">
              {mode === 'signup' ? (
                <>
                  Vous avez déjà un compte ?{' '}
                  <button
                    type="button"
                    className="underline underline-offset-4 hover:text-blue-600"
                    onClick={() => setMode('signin')}
                  >
                    Se connecter
                  </button>
                </>
              ) : (
                <>
                  Nouveau ici ?{' '}
                  <button
                    type="button"
                    className="underline underline-offset-4 hover:text-blue-600"
                    onClick={() => setMode('signup')}
                  >
                    Créer un compte
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
