import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus, Video, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';


interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface EmbeddedChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (mediaUrls?: string[]) => void;
  isTyping: boolean;
}

const EmbeddedChatInput = ({ inputValue, setInputValue, onSendMessage, isTyping }: EmbeddedChatInputProps) => {
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<MediaFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = isMobile ? 80 : 100; // Smaller max height for embedded
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [inputValue, isMobile]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() || selectedMediaFiles.length > 0) {
        onSendMessage();
      }
    }
  };


  const handleMediaSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const mediaFiles: MediaFile[] = [];
      files.forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const preview = URL.createObjectURL(file);
          const type = file.type.startsWith('image/') ? 'image' : 'video';
          mediaFiles.push({ file, preview, type });
        }
      });
      const newFiles = [...selectedMediaFiles, ...mediaFiles];
      setSelectedMediaFiles(newFiles);
    };
    input.click();
  };

  const handleUploadAndSend = async () => {
    const uploadedUrls: string[] = [];
    for (const mediaFile of selectedMediaFiles) {
      const fileExt = mediaFile.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('chat-media')
        .upload(filePath, mediaFile.file);

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('chat-media')
          .getPublicUrl(data.path);
        uploadedUrls.push(publicUrl);
      } else {
        console.error('Upload error:', error);
      }
    }
    setSelectedMediaFiles([]);
    onSendMessage(uploadedUrls);
  };

  return (
    <div className="p-3">
      {/* Media Files Preview */}
      {selectedMediaFiles.length > 0 && (
        <div className="mb-3">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <div className="flex flex-wrap gap-2">
              {selectedMediaFiles.map((mediaFile, index) => (
                <div key={index} className="relative group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30">
                    {mediaFile.type === 'image' ? (
                      <img
                        src={mediaFile.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Video className="w-6 h-6 text-white/80" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const newFiles = selectedMediaFiles.filter((_, i) => i !== index);
                      setSelectedMediaFiles(newFiles);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-400/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs backdrop-blur-sm border border-white/30 transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-3">
              <Button
                type="button"
                size="sm"
                onClick={handleUploadAndSend}
                disabled={isTyping}
                className="bg-white/25 hover:bg-white/35 text-white rounded-full px-4 py-1.5 text-sm backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-105"
              >
                Send {selectedMediaFiles.length} file{selectedMediaFiles.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Input Box */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-2">
        {/* Textarea field */}
        <div className="mb-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-white/60 px-0 py-1 resize-none min-h-[1.5rem] max-h-none overflow-y-auto text-white"
            disabled={isTyping}
            style={{ height: 'auto' }}
          />
        </div>
        
        {/* Button row */}
        <div className="flex items-center justify-between">
          {/* Plus button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleMediaSelect}
            disabled={isTyping}
            className="w-8 h-8 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 hover:scale-105 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          {/* Send button */}
          <Button
            onClick={() => onSendMessage()}
            disabled={(!inputValue.trim() && selectedMediaFiles.length === 0) || isTyping}
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white rounded-full px-3 py-1.5 h-8 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedChatInput;