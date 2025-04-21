import React, { useState } from 'react';
import { Shield, Bell, Smartphone, CreditCard, Eye, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const {
    user,
    logout,
    changePassword,
    setup2FA,
    verify2FA,
    disable2FA,
  } = useAuth();

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');

  // Change Password modal
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Two‑Factor Auth modal
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [twoFAErr, setTwoFAErr] = useState<string | null>(null);
  const [twoFALoading, setTwoFALoading] = useState(false);

  if (!user) return null;

  const handlePwdSubmit = async () => {
    if (newPass !== confirmPass) {
      setPwdError("Passwords don't match");
      return;
    }
    setPwdError(null);
    setPwdLoading(true);
    try {
      await changePassword(oldPass, newPass);
      setShowPwdModal(false);
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPwdError(err.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleStart2FA = async () => {
    setTwoFAErr(null);
    setTwoFALoading(true);
    try {
      await setup2FA(phone);
      setTwoFAStep(2);
    } catch (err: any) {
      setTwoFAErr(err.message || 'Failed to send code');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    setTwoFAErr(null);
    setTwoFALoading(true);
    try {
      await verify2FA(code);
      setShow2FAModal(false);
      setTwoFAStep(1);
      setPhone('');
      setCode('');
    } catch (err: any) {
      setTwoFAErr(err.message || 'Invalid code');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setTwoFALoading(true);
    try {
      await disable2FA();
      setShow2FAModal(false);
    } finally {
      setTwoFALoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Back
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Security Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-500" /> Security Settings
              </h2>
              <div className="space-y-4">
                {/* Change Password */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
                  <p className="text-sm text-gray-500 mb-3">Keep your account secure with a strong password</p>
                  <button
                    onClick={() => setShowPwdModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Lock className="h-4 w-4 mr-2" /> Change Password
                  </button>
                </div>

                {/* Two‑Factor Authentication */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Two‑Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {user.twoFactorEnabled
                      ? '2FA is currently enabled on your account.'
                      : 'Add an extra layer of security to your account.'}
                  </p>
                  <button
                    onClick={() => setShow2FAModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    {user.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-blue-500" /> Notification Settings
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Email Notification Frequency</h3>
                <p className="text-sm text-gray-500 mb-3">
                  How often would you like to receive email notifications about your upcoming dues?
                </p>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>3 days before due date</option>
                  <option>Only on due date</option>
                  <option>Never</option>
                </select>
              </div>
            </div>

            {/* Card Display Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-500" /> Card Display Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Show card numbers</h3>
                    <p className="text-sm text-gray-500">Display full card numbers instead of masked numbers</p>
                  </div>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Eye className="h-4 w-4 mr-1" /> Show
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Default card sorting</h3>
                    <p className="text-sm text-gray-500">Choose how your cards are sorted by default</p>
                  </div>
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm">
                    <option>Due date (earliest first)</option>
                    <option>Amount due (highest first)</option>
                    <option>Bank name (A‑Z)</option>
                    <option>Card name (A‑Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Account Management</h2>
              <div className="space-y-4">
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-25"></div>
            <div className="bg-white rounded-lg shadow-xl sm:max-w-md w-full p-6 z-10">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              {pwdError && <p className="text-sm text-red-600 mb-2">{pwdError}</p>}
              <input
                type="password"
                placeholder="Current password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full mb-3 px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full mb-3 px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowPwdModal(false)}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePwdSubmit}
                  disabled={pwdLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {pwdLoading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two‑Factor Auth Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-25"></div>
            <div className="bg-white rounded-lg shadow-xl sm:max-w-md w-full p-6 z-10">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {user.twoFactorEnabled ? 'Manage Two‑Factor Auth' : 'Enable Two‑Factor Auth'}
              </h3>

              {twoFAStep === 1 ? (
                <>
                  {twoFAErr && <p className="text-sm text-red-600 mb-2">{twoFAErr}</p>}
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded"
                  />
                  <div className="flex justify-end space-x-2">
                    {user.twoFactorEnabled && (
                      <button
                        onClick={handleDisable2FA}
                        disabled={twoFALoading}
                        className="px-4 py-2 border rounded text-red-600"
                      >
                        {twoFALoading ? '…' : 'Disable 2FA'}
                      </button>
                    )}
                    <button
                      onClick={handleStart2FA}
                      disabled={twoFALoading || !phone}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      {twoFALoading ? 'Sending…' : 'Send Code'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {twoFAErr && <p className="text-sm text-red-600 mb-2">{twoFAErr}</p>}
                  <input
                    type="text"
                    placeholder="Verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => { setTwoFAStep(1); setTwoFAErr(null); }}
                      disabled={twoFALoading}
                      className="px-4 py-2 border rounded text-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleVerify2FA}
                      disabled={twoFALoading || !code}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      {twoFALoading ? 'Verifying…' : 'Verify'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Lock className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Account
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    <label htmlFor="confirm-email" className="block text-sm font-medium text-gray-700 mt-4">
                      Type your email to confirm
                    </label>
                    <input
                      id="confirm-email"
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder={user.email}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  disabled={confirmEmail !== user.email}
                  onClick={() => { setShowDeleteModal(false); logout(); }}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;



// import React, { useState } from 'react';
// import {
//   Shield,
//   Bell,
//   Smartphone,
//   CreditCard,
//   Eye,
//   Lock,
//   ArrowLeft,
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const SettingsPage: React.FC = () => {
//   const {
//     user,
//     logout,
//     changePassword,
//     setup2FA,
//     verify2FA,
//     disable2FA,
//   } = useAuth();

//   // delete account (you already have)
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [confirmEmail, setConfirmEmail] = useState('');

//   // change password
//   const [showPwdModal, setShowPwdModal] = useState(false);
//   const [oldPass, setOldPass] = useState('');
//   const [newPass, setNewPass] = useState('');
//   const [confirmPass, setConfirmPass] = useState('');
//   const [pwdError, setPwdError] = useState<string | null>(null);
//   const [pwdLoading, setPwdLoading] = useState(false);

//   // two‑factor auth
//   const [show2FAModal, setShow2FAModal] = useState(false);
//   const [twoFAStep, setTwoFAStep] = useState<1 | 2>(1);
//   const [phone, setPhone] = useState('');
//   const [code, setCode] = useState('');
//   const [twoFAErr, setTwoFAErr] = useState<string | null>(null);
//   const [twoFALoading, setTwoFALoading] = useState(false);

//   if (!user) return null;

//   const handlePwdSubmit = async () => {
//     if (newPass !== confirmPass) {
//       setPwdError("Passwords don't match");
//       return;
//     }
//     setPwdError(null);
//     setPwdLoading(true);
//     try {
//       await changePassword(oldPass, newPass);
//       setShowPwdModal(false);
//       // clear
//       setOldPass('');
//       setNewPass('');
//       setConfirmPass('');
//     } catch (err: any) {
//       setPwdError(err.message || 'Failed to change password');
//     } finally {
//       setPwdLoading(false);
//     }
//   };

//   const handleStart2FA = async () => {
//     setTwoFAErr(null);
//     setTwoFALoading(true);
//     try {
//       await setup2FA(phone);
//       setTwoFAStep(2);
//     } catch (err: any) {
//       setTwoFAErr(err.message || 'Failed to send code');
//     } finally {
//       setTwoFALoading(false);
//     }
//   };

//   const handleVerify2FA = async () => {
//     setTwoFAErr(null);
//     setTwoFALoading(true);
//     try {
//       await verify2FA(code);
//       setShow2FAModal(false);
//       setTwoFAStep(1);
//       setPhone('');
//       setCode('');
//     } catch (err: any) {
//       setTwoFAErr(err.message || 'Invalid code');
//     } finally {
//       setTwoFALoading(false);
//     }
//   };

//   const handleDisable2FA = async () => {
//     setTwoFALoading(true);
//     try {
//       await disable2FA();
//       setShow2FAModal(false);
//     } catch {
//     } finally {
//       setTwoFALoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen pt-16">
//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {/* … your existing header & sections up to Security Settings … */}

//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
//             <p className="text-gray-600 mt-1">
//               Manage your account settings and preferences
//             </p>
//           </div>
//           <div className="p-6 space-y-6">

//             {/* Security Settings */}
//             <div>
//               <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                 <Shield className="mr-2 h-5 w-5 text-blue-500" />
//                 Security Settings
//               </h2>
//               <div className="space-y-4">

//                 {/* Change Password */}
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h3 className="font-medium text-gray-900 mb-2">
//                     Change Password
//                   </h3>
//                   <p className="text-sm text-gray-500 mb-3">
//                     Keep your account secure with a strong password
//                   </p>
//                   <button
//                     onClick={() => setShowPwdModal(true)}
//                     className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     <Lock className="h-4 w-4 mr-2" />
//                     Change Password
//                   </button>
//                 </div>

//                 {/* Two‑Factor Authentication */}
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h3 className="font-medium text-gray-900 mb-2">
//                     Two‑Factor Authentication
//                   </h3>
//                   <p className="text-sm text-gray-500 mb-3">
//                     {user.twoFactorEnabled
//                       ? '2FA is currently enabled on your account.'
//                       : 'Add an extra layer of security to your account.'}
//                   </p>
//                   <button
//                     onClick={() => setShow2FAModal(true)}
//                     className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                   >
//                     <Smartphone className="h-4 w-4 mr-2" />
//                     {user.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* … rest of your other setting sections … */}

//           </div>
//         </div>
//       </div>

//       {/* ——— Change Password Modal ——— */}
//       {showPwdModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4">
//             <div className="fixed inset-0 bg-black opacity-25"></div>
//             <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-md w-full p-6 z-10">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Change Password
//               </h3>
//               {pwdError && (
//                 <p className="text-sm text-red-600 mb-2">{pwdError}</p>
//               )}
//               <div className="space-y-4">
//                 <input
//                   type="password"
//                   placeholder="Current password"
//                   value={oldPass}
//                   onChange={(e) => setOldPass(e.target.value)}
//                   className="w-full px-3 py-2 border rounded"
//                 />
//                 <input
//                   type="password"
//                   placeholder="New password"
//                   value={newPass}
//                   onChange={(e) => setNewPass(e.target.value)}
//                   className="w-full px-3 py-2 border rounded"
//                 />
//                 <input
//                   type="password"
//                   placeholder="Confirm new password"
//                   value={confirmPass}
//                   onChange={(e) => setConfirmPass(e.target.value)}
//                   className="w-full px-3 py-2 border rounded"
//                 />
//               </div>
//               <div className="mt-6 flex justify-end space-x-2">
//                 <button
//                   onClick={() => setShowPwdModal(false)}
//                   className="px-4 py-2 border rounded text-gray-700"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handlePwdSubmit}
//                   disabled={pwdLoading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//                 >
//                   {pwdLoading ? 'Saving…' : 'Save'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ——— 2FA Modal ——— */}
//       {show2FAModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4">
//             <div className="fixed inset-0 bg-black opacity-25"></div>
//             <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-md w-full p-6 z-10">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 {user.twoFactorEnabled
//                   ? 'Manage Two‑Factor Auth'
//                   : 'Enable Two‑Factor Auth'}
//               </h3>

//               {twoFAStep === 1 ? (
//                 <>
//                   {twoFAErr && (
//                     <p className="text-sm text-red-600 mb-2">{twoFAErr}</p>
//                   )}
//                   <input
//                     type="tel"
//                     placeholder="Phone number (e.g. +1 555‑1234)"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="w-full px-3 py-2 border rounded mb-4"
//                   />
//                   <div className="flex justify-end space-x-2">
//                     {user.twoFactorEnabled && (
//                       <button
//                         onClick={handleDisable2FA}
//                         disabled={twoFALoading}
//                         className="px-4 py-2 border rounded text-red-600"
//                       >
//                         {twoFALoading ? '…' : 'Disable 2FA'}
//                       </button>
//                     )}
//                     <button
//                       onClick={handleStart2FA}
//                       disabled={twoFALoading || !phone}
//                       className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//                     >
//                       {twoFALoading ? 'Sending…' : 'Send Code'}
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {twoFAErr && (
//                     <p className="text-sm text-red-600 mb-2">{twoFAErr}</p>
//                   )}
//                   <input
//                     type="text"
//                     placeholder="Enter verification code"
//                     value={code}
//                     onChange={(e) => setCode(e.target.value)}
//                     className="w-full px-3 py-2 border rounded mb-4"
//                   />
//                   <div className="flex justify-end space-x-2">
//                     <button
//                       onClick={() => {
//                         setTwoFAStep(1);
//                         setTwoFAErr(null);
//                       }}
//                       disabled={twoFALoading}
//                       className="px-4 py-2 border rounded text-gray-700"
//                     >
//                       Back
//                     </button>
//                     <button
//                       onClick={handleVerify2FA}
//                       disabled={twoFALoading || !code}
//                       className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//                     >
//                       {twoFALoading ? 'Verifying…' : 'Verify'}
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//         {showDeleteModal && (
//         <div className="fixed inset-0 overflow-y-auto z-50">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>

//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                     <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                     </svg>
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
//                       Delete account
//                     </h3>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500">
//                         Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
//                       </p>
//                       <div className="mt-4">
//                         <label htmlFor="confirm-email" className="block text-sm font-medium text-gray-700">
//                           Please type your email to confirm
//                         </label>
//                         <input
//                           type="email"
//                           id="confirm-email"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                           placeholder={user.email}
//                           value={confirmEmail}
//                           onChange={(e) => setConfirmEmail(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
//                     confirmEmail !== user.email ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                   disabled={confirmEmail !== user.email}
//                   onClick={() => {
//                     // In a real app, this would delete the account
//                     setShowDeleteModal(false);
//                     logout();
//                   }}
//                 >
//                   Delete
//                 </button>
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={() => setShowDeleteModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SettingsPage;
