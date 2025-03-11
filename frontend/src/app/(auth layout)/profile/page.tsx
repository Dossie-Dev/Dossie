"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordChange, string>>>({});
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      const userData = response.data.data.data[0];
      setProfile(userData);
      setEditedProfile(userData);
    } catch (error) {
      toast.error("Failed to load profile");
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (name: keyof UserProfile, value: string) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return value.length < 2 ? `${name === "firstName" ? "First" : "Last"} name must be at least 2 characters` : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Please enter a valid email address" : "";
      default:
        return "";
    }
  };

  const validatePasswordField = (name: keyof PasswordChange, value: string) => {
    switch (name) {
      case "currentPassword":
        return value.length === 0 ? "Current password is required" : "";
      case "newPassword":
        return value.length < 8 ? "Password must be at least 8 characters" : "";
      case "confirmPassword":
        return value !== passwordData.newPassword ? "Passwords do not match" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof UserProfile, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    const error = validatePasswordField(name as keyof PasswordChange, value);
    setPasswordErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSave = async () => {
    // Validate all fields
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    let hasErrors = false;

    // Only validate firstName and lastName since email is not editable
    Object.entries(editedProfile).forEach(([key, value]) => {
      if (key === "firstName" || key === "lastName") {
        const error = validateField(key as keyof UserProfile, value as string);
        if (error) {
          newErrors[key as keyof UserProfile] = error;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      // Only send firstName and lastName in the update
      const updateData = {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName
      };
      
      const response = await axios.patch("/api/users/updateMe", updateData, {
        withCredentials: true,
      });
      
      if (response.data.status === 'success') {
        setProfile({
          ...profile,
          ...updateData
        });
        setIsEditing(false);
        toast.success("Profile updated successfully");
        
        // Refresh the profile data to ensure we have the latest state
        fetchProfile();
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      
      // If there was a validation error, set the errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all password fields
    const newErrors: Partial<Record<keyof PasswordChange, string>> = {};
    let hasErrors = false;

    Object.entries(passwordData).forEach(([key, value]) => {
      const error = validatePasswordField(key as keyof PasswordChange, value);
      if (error) {
        newErrors[key as keyof PasswordChange] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setPasswordErrors(newErrors);
      return;
    }

    setIsPasswordChanging(true);
    try {
      const response = await axios.patch("/api/users/updatePassword", {
        passwordCurrent: passwordData.currentPassword,
        password: passwordData.newPassword,
        passwordConfirm: passwordData.confirmPassword
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });


      if (response.data.status === 'success') {
        toast.success("Password updated successfully");
        setIsChangingPassword(false);
        // Clear password fields and errors
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});
        // Reset show password toggles
        setShowPasswords({
          currentPassword: false,
          newPassword: false,
          confirmPassword: false
        });
      }
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = error.response?.data?.message || "Failed to update password";
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors);
      }
    } finally {
      setIsPasswordChanging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-blue-500 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <button
                onClick={() => {
                  if (isEditing) {
                    setEditedProfile(profile || {});
                    setErrors({});
                  }
                  setIsEditing(!isEditing);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isEditing ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        name="firstName"
                        value={editedProfile.firstName || ""}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${errors.firstName ? "input-error" : ""}`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-error">{errors.firstName}</p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-lg text-gray-900">{profile?.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        name="lastName"
                        value={editedProfile.lastName || ""}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${errors.lastName ? "input-error" : ""}`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-error">{errors.lastName}</p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-lg text-gray-900">{profile?.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      value={profile?.email || ""}
                      disabled={true}
                      className="input input-bordered w-full bg-gray-50 cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="flex items-center gap-2">
                    <div className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${profile?.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                      ${profile?.role === 'user' ? 'bg-blue-100 text-blue-800' : ''}
                      ${profile?.role === 'employee' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      <div className="flex items-center gap-1.5">
                        {profile?.role === 'admin' && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                        )}
                        {profile?.role === 'user' && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        )}
                        {profile?.role === 'employee' && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                          </svg>
                        )}
                        <span className="capitalize">{profile?.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <div>
                        <p className="text-lg text-gray-900">
                          {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {profile?.createdAt ? `${Math.floor((new Date().getTime() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="pt-4">
                  {!isChangingPassword ? (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Change Password</h3>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Password</label>
                          <div className="mt-1 relative">
                            <input
                              type={showPasswords.currentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className={`input input-bordered w-full pr-10 ${passwordErrors.currentPassword ? "input-error" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, currentPassword: !prev.currentPassword }))}
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                              {showPasswords.currentPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {passwordErrors.currentPassword && (
                            <p className="mt-1 text-sm text-error">{passwordErrors.currentPassword}</p>
                          )}
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <div className="mt-1 relative">
                            <input
                              type={showPasswords.newPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className={`input input-bordered w-full pr-10 ${passwordErrors.newPassword ? "input-error" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                              {showPasswords.newPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-error">{passwordErrors.newPassword}</p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <div className="mt-1 relative">
                            <input
                              type={showPasswords.confirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className={`input input-bordered w-full pr-10 ${passwordErrors.confirmPassword ? "input-error" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                              {showPasswords.confirmPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-error">{passwordErrors.confirmPassword}</p>
                          )}
                        </div>

                        {/* Password Change Actions */}
                        <div className="flex items-center gap-4">
                          <button
                            type="submit"
                            disabled={isPasswordChanging || 
                              !passwordData.currentPassword || 
                              !passwordData.newPassword || 
                              !passwordData.confirmPassword ||
                              passwordData.newPassword !== passwordData.confirmPassword}
                            className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-500/90 transition-colors ${
                              isPasswordChanging || 
                              !passwordData.currentPassword || 
                              !passwordData.newPassword || 
                              !passwordData.confirmPassword ||
                              passwordData.newPassword !== passwordData.confirmPassword
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            }`}
                          >
                            {isPasswordChanging ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                            )}
                            {isPasswordChanging ? "Updating..." : "Update Password"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                              });
                              setPasswordErrors({});
                            }}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-500/90 transition-colors ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </div>  
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
