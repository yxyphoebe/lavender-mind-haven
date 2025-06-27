
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, X, Loader2, Image, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface MediaUploaderProps {
  onMediaSelect: (files: MediaFile[]) => void;
  onUploadComplete: (urls: string[]) => void;
  disabled?: boolean;
}

const MediaUploader = ({ onMediaSelect, onUploadComplete, disabled }: MediaUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const mediaFiles: MediaFile[] = [];

    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const preview = URL.createObjectURL(file);
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        mediaFiles.push({ file, preview, type });
      }
    });

    const newFiles = [...selectedFiles, ...mediaFiles];
    setSelectedFiles(newFiles);
    onMediaSelect(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onMediaSelect(newFiles);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const mediaFile of selectedFiles) {
        const fileExt = mediaFile.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from('chat-media')
          .upload(filePath, mediaFile.file);

        if (error) {
          console.error('Upload error:', error);
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('chat-media')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      onUploadComplete(uploadedUrls);
      setSelectedFiles([]);
      
      toast({
        title: "上传成功",
        description: `成功上传 ${uploadedUrls.length} 个文件`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "上传失败",
        description: "文件上传失败，请重试",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-full px-4 py-2 transition-all duration-300"
        >
          <Paperclip className="w-4 h-4" />
          <span>添加文件</span>
        </Button>

        {selectedFiles.length > 0 && (
          <Button
            type="button"
            size="sm"
            onClick={uploadFiles}
            disabled={disabled || isUploading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-4 py-2 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isUploading ? '上传中...' : `发送 ${selectedFiles.length} 个文件`}
          </Button>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {selectedFiles.map((mediaFile, index) => (
              <div key={index} className="relative group">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm border border-white/50">
                  {mediaFile.type === 'image' ? (
                    <>
                      <img
                        src={mediaFile.preview}
                        alt="预览"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Video className="w-8 h-8 text-slate-500" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </>
                  )}
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-all duration-200 hover:scale-110"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
