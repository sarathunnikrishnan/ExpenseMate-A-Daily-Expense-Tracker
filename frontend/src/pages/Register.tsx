import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setIsLoading(true);
    try {
      await api.post('/auth/send-signup-otp', { email });
      setStep(2);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, otp });
      login(response.data);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-slate-900">
      {/* Full-screen Background Image */}
      <img
        className="absolute inset-0 h-full w-full object-cover animate-zoom-in"
        src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80"
        alt="Growth and money visualization"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply" />

      {/* Background decoration elements */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob [animation-delay:2s]"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob [animation-delay:4s]"></div>

      {/* Main Content Container */}
      <div className="relative z-10 flex w-full flex-row-reverse">
        {/* Right Side: Form (Moved to right) */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8 animate-slide-in-right py-4 mt-6">
              <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                Join ExpenseMate
              </h2>
              <p className="mt-2 text-sm text-slate-200 drop-shadow">
                Start tracking your expenses and take control of your financial future today.
              </p>
            </div>

            <div className="animate-float pb-10">
              <Card className="w-full shadow-2xl border-0 bg-slate-900/40 backdrop-blur-2xl border-slate-700/50">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-white">
                    Create Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
                      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <Input
                          label="Full Name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="bg-slate-900/50 text-white placeholder-slate-400 border-slate-700/50 focus:border-primary-dark backdrop-blur-md transition-all duration-300 focus:scale-[1.02] hover:bg-slate-800/60"
                        />
                      </div>
                      <div className="animate-fade-in-up [animation-delay:200ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
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
                      <div className="animate-fade-in-up [animation-delay:300ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
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
                      <div className="animate-fade-in-up [animation-delay:400ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <Input
                          label="Confirm Password"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-slate-900/50 text-white placeholder-slate-400 border-slate-700/50 focus:border-primary-dark backdrop-blur-md transition-all duration-300 focus:scale-[1.02] hover:bg-slate-800/60"
                        />
                      </div>
                      <div className="animate-fade-in-up [animation-delay:500ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <Button type="submit" className="w-full mt-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-dark/20 active:scale-95" isLoading={isLoading}>
                          Continue
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyAndRegister} className="space-y-4 mt-4 animate-fade-in">
                      <div className="bg-slate-900/50 p-4 rounded-lg mb-6 animate-fade-in-up [animation-delay:100ms] opacity-0 border border-slate-700/50 backdrop-blur-md" style={{ animationFillMode: 'forwards' }}>
                        <p className="text-sm text-center text-slate-300">
                          We've sent a 6-digit verification code to <br/><strong className="text-lg text-white">{email}</strong>
                        </p>
                      </div>
                      <div className="animate-fade-in-up [animation-delay:200ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <Input
                          label="Verification Code"
                          type="text"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          className="text-center tracking-widest text-2xl font-mono bg-slate-900/50 text-white placeholder-slate-500 border-slate-700/50 focus:border-primary-dark h-14 backdrop-blur-md transition-all duration-300 focus:scale-[1.02]"
                          maxLength={6}
                        />
                      </div>
                      <div className="flex gap-3 pt-2 animate-fade-in-up [animation-delay:300ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <Button type="button" variant="outline" className="flex-1 transition-all duration-300 bg-transparent text-slate-300 border-slate-600/50 hover:bg-slate-800 hover:text-white" onClick={() => setStep(1)} disabled={isLoading}>
                          Back
                        </Button>
                        <Button type="submit" className="flex-1 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-dark/20 active:scale-95" isLoading={isLoading}>
                          Verify & Sign Up
                        </Button>
                      </div>
                    </form>
                  )}
                  <div className="mt-6 text-center animate-fade-in-up [animation-delay:600ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <p className="text-sm text-slate-300">
                      Already have an account?{' '}
                      <Link to="/login" className="font-semibold text-primary-dark hover:text-white hover:underline transition-colors drop-shadow">
                        Log in
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Left Side: Text over image */}
        <div className="hidden lg:flex flex-col justify-center p-12 lg:p-24 w-0 flex-1">
          <div className="animate-slide-in-right [animation-delay:300ms] opacity-0 max-w-xl" style={{ animationFillMode: 'forwards' }}>
            <h3 className="text-5xl font-bold mb-4 text-white drop-shadow-lg tracking-tight">Build Your Wealth</h3>
            <p className="text-2xl text-slate-200 font-light leading-relaxed drop-shadow-md">
              Unlock powerful insights and transform your spending habits with ExpenseMate. Your journey to financial freedom begins here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
