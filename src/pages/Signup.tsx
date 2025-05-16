import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // パスワード要件のチェック
  const checkPasswordRequirements = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };

    // 8文字以上は必須、その他の条件のうち3つ以上を満たす必要がある
    const optionalRequirements = [
      requirements.hasUpperCase,
      requirements.hasLowerCase,
      requirements.hasNumber,
      requirements.hasSpecialChar,
    ];

    const metOptionalRequirements = optionalRequirements.filter(Boolean).length;

    return {
      ...requirements,
      isValid: requirements.minLength && metOptionalRequirements >= 3,
      metOptionalCount: metOptionalRequirements,
    };
  };

  // パスワード強度の計算
  const calculatePasswordStrength = (password: string) => {
    const requirements = checkPasswordRequirements(password);
    
    if (!requirements.minLength) {
      return {
        score: 0,
        feedback: 'とても弱い',
        color: 'bg-red-500',
        requirements,
      };
    }

    const score = Math.min(100, (requirements.metOptionalCount / 4) * 100);
    
    let feedback;
    if (score <= 25) feedback = '弱い';
    else if (score <= 50) feedback = '普通';
    else if (score <= 75) feedback = '強い';
    else feedback = 'とても強い';

    return {
      score,
      feedback,
      color: score < 50 ? 'bg-red-500' : score < 75 ? 'bg-yellow-500' : 'bg-green-500',
      requirements,
    };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const validateForm = () => {
    if (!email) {
      setError('メールアドレスを入力してください');
      return false;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('有効なメールアドレスを入力してください');
      return false;
    }

    if (!password) {
      setError('パスワードを入力してください');
      return false;
    }

    const requirements = checkPasswordRequirements(password);
    if (!requirements.isValid) {
      setError('パスワードは8文字以上で、大文字・小文字・数字・特殊文字のうち3つ以上を含む必要があります');
      return false;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      navigate('/login', { 
        state: { 
          message: 'アカウントを作成しました。ログインしてください。' 
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">V</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          アカウント作成
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          CMS.VAREAL.APPへようこそ
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                メールアドレス
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                パスワード
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      パスワード強度: {passwordStrength.feedback}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(passwordStrength.score)}%
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.score}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <p className="font-medium mb-1">パスワードの要件:</p>
                    <ul className="space-y-1">
                      <li className={passwordStrength.requirements.minLength ? 'text-green-500' : ''}>
                        • 8文字以上（必須）
                      </li>
                      <li className={passwordStrength.requirements.hasUpperCase ? 'text-green-500' : ''}>
                        • 大文字を含む
                      </li>
                      <li className={passwordStrength.requirements.hasLowerCase ? 'text-green-500' : ''}>
                        • 小文字を含む
                      </li>
                      <li className={passwordStrength.requirements.hasNumber ? 'text-green-500' : ''}>
                        • 数字を含む
                      </li>
                      <li className={passwordStrength.requirements.hasSpecialChar ? 'text-green-500' : ''}>
                        • 特殊文字を含む
                      </li>
                    </ul>
                    <p className="mt-2">
                      ※ 上記のうち、8文字以上は必須です。その他の条件は3つ以上を満たす必要があります。
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                パスワード（確認）
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-1 text-sm">
                  {password === confirmPassword ? (
                    <span className="text-green-500">パスワードが一致しています</span>
                  ) : (
                    <span className="text-red-500">パスワードが一致していません</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn size={20} />
                {isLoading ? '作成中...' : 'アカウントを作成'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  すでにアカウントをお持ちの方
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ログイン
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;