import React, { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Modal from '@/components/common/Modal';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  department?: string;
  title?: string;
  bio?: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First check if we have a valid session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session) {
          navigate('/login');
          return;
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError('プロフィールの読み込みに失敗しました');
        console.error(err);
        if (
          err instanceof Error &&
          (err.message === 'User not found' || err.message === 'Auth session missing!')
        ) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadProfile();
    }
  }, [isOpen, navigate]);

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { error } = await supabase.from('users').upsert({
        ...profile,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      onClose();
    } catch (err) {
      setError('プロフィールの保存に失敗しました');
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setIsSaving(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      setProfile(prev => (prev ? { ...prev, avatar_url: publicUrl } : null));
    } catch (err) {
      setError('アバターの更新に失敗しました');
      if (err instanceof Error) {
        console.error(err);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="プロフィール設定"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={isSaving}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            保存
          </button>
        </>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-red-600 dark:text-red-400 text-center py-4">{error}</div>
      ) : (
        profile && (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      width="96"
                      height="96"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-medium text-gray-400">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-avatar"
                  className="absolute bottom-0 right-0 p-1 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Camera size={16} />
                  <input
                    id="profile-avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isSaving}
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="profile-name"
                >
                  名前
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="profile-email"
                >
                  メールアドレス
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="profile-department"
                >
                  部署
                </label>
                <input
                  id="profile-department"
                  type="text"
                  value={profile.department || ''}
                  onChange={e => setProfile({ ...profile, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="profile-title"
                >
                  役職
                </label>
                <input
                  id="profile-title"
                  type="text"
                  value={profile.title || ''}
                  onChange={e => setProfile({ ...profile, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="profile-bio"
                >
                  自己紹介
                </label>
                <textarea
                  id="profile-bio"
                  value={profile.bio || ''}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        )
      )}
    </Modal>
  );
};

export default ProfileModal;
