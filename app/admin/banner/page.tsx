'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Banner {
  id: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newBanner, setNewBanner] = useState({
    linkUrl: '',
    file: null as File | null,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('event_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewBanner({ ...newBanner, file: e.target.files[0] });
    }
  };

  const handleUpload = async () => {
    if (!newBanner.file) {
      alert('이미지를 선택해주세요.');
      return;
    }

    setUploading(true);
    try {
      // 파일명 생성
      const fileExt = newBanner.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // Supabase Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, newBanner.file);

      if (uploadError) throw uploadError;

      // Public URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      // 데이터베이스에 배너 정보 저장
      const { error: insertError } = await supabase
        .from('event_banners')
        .insert([
          {
            image_url: publicUrl,
            link_url: newBanner.linkUrl || null,
            is_active: false,
          },
        ]);

      if (insertError) throw insertError;

      alert('배너가 업로드되었습니다!');
      setNewBanner({ linkUrl: '', file: null });
      loadBanners();
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`업로드 실패: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (bannerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('event_banners')
        .update({ is_active: !currentStatus })
        .eq('id', bannerId);

      if (error) throw error;
      loadBanners();
    } catch (error) {
      console.error('Toggle error:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const deleteBanner = async (bannerId: string, imageUrl: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      // Storage에서 이미지 삭제
      const path = imageUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('banners').remove([path]);

      // 데이터베이스에서 삭제
      const { error } = await supabase
        .from('event_banners')
        .delete()
        .eq('id', bannerId);

      if (error) throw error;
      loadBanners();
    } catch (error) {
      console.error('Delete error:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E9B84A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl text-gukbap-darkBrown">배너 관리</h1>
        <p className="text-gukbap-brown mt-1 text-lg">결과 화면에 표시될 이벤트 배너 관리</p>
      </div>

      {/* 배너 업로드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gukbap-cream rounded-3xl shadow-lg p-6 border-2 border-gukbap-darkBrown"
      >
        <h2 className="text-2xl text-gukbap-darkBrown mb-4">새 배너 업로드</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gukbap-brown mb-2">
              배너 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gukbap-brown rounded-2xl focus:ring-2 focus:ring-[#E9B84A] focus:border-[#E9B84A] bg-white"
            />
          </div>

          <div>
            <label className="block text-base font-bold text-gukbap-brown mb-2">
              링크 URL (선택사항)
            </label>
            <input
              type="url"
              value={newBanner.linkUrl}
              onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gukbap-brown rounded-2xl focus:ring-2 focus:ring-[#E9B84A] focus:border-[#E9B84A] bg-white"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !newBanner.file}
            className="px-6 py-3 bg-[#E9B84A] text-[#5C4A32] rounded-2xl text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {uploading ? '업로드 중...' : '배너 업로드'}
          </button>
        </div>
      </motion.div>

      {/* 배너 목록 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gukbap-cream rounded-3xl shadow-lg p-6 border-2 border-gukbap-darkBrown"
      >
        <h2 className="text-2xl text-gukbap-darkBrown mb-4">배너 목록</h2>
        
        {banners.length === 0 ? (
          <p className="text-gukbap-brown text-center py-8">등록된 배너가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="flex items-center gap-4 p-4 border-2 border-gukbap-brown rounded-2xl hover:bg-gukbap-ivory transition-colors bg-white"
              >
                {/* 배너 미리보기 */}
                <div className="relative w-48 h-24 bg-gukbap-ivory rounded-xl overflow-hidden flex-shrink-0 border border-gukbap-brown">
                  <img
                    src={banner.image_url}
                    alt="배너"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 배너 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        banner.is_active
                          ? 'bg-green-200 text-green-900'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {banner.is_active ? '활성' : '비활성'}
                    </span>
                  </div>
                  {banner.link_url && (
                    <p className="text-sm text-gukbap-brown truncate">
                      링크: {banner.link_url}
                    </p>
                  )}
                  <p className="text-xs text-gukbap-brown mt-1">
                    등록일: {new Date(banner.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(banner.id, banner.is_active)}
                    className={`px-4 py-2 rounded-2xl transition-colors shadow-md ${
                      banner.is_active
                        ? 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {banner.is_active ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id, banner.image_url)}
                    className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors shadow-md"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 안내 메시지 */}
      <div className="bg-blue-100 border-2 border-blue-400 rounded-2xl p-4">
        <p className="text-sm text-blue-900">
          <strong>참고:</strong> 활성화된 배너만 결과 화면에 표시됩니다. 여러 배너를 활성화하면 무작위로 하나가 표시됩니다.
        </p>
      </div>
    </div>
  );
}

