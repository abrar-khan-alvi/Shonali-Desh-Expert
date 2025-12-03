import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { Button, Input } from '../components/UI';
import { useExpert } from '../context/ExpertContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: contextError, loading } = useExpert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      // Error is handled in context, but we can also set local if needed
      // contextError will be updated
    }
  };

  const error = localError || contextError;

  return (
    <div className="min-h-screen flex bg-background-light font-sans">
      {/* Left Column: Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary-green relative overflow-hidden items-center justify-center text-white p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2f7a57] to-[#1f523a] opacity-90"></div>

        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-900 rounded-full mix-blend-multiply filter blur-3xl opacity-40 translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center space-x-4 mb-10">
            <div className="bg-white/20 p-4 rounded-2xl shadow-lg backdrop-blur-md">
              <Sprout className="w-12 h-12 text-accent-gold" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Shonali Desh</h1>
          </div>
          <h2 className="text-4xl font-bold mb-8 leading-tight">
            Empowering Expertise. <br />
            <span className="text-accent-gold">Transforming Agriculture.</span>
          </h2>
          <p className="text-green-50 text-xl leading-relaxed mb-10">
            Join the premier network of agricultural scientists and experts.
            Connect with farmers, share your knowledge, and drive national growth through innovation.
          </p>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-lg">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-text-dark mb-3">Expert Sign In</h2>
            <p className="text-lg text-text-light">Please enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-center">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="expert@shonalidesh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-4"
                icon={<Mail className="w-5 h-5 text-gray-400" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-dark">Password</label>
                <a href="#" className="text-sm font-medium text-primary-green hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-4"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center py-4 text-lg font-semibold shadow-lg shadow-green-900/10"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </form>

          <p className="mt-10 text-center text-base text-text-light">
            Not a verified expert yet?{' '}
            <a href="#" className="font-semibold text-primary-green hover:underline">
              Apply for verification
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;