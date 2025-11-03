// components/assessment/AudioQuestion.tsx
'use client';

import { useState, useRef } from 'react';
import { Question } from '../../types';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface AudioQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export default function AudioQuestion({ question, onAnswer }: AudioQuestionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        onAnswer(audioUrl); // Store the audio URL as the answer
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6 border">
        <h4 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h4>
        
        {question.audioPrompt && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-blue-700 italic">{question.audioPrompt}</p>
          </div>
        )}

        <div className="space-y-4">
          {!audioUrl ? (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Mic size={20} />
              <span>Start Recording</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayback}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isPlaying ? 'Pause' : 'Play'} Recording</span>
                </button>
                <button
                  onClick={startRecording}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Mic size={16} />
                  <span>Re-record</span>
                </button>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="w-full"
              />
            </div>
          )}

          {isRecording && (
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording...</span>
              <button
                onClick={stopRecording}
                className="ml-auto flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <Square size={14} />
                <span>Stop</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {audioUrl && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-green-700 font-medium">✓ Your response has been recorded</p>
          <p className="text-green-600 text-sm mt-1">
            You can play it back to review or re-record if needed.
          </p>
        </div>
      )}
    </div>
  );
}