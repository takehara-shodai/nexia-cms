import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  tenant_id?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function fetchUser() {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!ignore) {
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email ?? "",
            tenant_id: data.user.user_metadata?.tenant_id || data.user.app_metadata?.tenant_id,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    }
    fetchUser();
    return () => { ignore = true; };
  }, []);

  return { user, loading };
} 