import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'motion/react';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { signInMock } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Local testing: any password works
      if (password === 'admin123') {
        signInMock(email, 'admin');
        navigate(from, { replace: true });
      } else {
        throw new Error('Invalid credentials. Hint: use admin123');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-warm-brown/5"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
              <Lock className="text-gold w-8 h-8" />
            </div>
            <h1 className="text-3xl font-serif text-warm-brown mb-2">Admin Portal</h1>
            <p className="text-warm-brown/60 text-sm uppercase tracking-widest">Sir Larex Casual Fashion</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start space-x-3"
            >
              <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-warm-brown/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-brown/30 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cream/30 border border-warm-brown/10 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                  placeholder="admin@sirlarex.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-warm-brown/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-brown/30 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cream/30 border border-warm-brown/10 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-warm-brown text-cream py-4 rounded-lg text-sm uppercase tracking-widest font-bold hover:bg-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-warm-brown/5 text-center">
            <a href="/" className="text-xs uppercase tracking-widest text-warm-brown/40 hover:text-gold transition-colors">
              ← Back to Storefront
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};
