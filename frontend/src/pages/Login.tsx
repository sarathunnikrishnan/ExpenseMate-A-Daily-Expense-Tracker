/**
 * @file Login.tsx
 * @description Authentication login page component with email/password authentication.
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

const Login: React.FC = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post(API_ROUTES.AUTH.LOGIN, {
        email,
        password,
      });
      login(response.data);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate(APP_ROUTES.HOME);
    } catch (error: any) {
      toast.error(error.response?.data?.message || AUTH_MESSAGES.LOGIN_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-slate-900">
      <img
        className={BG_IMAGE_CLASS}
        src={BG_IMAGE_URL}
        alt="Finance background"
      />
      <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply" />

      <div className={BLOB_1_CLASS} />
      <div className={BLOB_2_CLASS} />
      <div className={BLOB_3_CLASS} />

      <div className="relative z-10 flex w-full">
        <div className={FORM_CONTAINER_CLASS}>
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-8 animate-slide-in-right">
              <h2 className={HERO_TITLE_CLASS}>
                {APP_NAME}
              </h2>
              <p className="mt-2 text-sm text-slate-200 drop-shadow">
                Welcome back! Please enter your details to sign in.
              </p>
            </div>

            <div className="animate-float">
              <Card className={CARD_CLASS}>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-white">
                    Sign In
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div
                      className="animate-fade-in-up [animation-delay:100ms] opacity-0"
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
                      className="animate-fade-in-up [animation-delay:200ms] opacity-0"
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
                      className={REMEMBER_BOX_CLASS}
                      style={{ animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className={CHECKBOX_CLASS}
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-slate-300 cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div
                      className="animate-fade-in-up [animation-delay:400ms] opacity-0"
                      style={{ animationFillMode: 'forwards' }}
                    >
                      <Button
                        type="submit"
                        className={SUBMIT_BTN_CLASS}
                        isLoading={isLoading}
                      >
                        Log In
                      </Button>
                    </div>
                  </form>
                  <div
                    className={FOOTER_BOX_CLASS}
                    style={{ animationFillMode: 'forwards' }}
                  >
                    <p className="text-sm text-slate-300">
                      Don't have an account?{' '}
                      <Link
                        to={APP_ROUTES.REGISTER}
                        className={SIGNUP_LINK_CLASS}
                      >
                        Sign up for free
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-end p-12 lg:p-24 w-0 flex-1">
          <div
            className={SIDE_HERO_BOX_CLASS}
            style={{ animationFillMode: 'forwards' }}
          >
            <h3 className={SIDE_TITLE_CLASS}>
              Track Every Penny
            </h3>
            <p className={SIDE_DESC_CLASS}>
              Take control of your financial future with smart, simple expense tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BG_IMAGE_URL =
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80';

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

const REMEMBER_BOX_CLASS = [
  'flex items-center justify-between mt-2',
  'animate-fade-in-up [animation-delay:300ms] opacity-0',
].join(' ');

const CHECKBOX_CLASS = [
  'h-4 w-4 text-primary-dark focus:ring-primary-dark',
  'border-slate-700 rounded cursor-pointer bg-slate-900/50',
].join(' ');

const SUBMIT_BTN_CLASS = [
  'w-full transition-all duration-300 transform',
  'hover:-translate-y-1 hover:shadow-lg',
  'hover:shadow-primary-dark/20 active:scale-95',
].join(' ');

const FOOTER_BOX_CLASS = [
  'mt-6 text-center animate-fade-in-up',
  '[animation-delay:500ms] opacity-0',
].join(' ');

const SIGNUP_LINK_CLASS = [
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

export default Login;
