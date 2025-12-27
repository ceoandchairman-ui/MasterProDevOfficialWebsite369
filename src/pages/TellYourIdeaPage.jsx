import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadFile } from '@/integrations/Core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload, X, Phone, Mail, MessageCircle,
  Facebook, Instagram, Send, Smartphone,
  Mic, Square, Link, CheckCircle, AlertCircle,
  FileText, Video, ExternalLink, Play, Linkedin, MapPin } from
'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RECORDING_SECONDS = 60; // 1 minute

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function TellYourIdeaPage() {
  const [submissionItems, setSubmissionItems] = useState([]);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });

  const [textQuery, setTextQuery] = useState('');
  const [externalLink, setExternalLink] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const videoPreviewRef = useRef(null);

  const addItem = (item) => {
    setSubmissionItems((prev) => [...prev, { ...item, id: Date.now() + Math.random() }]);
    setError('');
  };

  const removeItem = (id) => {
    setSubmissionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddTextQuery = () => {
    if (!textQuery.trim()) return;
    addItem({ type: 'text', name: 'Quick Query', content: textQuery });
    setTextQuery('');
  };

  const handleAddExternalLink = () => {
    if (!externalLink.trim()) return;
    addItem({ type: 'link', name: 'External Link', content: externalLink });
    setExternalLink('');
  };

  const handleFileUpload = (files) => {
    setError('');
    const validFiles = Array.from(files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" is too large (max 5MB). Please use the 'Big File/Project' tab for larger files.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      validFiles.forEach((file) => {
        addItem({ type: 'file', name: file.name, content: file, size: file.size });
      });
    }
  };

  const startRecording = async (type) => {
    setError('');
    setRecordedBlob(null);
    setRecordingType(type);

    try {
      const stream = await navigator.mediaDevices.getUserMedia(type === 'audio' ? { audio: true } : { audio: true, video: true });
      if (type === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => chunks.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const mimeType = type === 'audio' ? 'audio/mp3' : 'video/mp4';
        const blob = new Blob(chunks, { type: mimeType });
        if (blob.size > MAX_FILE_SIZE) {
          setError(`Recording is too large (${formatFileSize(blob.size)}). Please keep it under 1 minute or 5MB.`);
          setRecordedBlob(null);
        } else {
          setRecordedBlob(blob);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      setError(`Failed to access ${type} device. Please check permissions.`);
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
  };

  const handleAddRecording = () => {
    if (!recordedBlob) return;
    const type = recordingType;
    addItem({ type, name: `${type.charAt(0).toUpperCase() + type.slice(1)} Note`, content: recordedBlob, size: recordedBlob.size });
    setRecordedBlob(null);
    setRecordingType(null);
    setRecordingTime(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (submissionItems.length === 0) {
      setError('Please add at least one item (query, file, recording, or link) to submit.');
      return;
    }
    if (!contactInfo.email.trim() && !contactInfo.phone.trim()) {
      setError('Please provide either an email or a phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedFileUrls = await Promise.all(
        submissionItems.
        filter((item) => ['file', 'audio', 'video'].includes(item.type)).
        map(async (item) => {
          const { file_url } = await UploadFile({ file: item.content });
          return { id: item.id, url: file_url, name: item.name, type: item.type };
        })
      );

      const textItems = submissionItems.filter((item) => item.type === 'text').map((item) => item.content);
      const linkItems = submissionItems.filter((item) => item.type === 'link').map((item) => item.content);

      const submissionData = {
        contactInfo,
        textQueries: textItems,
        externalLinks: linkItems,
        uploadedFiles: uploadedFileUrls,
        metadata: { submissionTime: new Date().toISOString() }
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Thanks! Your idea has been received 🎉 We're opening a chat to discuss it further.");

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openChatbotWithContext', { detail: submissionData }));
        setSuccess('');
        setSubmissionItems([]);
        setContactInfo({ name: '', email: '', phone: '' });
      }, 3000);

    } catch (err) {
      setError('An error occurred during submission. Please try again.');
      console.error(err);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-[60px] p-8 md:p-12 border-3 border-solid relative"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#5271ff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>

          <div className="absolute -top-6 left-12">
            <div
              className="bg-white border-2 border-solid px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-center gap-3"
              style={{ borderColor: '#5271ff', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}>

              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">💬</div>
              <h2 className="text-lg md:text-xl font-bold text-black">Tell Us Your Idea</h2>
            </div>
          </div>

          <section className="mt-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-[#FBBC05]">Share</span>{' '}
                <span className="text-[#4285F4]">Your</span>{' '}
                <span className="text-[#34A853]">Vision</span>
              </h1>
              <p className="text-xl text-gray-600">We're excited to hear about your project or challenge. Let's make it happen together!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <Tabs defaultValue="query" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                  <TabsTrigger value="query"><FileText className="w-4 h-4 mr-2" />Quick Query</TabsTrigger>
                  <TabsTrigger value="voice"><Mic className="w-4 h-4 mr-2" />Voice Note</TabsTrigger>
                  <TabsTrigger value="video"><Video className="w-4 h-4 mr-2" />Short Video</TabsTrigger>
                  <TabsTrigger value="docs"><Upload className="w-4 h-4 mr-2" />Documents</TabsTrigger>
                  <TabsTrigger value="link"><ExternalLink className="w-4 h-4 mr-2" />Big File/Project</TabsTrigger>
                </TabsList>

                <TabsContent value="query">
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-3 border-[#ffb400] rounded-xl space-y-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Share Your Idea or Challenge</label>
                    <Textarea placeholder="Type your idea, question, or challenge here..." value={textQuery} onChange={(e) => setTextQuery(e.target.value)} className="min-h-[120px] bg-white border-2 border-gray-300 focus:border-[#ffb400]" />
                    <Button type="button" onClick={handleAddTextQuery} disabled={!textQuery.trim()} className="w-full bg-[#5271ff] text-white hover:bg-[#00bf63] font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      ✓ Add Text to Submission
                    </Button>
                    {textQuery.trim() && <p className="text-xs text-gray-600">Ready to add this to your submission</p>}
                  </div>
                </TabsContent>

                <TabsContent value="voice">
                  <div className="p-4 bg-gray-50 rounded-lg text-center space-y-4">
                    {!isRecording && !recordedBlob && <Button type="button" onClick={() => startRecording('audio')}><Mic className="w-4 h-4 mr-2" />Record Voice Note (max 1 min)</Button>}
                    {isRecording && recordingType === 'audio' &&
                    <>
                        <Button type="button" variant="destructive" onClick={stopRecording}><Square className="w-4 h-4 mr-2" />Stop Recording</Button>
                        <p className="text-sm font-mono text-red-500">{recordingTime}s / {MAX_RECORDING_SECONDS}s</p>
                      </>
                    }
                    {recordedBlob && recordingType === 'audio' &&
                    <div className="space-y-2">
                        <audio src={URL.createObjectURL(recordedBlob)} controls className="w-full" />
                        <Button type="button" onClick={handleAddRecording}>Add Voice Note to Submission</Button>
                      </div>
                    }
                  </div>
                </TabsContent>

                <TabsContent value="video">
                  <div className="p-4 bg-gray-50 rounded-lg text-center space-y-4">
                     {!isRecording && !recordedBlob && <Button type="button" onClick={() => startRecording('video')}><Video className="w-4 h-4 mr-2" />Record Video (max 1 min)</Button>}
                     {isRecording && recordingType === 'video' &&
                    <>
                          <video ref={videoPreviewRef} autoPlay muted className="w-full rounded-md bg-black max-h-48"></video>
                          <Button type="button" variant="destructive" onClick={stopRecording}><Square className="w-4 h-4 mr-2" />Stop Recording</Button>
                          <p className="text-sm font-mono text-red-500">{recordingTime}s / {MAX_RECORDING_SECONDS}s</p>
                        </>
                    }
                     {recordedBlob && recordingType === 'video' &&
                    <div className="space-y-2">
                         <video src={URL.createObjectURL(recordedBlob)} controls className="w-full rounded-md max-h-48" />
                         <Button type="button" onClick={handleAddRecording}>Add Video to Submission</Button>
                       </div>
                    }
                  </div>
                </TabsContent>

                <TabsContent value="docs">
                  <div
                    onDrop={(e) => {e.preventDefault();handleFileUpload(e.dataTransfer.files);}}
                    onDragOver={(e) => e.preventDefault()}
                    className="p-8 bg-gray-50 border-2 border-dashed rounded-lg text-center cursor-pointer">

                    <input type="file" multiple onChange={(e) => handleFileUpload(e.target.files)} className="hidden" id="doc-upload" />
                    <label htmlFor="doc-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p>Drag & drop files here, or click to browse.</p>
                      <p className="text-xs text-gray-500 mt-1">Max 5MB per file (PDF, DOCX, images, etc.)</p>
                    </label>
                  </div>
                </TabsContent>
                
                <TabsContent value="link">
                   <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                     <p className="text-sm text-center text-gray-600">For larger files (over 5MB) or existing projects, please share a link.</p>
                     <Input placeholder="Paste Google Drive, Dropbox, YouTube link here..." value={externalLink} onChange={(e) => setExternalLink(e.target.value)} />
                     <Button type="button" onClick={handleAddExternalLink} disabled={!externalLink.trim()}>Add Link to Submission</Button>
                   </div>
                </TabsContent>
              </Tabs>
              
              {submissionItems.length > 0 &&
              <div className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-semibold">Your Submission Items:</h3>
                  <div className="flex flex-wrap gap-2">
                    {submissionItems.map((item) =>
                  <div key={item.id} className="flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                        {item.type === 'text' && <FileText className="w-4 h-4" />}
                        {item.type === 'audio' && <Mic className="w-4 h-4" />}
                        {item.type === 'video' && <Video className="w-4 h-4" />}
                        {item.type === 'file' && <Upload className="w-4 h-4" />}
                        {item.type === 'link' && <ExternalLink className="w-4 h-4" />}
                        <span>{item.name}</span>
                        {item.size && <span className="text-xs opacity-70">({formatFileSize(item.size)})</span>}
                        <button type="button" onClick={() => removeItem(item.id)} className="ml-1 text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                      </div>
                  )}
                  </div>
                </div>
              }

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 <Input placeholder="Your Name" value={contactInfo.name} onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })} />
                 <Input type="email" placeholder="* Email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} required />
                 <Input placeholder="Phone Number" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} />
              </div>

              {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center gap-3"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
              {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-center gap-3"><CheckCircle className="w-5 h-5" /><span>{success}</span></div>}

              <Button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 w-full h-14 text-lg font-semibold rounded-full bg-[#ffb400] text-black hover:bg-[#00bf63] hover:text-white">
                {isSubmitting ? 'Submitting...' : 'Submit Idea & Start Chat 🚀'}
              </Button>
              
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-700 font-semibold text-lg mb-4">Or, reach out to us directly:</p>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
                  <a href="mailto:masterprodevconsultant@outlook.com" className="flex items-center gap-3 group social-link">
                    <div className="icon-wrapper" style={{ backgroundColor: '#5271ff' }}>
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <span className="label-text" style={{ '--brand-color': '#5271ff' }}>Email</span>
                  </a>
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group social-link">
                    <div className="icon-wrapper" style={{ background: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)' }}>
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="label-text insta-text-hover" style={{ '--brand-color': '#ee2a7b' }}>Instagram</span>
                  </a>
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group social-link">
                    <div className="icon-wrapper" style={{ backgroundColor: '#1877f2' }}>
                      <Facebook className="w-5 h-5 text-white" />
                    </div>
                    <span className="label-text" style={{ '--brand-color': '#1877f2' }}>Facebook</span>
                  </a>
                  <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group social-link">
                    <div className="icon-wrapper" style={{ backgroundColor: '#0077b5' }}>
                      <Linkedin className="w-5 h-5 text-white" />
                    </div>
                    <span className="label-text" style={{ '--brand-color': '#0077b5' }}>LinkedIn</span>
                  </a>
                  <div className="flex items-center gap-3 group social-link cursor-default">
                    <div className="icon-wrapper" style={{ backgroundColor: '#e74c3c' }}>
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="label-text" style={{ '--brand-color': '#e74c3c' }}>Toronto, ON</span>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
      <style jsx>{`
        .icon-wrapper {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: filter 0.3s ease-in-out;
        }
        .social-link:hover .icon-wrapper {
          filter: brightness(1.15);
        }
        .label-text {
          position: relative;
          font-weight: 500;
          color: #333333;
          transition: color 0.4s ease;
        }
        .social-link:hover .label-text {
          color: var(--brand-color);
        }
        .label-text::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          height: 2px;
          width: 0;
          background-color: var(--brand-color);
          box-shadow: 0 0 8px var(--brand-color);
          transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .social-link:hover .label-text::after {
          width: 100%;
        }

        @keyframes text-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .social-link:hover .insta-text-hover {
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          background-image: linear-gradient(90deg, #6228d7, #ee2a7b, #f9ce34, #ee2a7b, #6228d7);
          background-size: 200% auto;
          animation: text-shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
}