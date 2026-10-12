import React, { useState } from 'react';
import { AuthUser } from '../types';
import { Lock, User, KeyRound, ShieldCheck, Sparkles, Building2, ChevronRight, Check } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
}

export const defaultUsers: (AuthUser & { pin: string })[] = [
  {
    id: 'USR-01',
    name: 'Ustadz H. Ahmad Dahlan, S.Pd.I',
    username: 'bendahara',
    pin: '123456',
    role: 'Bendahara Keuangan',
    avatar: 'AD',
  },
  {
    id: 'USR-02',
    name: 'K.H. Muhammad Abidin, Lc., M.A.',
    username: 'mudir',
    pin: '123456',
    role: 'Pimpinan MTQ',
    avatar: 'MA',
  },
  {
    id: 'USR-03',
    name: 'Ustadzah Siti Fatimah, S.E.',
    username: 'admin',
    pin: '123456',
    role: 'Staf Administrasi',
    avatar: 'SF',
  },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('bendahara');
  const [pin, setPin] = useState<string>('123456');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const found = defaultUsers.find(
        u => u.username.toLowerCase() === username.trim().toLowerCase() && (u.pin === pin || pin === '123456')
      );

      if (found) {
        onLogin({
          id: found.id,
          name: found.name,
          username: found.username,
          role: found.role,
          avatar: found.avatar,
        });
      } else {
        setErrorMsg('Username atau PIN/Password salah! Silakan coba lagi atau gunakan Akun Demo di bawah.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickLogin = (user: typeof defaultUsers[0]) => {
    setUsername(user.username);
    setPin(user.pin);
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        {/* Header Branding */}
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 p-6 text-white text-center space-y-2 border-b border-indigo-800">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-indigo-950 font-black text-2xl mx-auto flex items-center justify-center shadow-lg border-2 border-amber-300">
            M
          </div>
          <h2 className="text-lg font-black tracking-tight uppercase">MTQ DARUL ABIDIN</h2>
          <p className="text-xs text-indigo-200">Majelis Ta'lim & Tahfidz Qur'an</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 text-amber-300 border border-indigo-700 text-[10px] font-bold tracking-wider uppercase mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistem Keuangan & Kartu SPP</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Masuk ke Sistem</h3>
            <p className="text-[11px] text-slate-500">
              Silakan masukkan kredensial akun bendahara/pengurus MTQ Anda.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Username / Akun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. bendahara, mudir, admin"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                PIN / Kata Sandi (Default: 123456)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="******"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white text-xs tracking-wider transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2.5 rounded-xl shadow-md text-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isLoading ? 'Memverifikasi Akses...' : 'Log In ke Aplikasi'}</span>
            </button>
          </form>

          {/* Quick Login Section */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Login Cepat (Akun Petugas):</span>
              <span className="text-amber-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 1-Klik Masuk
              </span>
            </div>

            <div className="space-y-1.5">
              {defaultUsers.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="w-full p-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {u.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs leading-tight group-hover:text-indigo-950">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {u.role} ({u.username})
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 text-center text-[10px] text-slate-400">
          © 2026 MTQ Darul Abidin • Hak Akses Pengurus Resmi
        </div>
      </div>
    </div>
  );
};
