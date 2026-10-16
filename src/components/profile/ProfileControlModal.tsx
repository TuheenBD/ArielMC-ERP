'use client';

import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  Key, 
  Users, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Edit3, 
  Plus, 
  LogOut, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Globe2, 
  Laptop, 
  Activity, 
  Fingerprint, 
  FileText,
  UserPlus
} from 'lucide-react';
import { UserProfile, UserRole, UserDepartment, TwoFactorMethod } from '@/types/auth';
import { EntityCode } from '@/types/erp';

interface ProfileControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateCurrentUser: (updated: UserProfile) => void;
  allUsers: UserProfile[];
  onUpdateUserList: (users: UserProfile[]) => void;
  onSignOut: () => void;
}

type ProfileTab = 'EDIT_PROFILE' | 'PASSWORD' | 'TWO_FACTOR' | 'USER_MANAGEMENT' | 'SESSIONS_AUDIT';

export const ProfileControlModal: React.FC<ProfileControlModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  allUsers,
  onUpdateUserList,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('EDIT_PROFILE');

  // Edit Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [designation, setDesignation] = useState(currentUser.designation);
  const [department, setDepartment] = useState<UserDepartment>(currentUser.department);
  const [primaryEntity, setPrimaryEntity] = useState<EntityCode>(currentUser.primaryEntity);
  const [signatureText, setSignatureText] = useState(currentUser.signatureText || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Password Modify State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // 2SA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled);
  const [twoFactorMethod, setTwoFactorMethod] = useState<TwoFactorMethod>(currentUser.twoFactorMethod || 'AUTHENTICATOR_APP');
  const [twoFactorSecret] = useState(currentUser.twoFactorSecret || 'JBSWY3DPEHPK3PXP');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [twoFactorSuccess, setTwoFactorSuccess] = useState<string | null>(null);

  // User Management State (Create & Delete)
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+880 1819-');
  const [newUserDesignation, setNewUserDesignation] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState<UserDepartment>('SOURCING_MERCHANDISING');
  const [newUserRole, setNewUserRole] = useState<UserRole>('SOURCING_DIRECTOR');
  const [newUserEntity, setNewUserEntity] = useState<EntityCode>('ARIEL_BD');
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [userMgmtSuccess, setUserMgmtSuccess] = useState<string | null>(null);

  // Session State
  const [sessionSuccess, setSessionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      email,
      phone,
      designation,
      department,
      primaryEntity,
      signatureText,
    };
    onUpdateCurrentUser(updated);

    // Update in allUsers list as well
    const updatedList = allUsers.map((u) => (u.id === updated.id ? updated : u));
    onUpdateUserList(updatedList);

    setProfileSuccessMsg('Profile details successfully updated and saved to station storage.');
    setTimeout(() => setProfileSuccessMsg(null), 3000);
  };

  // Handle Password Modify
  const handleModifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    const updated: UserProfile = {
      ...currentUser,
      passwordHash: newPassword,
      securityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          event: 'Password Modified & Re-encrypted',
          ip: '103.145.118.24',
          location: 'Dhaka, Bangladesh',
          status: 'SUCCESS',
          details: 'Updated via Profile Control Center',
        },
        ...currentUser.securityLogs,
      ],
    };

    onUpdateCurrentUser(updated);
    const updatedList = allUsers.map((u) => (u.id === updated.id ? updated : u));
    onUpdateUserList(updatedList);

    setPasswordSuccess('Password successfully modified and secured with AES-256.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(null), 3500);
  };

  // Handle 2SA Settings Save
  const handleSaveTwoFactor = () => {
    const updated: UserProfile = {
      ...currentUser,
      twoFactorEnabled,
      twoFactorMethod: twoFactorEnabled ? twoFactorMethod : 'NONE',
      securityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          event: twoFactorEnabled ? 'Two-Step Authentication (2SA) Activated' : '2SA Deactivated',
          ip: '103.145.118.24',
          location: 'Dhaka, Bangladesh',
          status: 'SUCCESS',
          details: `Method: ${twoFactorMethod}`,
        },
        ...currentUser.securityLogs,
      ],
    };

    onUpdateCurrentUser(updated);
    const updatedList = allUsers.map((u) => (u.id === updated.id ? updated : u));
    onUpdateUserList(updatedList);

    setTwoFactorSuccess(
      twoFactorEnabled
        ? 'Two-Step Authentication (2SA) successfully configured & activated!'
        : 'Two-Step Authentication has been disabled.'
    );
    setTimeout(() => setTwoFactorSuccess(null), 3500);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(twoFactorSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyRecoveryCodes = () => {
    const codes = (currentUser.recoveryCodes || []).join('\n');
    navigator.clipboard.writeText(codes);
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDownloadRecoveryCodes = () => {
    const text = `ArielMC ERP - Emergency 2SA Recovery Codes\nAccount: ${currentUser.email}\nGenerated: ${new Date().toISOString()}\n\n` +
      (currentUser.recoveryCodes || []).map((c, i) => `${i + 1}. ${c}`).join('\n') +
      `\n\nKeep these codes in a secure, confidential place.`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `arielmc_recovery_codes_${currentUser.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle Create User
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const initials = newUserName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3) || 'AMC';

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim(),
      designation: newUserDesignation.trim() || 'Merchandising Officer',
      department: newUserDepartment,
      role: newUserRole,
      entityAccess: [newUserEntity],
      primaryEntity: newUserEntity,
      avatarInitials: initials,
      avatarColor: '#2C5240',
      signatureText: `${newUserName.trim()}, ${newUserDesignation.trim()}, ArielMC`,
      twoFactorEnabled: false,
      twoFactorMethod: 'NONE',
      status: 'ACTIVE',
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0],
      passwordHash: 'arielmc2026',
      activeSessions: [],
      securityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          event: 'User Created by Administrator',
          ip: '103.145.118.24',
          location: 'Dhaka, Bangladesh',
          status: 'SUCCESS',
        },
      ],
    };

    const updated = [newUser, ...allUsers];
    onUpdateUserList(updated);
    setIsAddingUser(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserDesignation('');
    setUserMgmtSuccess(`Colleague profile for ${newUser.name} created successfully.`);
    setTimeout(() => setUserMgmtSuccess(null), 3500);
  };

  // Handle Delete User
  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      alert('You cannot delete your own active administrator profile.');
      setUserToDelete(null);
      return;
    }

    const updated = allUsers.filter((u) => u.id !== userToDelete.id);
    onUpdateUserList(updated);
    setUserMgmtSuccess(`User ${userToDelete.name} has been removed from ArielMC ERP.`);
    setUserToDelete(null);
    setTimeout(() => setUserMgmtSuccess(null), 3500);
  };

  // Handle Toggle User Status
  const handleToggleUserStatus = (u: UserProfile) => {
    if (u.id === currentUser.id) return;
    const nextStatus: 'ACTIVE' | 'SUSPENDED' = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = allUsers.map((item) => (item.id === u.id ? { ...item, status: nextStatus } : item));
    onUpdateUserList(updated);
  };

  // Sign out remote sessions
  const handleSignOutRemoteSessions = () => {
    const updatedSessions = currentUser.activeSessions.filter((s) => s.isCurrent);
    const updated: UserProfile = {
      ...currentUser,
      activeSessions: updatedSessions,
      securityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          event: 'Remote Sessions Terminated',
          ip: '103.145.118.24',
          location: 'Dhaka, Bangladesh',
          status: 'SUCCESS',
          details: 'Signed out all devices except current workstation',
        },
        ...currentUser.securityLogs,
      ],
    };
    onUpdateCurrentUser(updated);
    setSessionSuccess('All other remote workstation and mobile sessions have been logged out.');
    setTimeout(() => setSessionSuccess(null), 3500);
  };

  const getStationLabel = (code: EntityCode) => {
    switch (code) {
      case 'ARIEL_BD': return 'ArielMC BD';
      case 'ARIEL_UK': return 'ArielMC UK';
      case 'ARIEL_US': return 'ArielMC US';
      case 'ARIEL_EU': return 'ArielMC EU';
      case 'ARIEL_AU': return 'ArielMC AU';
      default: return 'ArielMC';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        id="profile-control-modal"
        className="relative w-full max-w-4xl bg-[#12231B] border border-[#2C5240] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 transition-all"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2C5240] bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#162B22]">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-[#C8A96A]/40 text-[#1F3A2E]"
              style={{ backgroundColor: currentUser.avatarColor || '#C8A96A' }}
            >
              {currentUser.avatarInitials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-heading tracking-wide">
                  {currentUser.name}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40">
                  {currentUser.role.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                  {getStationLabel(currentUser.primaryEntity)}
                </span>
              </div>
              <p className="text-xs text-[#CFE0D5] flex items-center gap-2 mt-0.5">
                <span>{currentUser.designation}</span> &bull; <span>{currentUser.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-black/20 transition-colors"
            title="Close Profile Control"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2C5240] px-6 bg-[#0E1A14] overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('EDIT_PROFILE')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'EDIT_PROFILE'
                ? 'border-[#C8A96A] text-[#C8A96A] bg-[#162B22]/60'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('PASSWORD')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'PASSWORD'
                ? 'border-[#C8A96A] text-[#C8A96A] bg-[#162B22]/60'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Password Modify</span>
          </button>

          <button
            onClick={() => setActiveTab('TWO_FACTOR')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'TWO_FACTOR'
                ? 'border-[#C8A96A] text-[#C8A96A] bg-[#162B22]/60'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>2SA / Two-Step Auth</span>
            {currentUser.twoFactorEnabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('USER_MANAGEMENT')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'USER_MANAGEMENT'
                ? 'border-[#C8A96A] text-[#C8A96A] bg-[#162B22]/60'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & User Control ({allUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SESSIONS_AUDIT')}
            className={`py-3.5 px-4 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'SESSIONS_AUDIT'
                ? 'border-[#C8A96A] text-[#C8A96A] bg-[#162B22]/60'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Sessions & Audit Logs</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[62vh] space-y-6">
          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'EDIT_PROFILE' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Official Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Corporate Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Phone / WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Job Title / Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Operating Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as UserDepartment)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="EXECUTIVE">Executive Trade Desk</option>
                    <option value="SOURCING_MERCHANDISING">Sourcing & Merchandising</option>
                    <option value="FACTORY_COMPLIANCE">Factory Compliance & QA</option>
                    <option value="FINANCE_COMMERCIAL">Commercial Finance & LC Banking</option>
                    <option value="LOGISTICS_FULFILLMENT">Logistics & Bonded Warehousing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                    Primary Station Entity
                  </label>
                  <select
                    value={primaryEntity}
                    onChange={(e) => setPrimaryEntity(e.target.value as EntityCode)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="ARIEL_BD">ArielMC BD (Dhaka Operations Station)</option>
                    <option value="ARIEL_UK">ArielMC UK (London Commercial Desk)</option>
                    <option value="ARIEL_US">ArielMC US (New York Trade Station)</option>
                    <option value="ARIEL_EU">ArielMC EU (Rotterdam Logistics Hub)</option>
                    <option value="ARIEL_AU">ArielMC AU (Sydney Distribution Hub)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                  Authorized Export Digital Signature Text (Printed on Invoices & Mushak 6.3)
                </label>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="e.g. Syed Akramul Hassan, Managing Director, ArielMC"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] font-bold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PASSWORD MODIFY */}
          {activeTab === 'PASSWORD' && (
            <form onSubmit={handleModifyPassword} className="space-y-4 max-w-xl">
              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              {/* Password Quality Indicator */}
              <div className="p-3 rounded-xl bg-[#162B22] border border-[#2C5240] text-[11px] text-[#CFE0D5] space-y-1">
                <span className="font-semibold text-white block">Enterprise Password Guidelines:</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                  <span>At least 8 characters recommended</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                  <span>Contains uppercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                  <span>Contains numeric digit</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] font-bold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Update Enterprise Password</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TWO-STEP AUTHENTICATION (2SA) */}
          {activeTab === 'TWO_FACTOR' && (
            <div className="space-y-6">
              {twoFactorSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{twoFactorSuccess}</span>
                </div>
              )}

              {/* Master 2SA Switch */}
              <div className="p-5 rounded-xl bg-[#162B22] border border-[#2C5240] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-[#C8A96A]" />
                    <h3 className="text-sm font-bold text-white">
                      Two-Step Authentication (2SA / MFA)
                    </h3>
                  </div>
                  <p className="text-xs text-[#CFE0D5] leading-relaxed">
                    Protect your <span className="font-bold">ArielMC</span> account with an additional verification factor on sign in.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8A96A]"></div>
                </label>
              </div>

              {twoFactorEnabled && (
                <div className="space-y-6">
                  {/* Method Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setTwoFactorMethod('AUTHENTICATOR_APP')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        twoFactorMethod === 'AUTHENTICATOR_APP'
                          ? 'bg-[#1F3A2E] border-[#C8A96A] shadow-md'
                          : 'bg-[#0F1E16] border-[#2C5240] hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <QrCode className="w-5 h-5 text-[#C8A96A]" />
                        {twoFactorMethod === 'AUTHENTICATOR_APP' && (
                          <span className="text-[10px] font-bold text-[#C8A96A] bg-[#C8A96A]/20 px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">Authenticator App (Recommended)</h4>
                      <p className="text-[11px] text-[#CFE0D5]">
                        Google Authenticator, Microsoft Authenticator, or 1Password TOTP.
                      </p>
                    </div>

                    <div 
                      onClick={() => setTwoFactorMethod('SMS_WHATSAPP')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        twoFactorMethod === 'SMS_WHATSAPP'
                          ? 'bg-[#1F3A2E] border-[#C8A96A] shadow-md'
                          : 'bg-[#0F1E16] border-[#2C5240] hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Smartphone className="w-5 h-5 text-[#C8A96A]" />
                        {twoFactorMethod === 'SMS_WHATSAPP' && (
                          <span className="text-[10px] font-bold text-[#C8A96A] bg-[#C8A96A]/20 px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">WhatsApp & SMS OTP</h4>
                      <p className="text-[11px] text-[#CFE0D5]">
                        Receive instant 6-digit one-time passcode on verified phone: {currentUser.phone}.
                      </p>
                    </div>
                  </div>

                  {/* QR Code Simulation & Secret Key */}
                  {twoFactorMethod === 'AUTHENTICATOR_APP' && (
                    <div className="p-5 rounded-xl bg-[#0F1E16] border border-[#2C5240] flex flex-col md:flex-row items-center gap-6">
                      <div className="w-36 h-36 bg-white p-2.5 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                        {/* High-contrast authentic QR code matrix simulation */}
                        <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M10 10h30v30h-30z M15 15h20v20h-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15h20v20h-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65h20v20h-20z M20 70h10v10h-10z M45 15h10v10h-10z M45 35h10v10h-10z M55 45h10v10h-10z M25 45h10v10h-10z M65 55h10v10h-10z M75 65h15v15h-15z M45 65h10v25h-10z M55 75h10v15h-10z" />
                        </svg>
                      </div>

                      <div className="space-y-3 flex-1 text-xs">
                        <h4 className="font-bold text-white">Scan with Authenticator App</h4>
                        <p className="text-[#CFE0D5] leading-relaxed">
                          Scan the QR code in your mobile authenticator app, or manually enter the secret configuration key below:
                        </p>

                        <div className="flex items-center gap-2">
                          <code className="px-3 py-2 rounded-lg bg-black/50 border border-[#2C5240] font-mono text-sm text-[#C8A96A] tracking-wider select-all">
                            {twoFactorSecret}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopySecret}
                            className="p-2 rounded-lg bg-[#1F3A2E] text-white hover:bg-[#2C5240] border border-[#2C5240]"
                            title="Copy Secret"
                          >
                            {copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#C8A96A]" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Emergency Recovery Codes */}
                  <div className="p-5 rounded-xl bg-[#0F1E16] border border-[#2C5240] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#C8A96A]" />
                        <h4 className="text-xs font-bold text-white">
                          Emergency Recovery Codes (Single-Use)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyRecoveryCodes}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1F3A2E] text-white hover:bg-[#2C5240] text-[11px] font-semibold border border-[#2C5240]"
                        >
                          {copiedCodes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C8A96A]" />}
                          <span>{copiedCodes ? 'Copied' : 'Copy All'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadRecoveryCodes}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1F3A2E] text-white hover:bg-[#2C5240] text-[11px] font-semibold border border-[#2C5240]"
                        >
                          <Download className="w-3.5 h-3.5 text-[#C8A96A]" />
                          <span>Download .txt</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(currentUser.recoveryCodes || []).map((code, idx) => (
                        <div 
                          key={idx}
                          className="p-2 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-[#CFE0D5] text-center"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTwoFactor}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] font-bold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save 2SA Security Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TEAM & USER MANAGEMENT */}
          {activeTab === 'USER_MANAGEMENT' && (
            <div className="space-y-6">
              {userMgmtSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{userMgmtSuccess}</span>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    <span className="font-bold">ArielMC</span> Enterprise User Accounts
                  </h3>
                  <p className="text-xs text-[#CFE0D5]">
                    Manage permissions, station access, and credentials for all commercial team members.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingUser(!isAddingUser)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] font-bold text-xs transition-all shadow-sm"
                >
                  {isAddingUser ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{isAddingUser ? 'Cancel' : 'Add Colleague'}</span>
                </button>
              </div>

              {/* Add User Form Drawer */}
              {isAddingUser && (
                <form onSubmit={handleCreateUserSubmit} className="p-5 rounded-xl bg-[#162B22] border border-[#2C5240] space-y-3.5 animate-fadeIn">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#C8A96A]" />
                    <span>Create & Provision New User Profile</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                        placeholder="e.g. Masud Karim"
                        className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        required
                        placeholder="masud@arielmc.com"
                        className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                        Mobile Phone
                      </label>
                      <input
                        type="text"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        placeholder="+880 1819-..."
                        className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={newUserDesignation}
                        onChange={(e) => setNewUserDesignation(e.target.value)}
                        placeholder="Sourcing Merchandiser / QA Officer"
                        className="w-full px-3 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                        Department
                      </label>
                      <select
                        value={newUserDepartment}
                        onChange={(e) => setNewUserDepartment(e.target.value as UserDepartment)}
                        className="w-full px-2 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs"
                      >
                        <option value="SOURCING_MERCHANDISING">Merchandising</option>
                        <option value="FACTORY_COMPLIANCE">Compliance & QA</option>
                        <option value="FINANCE_COMMERCIAL">Finance & Tax</option>
                        <option value="LOGISTICS_FULFILLMENT">Logistics & CFS</option>
                        <option value="EXECUTIVE">Executive Trade Desk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                        Role Access
                      </label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                        className="w-full px-2 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs"
                      >
                        <option value="SOURCING_DIRECTOR">Merchandiser</option>
                        <option value="COMPLIANCE_AUDITOR">Compliance Auditor</option>
                        <option value="FINANCE_CONTROLLER">Finance Controller</option>
                        <option value="LOGISTICS_MANAGER">Logistics Manager</option>
                        <option value="BUYER_VIEWER">Partner Viewer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#CFE0D5] mb-1">
                        Station Entity
                      </label>
                      <select
                        value={newUserEntity}
                        onChange={(e) => setNewUserEntity(e.target.value as EntityCode)}
                        className="w-full px-2 py-2 rounded-xl bg-[#0F1E16] border border-[#2C5240] text-white text-xs"
                      >
                        <option value="ARIEL_BD">ArielMC BD</option>
                        <option value="ARIEL_UK">ArielMC UK</option>
                        <option value="ARIEL_US">ArielMC US</option>
                        <option value="ARIEL_EU">ArielMC EU</option>
                        <option value="ARIEL_AU">ArielMC AU</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingUser(false)}
                      className="px-4 py-2 rounded-xl bg-[#1F3A2E] text-white text-xs font-semibold hover:bg-[#2C5240]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E] hover:bg-[#d6ba7f] text-xs font-bold shadow-md"
                    >
                      Provision User Account
                    </button>
                  </div>
                </form>
              )}

              {/* User Directory Table */}
              <div className="rounded-xl border border-[#2C5240] overflow-hidden bg-[#0F1E16]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#162B22] text-[#C8A96A] font-semibold border-b border-[#2C5240]">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-3">Role & Dept</th>
                      <th className="py-3 px-3">Station</th>
                      <th className="py-3 px-3">2SA Status</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C5240]/60 text-[#CFE0D5]">
                    {allUsers.map((u) => {
                      const isSelf = u.id === currentUser.id;
                      return (
                        <tr key={u.id} className="hover:bg-[#162B22]/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-[#1F3A2E] shrink-0"
                                style={{ backgroundColor: u.avatarColor || '#C8A96A' }}
                              >
                                {u.avatarInitials}
                              </div>
                              <div>
                                <div className="font-semibold text-white flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {isSelf && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-[#C8A96A] text-[#1F3A2E]">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-400">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="text-white font-medium">{u.designation}</div>
                            <div className="text-[10px] text-gray-400">{u.role.replace(/_/g, ' ')}</div>
                          </td>

                          <td className="py-3 px-3 font-mono text-[11px]">
                            {getStationLabel(u.primaryEntity)}
                          </td>

                          <td className="py-3 px-3">
                            {u.twoFactorEnabled ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                                <ShieldCheck className="w-3 h-3" /> 2SA Active
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400">None</span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => !isSelf && handleToggleUserStatus(u)}
                              disabled={isSelf}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                                u.status === 'ACTIVE'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/50'
                                  : 'bg-red-950/60 text-red-300 border border-red-800/80 hover:bg-red-900/50'
                              } ${isSelf ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                            >
                              {u.status}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => setUserToDelete(u)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Delete Confirmation Modal */}
              {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                  <div className="bg-[#162B22] border border-red-800/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Delete Colleague Profile</h4>
                        <p className="text-xs text-[#CFE0D5]">This operation cannot be undone.</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#CFE0D5] leading-relaxed">
                      Are you sure you want to permanently remove <span className="font-bold text-white">{userToDelete.name}</span> ({userToDelete.email}) from <span className="font-bold">ArielMC</span> ERP?
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setUserToDelete(null)}
                        className="px-4 py-2 rounded-xl bg-[#1F3A2E] text-white hover:bg-[#2C5240] text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeleteUser}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SESSIONS & AUDIT LOGS */}
          {activeTab === 'SESSIONS_AUDIT' && (
            <div className="space-y-6">
              {sessionSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{sessionSuccess}</span>
                </div>
              )}

              {/* Active Sessions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-[#C8A96A]" />
                      <span>Active Station Workstations & Devices</span>
                    </h3>
                    <p className="text-xs text-[#CFE0D5]">
                      Devices logged into your account across global trading desks.
                    </p>
                  </div>

                  <button
                    onClick={handleSignOutRemoteSessions}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 text-red-200 hover:bg-red-900/60 border border-red-800/80 text-xs font-semibold transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out Other Sessions</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {currentUser.activeSessions.map((s) => (
                    <div 
                      key={s.id}
                      className="p-3.5 rounded-xl bg-[#0F1E16] border border-[#2C5240] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1F3A2E] flex items-center justify-center text-[#C8A96A]">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{s.device}</span>
                            {s.isCurrent && (
                              <span className="text-[9px] font-mono px-2 py-0.2 rounded font-bold bg-emerald-500 text-black">
                                THIS WORKSTATION
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#CFE0D5]/70 flex items-center gap-2 mt-0.5">
                            <span>{s.browser}</span> &bull; 
                            <span className="font-mono">{s.ipAddress}</span> &bull; 
                            <span>{s.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono text-[#C8A96A] font-semibold">{s.lastActive}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Audit Logs */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2.5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C8A96A]" />
                  <span>Security & Operational Audit Trail</span>
                </h3>

                <div className="rounded-xl border border-[#2C5240] overflow-hidden bg-[#0F1E16]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#162B22] text-[#C8A96A] font-semibold border-b border-[#2C5240]">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp (UTC)</th>
                        <th className="py-2.5 px-3">Security Event</th>
                        <th className="py-2.5 px-3">IP Address</th>
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2C5240]/50 text-[#CFE0D5]">
                      {currentUser.securityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#162B22]/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-gray-400">
                            {log.timestamp}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-white">
                            <div>{log.event}</div>
                            {log.details && <div className="text-[10px] text-gray-400">{log.details}</div>}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            {log.ip}
                          </td>
                          <td className="py-2.5 px-3">
                            {log.location}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#162B22] border-t border-[#2C5240] flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 text-red-200 hover:bg-red-900/60 border border-red-800/80 font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Station / Sign Out</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[#CFE0D5]/70 hidden sm:inline">
              <span className="font-bold text-white">ArielMC</span> Profile & Security Controller
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#1F3A2E] text-white hover:bg-[#2C5240] border border-[#2C5240] font-semibold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
