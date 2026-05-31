import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Camera, User as UserIcon } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.profilePhoto || null);
  const [removeProfilePhoto, setRemoveProfilePhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setRemoveProfilePhoto(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    setRemoveProfilePhoto(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email changed and OTP is not yet verified/requested
    if (email !== user?.email && !showOtpInput) {
      setIsSubmitting(true);
      try {
        await api.post('/auth/send-email-update-otp', { newEmail: email });
        setShowOtpInput(true);
        toast.success(`OTP sent to ${email}`);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to send OTP');
      } finally {
        setIsSubmitting(false);
      }
      return; // Stop here and wait for OTP
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (email !== user?.email) {
        formData.append('otp', otp);
      }
      if (password) {
        formData.append('oldPassword', oldPassword);
        formData.append('password', password);
      }
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      } else if (removeProfilePhoto) {
        formData.append('removeProfilePhoto', 'true');
      }

      // Using the user token implicitly via axios interceptor, if configured.
      // Assuming api handles auth token.
      const response = await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateUser(response.data);
      setOldPassword('');
      setPassword('');
      setProfilePhoto(null);
      setRemoveProfilePhoto(false);
      setShowOtpInput(false);
      setOtp('');
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      if (error.response?.data?.message?.includes('OTP')) {
        // Keep OTP input open if it was an OTP error
      } else {
        setShowOtpInput(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Profile</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div 
                  className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-md flex items-center justify-center cursor-pointer relative"
                  onClick={triggerFileInput}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-gray-400" />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera size={24} />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-sm text-red-500 hover:text-red-700 mt-3 font-medium transition-colors"
                >
                  Remove Photo
                </button>
              )}
              {!photoPreview && (
                <p className="text-sm text-gray-500 mt-2">Click to upload photo</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Current Password" 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  placeholder="Required to set a new password"
                />
                
                <Input 
                  label="New Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Leave blank to keep current password"
                />
              </div>

              {showOtpInput && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    We've sent a verification code to <strong>{email}</strong> to confirm your email change.
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
                    <button type="button" onClick={() => setShowOtpInput(false)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
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
    </div>
  );
};

export default Profile;
