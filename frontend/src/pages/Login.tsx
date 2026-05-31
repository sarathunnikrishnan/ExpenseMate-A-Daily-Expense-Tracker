import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { APP_NAME } from '../constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-slate-900">
      {/* Full-screen Background Image */}
      <img
        className="absolute inset-0 h-full w-full object-cover animate-zoom-in"
        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80"
        alt="Finance background"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply" />

      {/* Background decoration elements */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob [animation-delay:2s]"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob [animation-delay:4s]"></div>

      {/* Main Content Container */}
      <div className="relative z-10 flex w-full">
        {/* Left Side: Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8 animate-slide-in-right">
              <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                {APP_NAME}
              </h2>
              <p className="mt-2 text-sm text-slate-200 drop-shadow">
                Welcome back! Please enter your details to sign in.
              </p>
            </div>

            <div className="animate-float">
              <Card className="w-full shadow-2xl border-0 bg-slate-900/40 backdrop-blur-2xl border-slate-700/50">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-white">
                    Sign In
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="animate-fade-in-up [animation-delay:100ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                      <Input
                        label="Email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-slate-900/50 text-white placeholder-slate-400 border-slate-700/50 focus:border-primary-dark backdrop-blur-md transition-all duration-300 focus:scale-[1.02] hover:bg-slate-800/60"
                      />
                    </div>
                    <div className="animate-fade-in-up [animation-delay:200ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                      <Input
                        label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-slate-900/50 text-white placeholder-slate-400 border-slate-700/50 focus:border-primary-dark backdrop-blur-md transition-all duration-300 focus:scale-[1.02] hover:bg-slate-800/60"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 animate-fade-in-up [animation-delay:300ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                      <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-dark focus:ring-primary-dark border-slate-700 rounded cursor-pointer bg-slate-900/50" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300 cursor-pointer">
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <a href="#" className="font-medium text-primary-dark hover:text-primary-dark/80 transition-colors drop-shadow">
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <div className="animate-fade-in-up [animation-delay:400ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                      <Button type="submit" className="w-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-dark/20 active:scale-95" isLoading={isLoading}>
                        Log In
                      </Button>
                    </div>
                  </form>
                  <div className="mt-6 text-center animate-fade-in-up [animation-delay:500ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <p className="text-sm text-slate-300">
                      Don't have an account?{' '}
                      <Link to="/register" className="font-semibold text-primary-dark hover:text-white hover:underline transition-colors drop-shadow">
                        Sign up for free
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Side: Text over image */}
        <div className="hidden lg:flex flex-col justify-end p-12 lg:p-24 w-0 flex-1">
          <div className="animate-slide-in-right [animation-delay:300ms] opacity-0 max-w-xl" style={{ animationFillMode: 'forwards' }}>
            <h3 className="text-5xl font-bold mb-4 text-white drop-shadow-lg tracking-tight">Track Every Penny</h3>
            <p className="text-2xl text-slate-200 font-light leading-relaxed drop-shadow-md">
              Take control of your financial future with smart, simple expense tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
