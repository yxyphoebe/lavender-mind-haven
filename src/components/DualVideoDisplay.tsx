
import React, { useRef, useEffect, useState } from 'react';
import { VideoOff, MicOff, Loader2 } from 'lucide-react';

interface DualVideoDisplayProps {
  localStream: MediaStream | null;
  tavusVideoUrl: string | null;
  isVideoOn: boolean;
  isMicOn: boolean;
  isConnected: boolean;
  onAudioData?: (audioData: Float32Array) => void;
}

const DualVideoDisplay: React.FC<DualVideoDisplayProps> = ({
  localStream,
  tavusVideoUrl,
  isVideoOn,
  isMicOn,
  isConnected,
  onAudioData
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLIFrameElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isTavusLoading, setIsTavusLoading] = useState(true);

  // 设置本地视频流
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      
      // 设置音频分析
      if (onAudioData && !audioContextRef.current) {
        setupAudioAnalysis(localStream);
      }
    }
  }, [localStream, onAudioData]);

  // 控制本地视频和音频
  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      
      if (videoTrack) videoTrack.enabled = isVideoOn;
      if (audioTrack) audioTrack.enabled = isMicOn;
    }
  }, [localStream, isVideoOn, isMicOn]);

  // 设置音频分析
  const setupAudioAnalysis = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 2048;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const processAudio = () => {
        if (analyserRef.current && onAudioData) {
          const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getFloatFrequencyData(dataArray);
          onAudioData(dataArray);
        }
        requestAnimationFrame(processAudio);
      };
      
      processAudio();
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  };

  // 清理资源
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Tavus iframe加载完成处理
  const handleTavusLoad = () => {
    setIsTavusLoading(false);
    console.log('Tavus video loaded successfully');
  };

  return (
    <div className="w-full h-full flex">
      {/* 用户本地视频 - 左侧 */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-50 to-white">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isVideoOn ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* 本地视频关闭占位符 */}
        {!isVideoOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mb-3 mx-auto">
                <VideoOff className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-600 font-medium">摄像头已关闭</p>
            </div>
          </div>
        )}

        {/* 用户静音指示器 */}
        {!isMicOn && (
          <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <MicOff className="w-3 h-3" />
            <span>静音</span>
          </div>
        )}

        {/* 用户标签 */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
          你
        </div>
      </div>

      {/* 分隔线 */}
      <div className="w-px bg-white/60"></div>

      {/* Tavus AI视频 - 右侧 */}
      <div className="flex-1 relative bg-gradient-to-br from-violet-50 to-white">
        {tavusVideoUrl && isConnected ? (
          <>
            <iframe
              ref={remoteVideoRef}
              src={tavusVideoUrl}
              className="w-full h-full border-0"
              allow="camera; microphone; autoplay; encrypted-media; fullscreen"
              onLoad={handleTavusLoad}
            />
            
            {/* Tavus加载指示器 */}
            {isTavusLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-3 mx-auto" />
                  <p className="text-violet-600 font-medium">正在连接AI助手...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          // Tavus未连接占位符
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-50 to-violet-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-200 rounded-full flex items-center justify-center mb-3 mx-auto">
                <VideoOff className="w-8 h-8 text-violet-600" />
              </div>
              <p className="text-violet-600 font-medium">等待AI助手连接...</p>
            </div>
          </div>
        )}

        {/* AI助手标签 */}
        <div className="absolute bottom-4 right-4 bg-violet-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          AI助手
        </div>
      </div>
    </div>
  );
};

export default DualVideoDisplay;
