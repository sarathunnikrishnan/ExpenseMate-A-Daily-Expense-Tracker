/**
 * @file Register.tsx
 * @description Account signup page component with two-step OTP email verification workflow.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { APP_NAME, API_ROUTES, APP_ROUTES } from '../constants';
import { AUTH_MESSAGES } from '../messages';

const Register: React.FC = (): React.ReactElement => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(AUTH_MESSAGES.PASSWORDS_DONT_MATCH);
      return;
    }

    setIsLoading(true);
    try {
      await api.post(API_ROUTES.AUTH.SEND_OTP, { email });
      setStep(2);
      toast.success(AUTH_MESSAGES.OTP_SENT);
    } catch (error: any) {
      toast.error(error.response?.data?.message || AUTH_MESSAGES.OTP_SEND_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post(API_ROUTES.AUTH.REGISTER, {
        name,
        email,
        password,
        otp,
      });
      login(response.data);
      toast.success(AUTH_MESSAGES.REGISTRATION_SUCCESS);
      navigate(APP_ROUTES.HOME);
    } catch (error: any) {
      toast.error(error.response?.data?.message || AUTH_MESSAGES.REGISTRATION_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-slate-900">
      <img
        className={BG_IMAGE_CLASS}
        src={BG_IMAGE_URL}
        alt="Growth and money visualization"
      />
      <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply" />

      <div className={BLOB_1_CLASS} />
      <div className={BLOB_2_CLASS} />
      <div className={BLOB_3_CLASS} />

      <div className="relative z-10 flex w-full flex-row-reverse">
        <div className={FORM_CONTAINER_CLASS}>
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8 animate-slide-in-right py-4 mt-6">
              <h2 className={HERO_TITLE_CLASS}>
                Join {APP_NAME}
              </h2>
              <p className="mt-2 text-sm text-slate-200 drop-shadow">
                Start tracking your expenses and take control of your future.
              </p>
            </div>

            <div className="animate-float pb-10">
              <Card className={CARD_CLASS}>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-white">
                    Create Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
                      <div
                        className="animate-fade-in-up [animation-delay:100ms] opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                      >
                        <Input
                          label="Full Name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className={INPUT_FIELD_CLASS}
                        />
                      </div>
                      <div
                        className="animate-fade-in-up [animation-delay:200ms] opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                      >
                        <Input
                          label="Email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className={INPUT_FIELD_CLASS}
                        />
                      </div>
                      <div
                        className="animate-fade-in-up [animation-delay:300ms] opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                      >
                        <Input
                          label="Password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className={INPUT_FIELD_CLASS}
                        />
                      </div>
                      <div
                        className="animate-fade-in-up [animation-delay:400ms] opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                      >
                        <Input
                          label="Confirm Password"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className={INPUT_FIELD_CLASS}
                        />
                      </div>
                      <div
                        className="animate-fade-in-up [animation-delay:500ms] opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                      >
                        <Button
                          type="submit"
                          className={SUBMIT_BTN_CLASS}
                          isLoading={isLoading}
                        >
                          Continue
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleVerifyAndRegister}
                      className="space-y-4 mt-4 animate-fade-in"
                    >
                      <div
                        className={OTP_INFO_BOX_CLASS}
                        style={{ animationFillMode: 'forwards' }}
                      >
                        <p className="text-sm text-center text-slate-300">
                          We've sent a 6-digit verification code to <br />
                          <strong className="text-lg text-white">{email}</strong>
                        </p>
                      </div>
                      <div
                        className="animate-fade-in-up [animation-delay:200ms] opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                      >
                        <Input
                          label="Verification Code"
                          type="text"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          className={OTP_INPUT_CLASS}
                          maxLength={6}
                        />
                      </div>
                      <div
                        className={STEP2_BTN_ROW_CLASS}
                        style={{ animationFillMode: 'forwards' }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className={BACK_BTN_CLASS}
                          onClick={() => setStep(1)}
                          disabled={isLoading}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className={VERIFY_BTN_CLASS}
                          isLoading={isLoading}
                        >
                          Verify & Sign Up
                        </Button>
                      </div>
                    </form>
                  )}
                  <div
                    className={FOOTER_BOX_CLASS}
                    style={{ animationFillMode: 'forwards' }}
                  >
                    <p className="text-sm text-slate-300">
                      Already have an account?{' '}
                      <Link
                        to={APP_ROUTES.LOGIN}
                        className={LOGIN_LINK_CLASS}
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-center p-12 lg:p-24 w-0 flex-1">
          <div
            className={SIDE_HERO_BOX_CLASS}
            style={{ animationFillMode: 'forwards' }}
          >
            <h3 className={SIDE_TITLE_CLASS}>Build Your Wealth</h3>
            <p className={SIDE_DESC_CLASS}>
              Unlock powerful insights and transform your spending habits with{' '}
              {APP_NAME}. Your journey to financial freedom begins here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BG_IMAGE_URL =
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80';

const BG_IMAGE_CLASS = [
  'absolute inset-0 h-full w-full object-cover',
  'animate-zoom-in',
].join(' ');

const BLOB_1_CLASS = [
  'absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full',
  'mix-blend-screen filter blur-[100px] opacity-40 animate-blob',
].join(' ');

const BLOB_2_CLASS = [
  'absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full',
  'mix-blend-screen filter blur-[100px] opacity-40 animate-blob',
  '[animation-delay:2s]',
].join(' ');

const BLOB_3_CLASS = [
  'absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full',
  'mix-blend-screen filter blur-[100px] opacity-40 animate-blob',
  '[animation-delay:4s]',
].join(' ');

const FORM_CONTAINER_CLASS = [
  'flex-1 flex flex-col justify-center px-4 sm:px-6',
  'lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2',
].join(' ');

const HERO_TITLE_CLASS = [
  'text-4xl font-extrabold text-white tracking-tight',
  'drop-shadow-md',
].join(' ');

const CARD_CLASS = [
  'w-full shadow-2xl border-0 bg-slate-900/40',
  'backdrop-blur-2xl border-slate-700/50',
].join(' ');

const INPUT_FIELD_CLASS = [
  'bg-slate-900/50 text-white placeholder-slate-400',
  'border-slate-700/50 focus:border-primary-dark backdrop-blur-md',
  'transition-all duration-300 focus:scale-[1.02] hover:bg-slate-800/60',
].join(' ');

const SUBMIT_BTN_CLASS = [
  'w-full mt-6 transition-all duration-300 transform',
  'hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-dark/20',
  'active:scale-95',
].join(' ');

const OTP_INFO_BOX_CLASS = [
  'bg-slate-900/50 p-4 rounded-lg mb-6 animate-fade-in-up',
  '[animation-delay:100ms] opacity-0 border border-slate-700/50',
  'backdrop-blur-md',
].join(' ');

const OTP_INPUT_CLASS = [
  'text-center tracking-widest text-2xl font-mono bg-slate-900/50',
  'text-white placeholder-slate-500 border-slate-700/50',
  'focus:border-primary-dark h-14 backdrop-blur-md transition-all',
  'duration-300 focus:scale-[1.02]',
].join(' ');

const STEP2_BTN_ROW_CLASS = [
  'flex gap-3 pt-2 animate-fade-in-up',
  '[animation-delay:300ms] opacity-0',
].join(' ');

const BACK_BTN_CLASS = [
  'flex-1 transition-all duration-300 bg-transparent',
  'text-slate-300 border-slate-600/50 hover:bg-slate-800 hover:text-white',
].join(' ');

const VERIFY_BTN_CLASS = [
  'flex-1 transition-all duration-300 transform',
  'hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-dark/20',
  'active:scale-95',
].join(' ');

const FOOTER_BOX_CLASS = [
  'mt-6 text-center animate-fade-in-up',
  '[animation-delay:600ms] opacity-0',
].join(' ');

const LOGIN_LINK_CLASS = [
  'font-semibold text-primary-dark hover:text-white',
  'hover:underline transition-colors drop-shadow',
].join(' ');

const SIDE_HERO_BOX_CLASS = [
  'animate-slide-in-right [animation-delay:300ms]',
  'opacity-0 max-w-xl',
].join(' ');

const SIDE_TITLE_CLASS = [
  'text-5xl font-bold mb-4 text-white',
  'drop-shadow-lg tracking-tight',
].join(' ');

const SIDE_DESC_CLASS = [
  'text-2xl text-slate-200 font-light',
  'leading-relaxed drop-shadow-md',
].join(' ');

export default Register;
