
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Video, Upload, X, Loader2 } from 'lucide-react';
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

    setSelectedFiles(prev => [...prev, ...mediaFiles]);
    onMediaSelect([...selectedFiles, ...mediaFiles]);
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
        description: `已成功上传 ${uploadedUrls.length} 个文件`,
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
      <div className="flex items-center space-x-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="flex items-center space-x-1"
        >
          <Image className="w-4 h-4" />
          <span>照片</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="flex items-center space-x-1"
        >
          <Video className="w-4 h-4" />
          <span>视频</span>
        </Button>

        {selectedFiles.length > 0 && (
          <Button
            type="button"
            size="sm"
            onClick={uploadFiles}
            disabled={disabled || isUploading}
            className="flex items-center space-x-1"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>发送 ({selectedFiles.length})</span>
          </Button>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map((mediaFile, index) => (
            <div key={index} className="relative">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                {mediaFile.type === 'image' ? (
                  <img
                    src={mediaFile.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={mediaFile.preview}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
