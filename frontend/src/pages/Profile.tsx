/**
 * @file Profile.tsx
 * @description User profile management page component for updating credentials and photos.
 */

import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Camera, User as UserIcon } from 'lucide-react';
import { AUTH_MESSAGES } from '../messages';
import { API_ROUTES, FORM_DATA_KEYS, HTTP_HEADERS, OTP_PURPOSE } from '../constants';

const Profile: React.FC = (): React.ReactElement => {
  const { user, updateUser, logout } = useAuth();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    user?.profilePhoto || null
  );
  const [removeProfilePhoto, setRemoveProfilePhoto] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setRemoveProfilePhoto(false);
      const reader = new FileReader();
      reader.onloadend = (): void => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (): void => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    setRemoveProfilePhoto(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (email !== user?.email && !showOtpInput) {
      setIsSubmitting(true);
      try {
        await api.post(API_ROUTES.AUTH.SEND_EMAIL_UPDATE_OTP, {
          newEmail: email,
        });
        setShowOtpInput(true);
        toast.success(AUTH_MESSAGES.OTP_SENT_TO_EMAIL(email));
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || AUTH_MESSAGES.OTP_SEND_FAILED
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append(FORM_DATA_KEYS.NAME, name);
      formData.append(FORM_DATA_KEYS.EMAIL, email);
      if (email !== user?.email) {
        formData.append(FORM_DATA_KEYS.OTP, otp);
      }
      if (password) {
        formData.append(FORM_DATA_KEYS.OLD_PASSWORD, oldPassword);
        formData.append(FORM_DATA_KEYS.PASSWORD, password);
      }
      if (profilePhoto) {
        formData.append(FORM_DATA_KEYS.PROFILE_PHOTO, profilePhoto);
      } else if (removeProfilePhoto) {
        formData.append(
          FORM_DATA_KEYS.REMOVE_PROFILE_PHOTO,
          FORM_DATA_KEYS.BOOLEAN_TRUE
        );
      }

      const response = await api.put(API_ROUTES.AUTH.PROFILE, formData, {
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.MULTIPART_FORM_DATA,
        },
      });

      updateUser(response.data);
      setOldPassword('');
      setPassword('');
      setProfilePhoto(null);
      setRemoveProfilePhoto(false);
      setShowOtpInput(false);
      setOtp('');
      toast.success(AUTH_MESSAGES.PROFILE_UPDATED);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || AUTH_MESSAGES.PROFILE_UPDATE_FAILED
      );
      if (!error.response?.data?.message?.includes(OTP_PURPOSE.KEYWORD)) {
        setShowOtpInput(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await api.delete(API_ROUTES.AUTH.PROFILE);
      toast.success(AUTH_MESSAGES.ACCOUNT_DELETED);
      logout();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || AUTH_MESSAGES.ACCOUNT_DELETE_FAILED
      );
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className={AVATAR_CONTAINER_CLASS}>
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={40} className="text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className={CAMERA_BTN_CLASS}
                >
                  <Camera size={16} />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="border-t dark:border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3">
                  Change Password (Optional)
                </h4>
                <div className="space-y-3">
                  <Input
                    label="Current Password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Required to change password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>

              {showOtpInput && (
                <div className={OTP_BOX_CLASS}>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Verification code sent to <strong>{email}</strong>
                  </p>
                  <Input
                    label="Verification Code"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="text-center tracking-widest text-lg"
                    maxLength={6}
                    required
                  />
                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() => setShowOtpInput(false)}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel Email Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              {showOtpInput ? 'Verify & Save Changes' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-900/30">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. All data will
            be permanently deleted.
          </p>

          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="outline"
              className={DELETE_BTN_CLASS}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          ) : (
            <div className={DELETE_CONFIRM_BOX}>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-4">
                Are you absolutely sure you want to delete your account?
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  isLoading={isDeleting}
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete My Account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const DELETE_BTN_CLASS = [
  'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700',
  'dark:border-red-900/50 dark:hover:bg-red-900/20',
].join(' ');

const AVATAR_CONTAINER_CLASS = [
  'w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800',
  'flex items-center justify-center border-2 border-gray-200 dark:border-gray-700',
].join(' ');

const CAMERA_BTN_CLASS = [
  'absolute bottom-0 right-0 p-2 text-white rounded-full shadow-lg',
  'bg-primary-light dark:bg-primary-dark',
].join(' ');

const OTP_BOX_CLASS = [
  'p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200',
  'dark:border-blue-800 rounded-lg',
].join(' ');

const DELETE_CONFIRM_BOX = [
  'p-4 bg-red-50 dark:bg-red-900/10 border border-red-200',
  'dark:border-red-900/30 rounded-lg',
].join(' ');

export default Profile;
