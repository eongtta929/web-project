import { supabase } from './supabase';

// 현재 로그인한 사용자가 어드민인지 확인
export async function isAdmin(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// 현재 세션 확인
export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// 어드민 권한 확인
export async function checkAdminAuth() {
  const user = await getCurrentUser();
  
  if (!user || !user.email) {
    return { isAuthenticated: false, isAdmin: false, user: null };
  }

  const adminStatus = await isAdmin(user.email);

  return {
    isAuthenticated: true,
    isAdmin: adminStatus,
    user
  };
}

// 로그인
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // 어드민 권한 확인
    if (data.user && data.user.email) {
      const adminStatus = await isAdmin(data.user.email);
      if (!adminStatus) {
        await supabase.auth.signOut();
        throw new Error('어드민 권한이 없습니다.');
      }
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 로그아웃
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 회원가입 (어드민 테이블에 등록된 이메일만 가능)
export async function signUp(email: string, password: string) {
  try {
    // 먼저 어드민 테이블에 있는지 확인
    const adminStatus = await isAdmin(email);
    if (!adminStatus) {
      throw new Error('등록되지 않은 이메일입니다. 관리자에게 문의하세요.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

