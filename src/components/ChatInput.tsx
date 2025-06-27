
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, Video, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import VoiceRecorder from './VoiceRecorder';

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (mediaUrls?: string[]) => void;
  isTyping: boolean;
}

const ChatInput = ({ inputValue, setInputValue, onSendMessage, isTyping }: ChatInputProps) => {
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<MediaFile[]>([]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleVoiceTranscription = (text: string) => {
    console.log('Voice transcription received:', text);
    setInputValue(text);
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
    <div className="relative z-10 bg-white/70 backdrop-blur-xl border-t border-white/30 px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Media Files Preview */}
        {selectedMediaFiles.length > 0 && (
          <div className="mb-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-sm">
              <div className="flex flex-wrap gap-3">
                {selectedMediaFiles.map((mediaFile, index) => (
                  <div key={index} className="relative group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm border border-white/50">
                      {mediaFile.type === 'image' ? (
                        <img
                          src={mediaFile.preview}
                          alt="预览"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <Video className="w-8 h-8 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const newFiles = selectedMediaFiles.filter((_, i) => i !== index);
                        setSelectedMediaFiles(newFiles);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-400/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-4">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUploadAndSend}
                  disabled={isTyping}
                  className="bg-gradient-to-r from-blue-400/80 to-purple-400/80 hover:from-blue-500/80 hover:to-purple-500/80 text-white rounded-full px-6 py-2 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm"
                >
                  发送 {selectedMediaFiles.length} 个文件
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Input Box */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-2">
          <div className="flex items-end space-x-3 px-4 py-2">
            {/* Plus button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleMediaSelect}
              disabled={isTyping}
              className="w-9 h-9 rounded-full hover:bg-white/50 text-slate-500 hover:text-slate-700 transition-all duration-300 hover:scale-105 flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
            
            {/* Input field */}
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-slate-400 px-0 py-2"
                disabled={isTyping}
              />
            </div>
            
            {/* Voice recorder and send button */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <VoiceRecorder 
                onTranscriptionComplete={handleVoiceTranscription}
                disabled={isTyping}
              />
              <Button
                onClick={() => onSendMessage()}
                disabled={(!inputValue.trim() && selectedMediaFiles.length === 0) || isTyping}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-4 py-2 h-9 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
