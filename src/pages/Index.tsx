
import { useState, useCallback } from 'react';
import { Upload, Video, Music, Sparkles, Download, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import UploadArea from '@/components/UploadArea';
import ProcessingView from '@/components/ProcessingView';
import ResultView from '@/components/ResultView';
import Header from '@/components/Header';

type AppState = 'upload' | 'processing' | 'result' | 'error';

interface GenerationJob {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  createdAt: string;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState('lipsync-2');
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const { toast } = useToast();

  const handleVideoUpload = useCallback((file: File) => {
    setVideoFile(file);
    console.log('Video file uploaded:', file.name);
  }, []);

  const handleAudioUpload = useCallback((file: File) => {
    setAudioFile(file);
    console.log('Audio file uploaded:', file.name);
  }, []);

  const isGenerateEnabled = videoFile && audioFile;

  const simulateGeneration = async () => {
    if (!isGenerateEnabled) return;

    console.log('Starting generation with:', { video: videoFile?.name, audio: audioFile?.name, model: selectedModel });
    
    setCurrentState('processing');
    setProcessingStatus('Uploading files...');
    
    // Simulate API call to start generation
    const jobId = Math.random().toString(36).substring(7);
    const newJob: GenerationJob = {
      id: jobId,
      status: 'processing',
      createdAt: new Date().toISOString()
    };
    setCurrentJob(newJob);

    // Simulate processing stages
    const stages = [
      'Uploading files...',
      'Analyzing video content...',
      'Processing audio synchronization...',
      'Generating lip-sync video...',
      'Finalizing output...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStatus(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Simulate completion
    const completedJob: GenerationJob = {
      ...newJob,
      status: 'completed',
      videoUrl: '/placeholder-video.mp4' // This would be the actual generated video URL
    };
    
    setCurrentJob(completedJob);
    setCurrentState('result');
    
    toast({
      title: "Video Generated Successfully!",
      description: "Your lip-sync video is ready for download.",
    });
  };

  const handleStartNew = () => {
    setCurrentState('upload');
    setVideoFile(null);
    setAudioFile(null);
    setCurrentJob(null);
    setProcessingStatus('');
    console.log('Starting new generation');
  };

  const handleDownload = () => {
    if (currentJob?.videoUrl) {
      console.log('Downloading video:', currentJob.videoUrl);
      toast({
        title: "Download Started",
        description: "Your video is being downloaded.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentState === 'upload' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Upload Section */}
            <Card className="glass-morphism neon-glow border-0 animate-float">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Video Upload */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Video className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-semibold">Video Upload</h3>
                    </div>
                    <UploadArea
                      onFileUpload={handleVideoUpload}
                      accept="video/*"
                      uploadedFile={videoFile}
                      fileType="video"
                      icon={<Video className="w-8 h-8" />}
                    />
                  </div>

                  {/* Audio Upload */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Music className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-semibold">Audio Upload</h3>
                    </div>
                    <UploadArea
                      onFileUpload={handleAudioUpload}
                      accept="audio/*"
                      uploadedFile={audioFile}
                      fileType="audio"
                      icon={<Music className="w-8 h-8" />}
                    />
                  </div>
                </div>

                {/* Model Selection */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">AI Model Selection</h3>
                  </div>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="max-w-xs glass-morphism border-accent/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-morphism border-accent/30">
                      <SelectItem value="lipsync-2">LipSync-2 (Recommended)</SelectItem>
                      <SelectItem value="lipsync-1">LipSync-1 (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <div className="mt-8 text-center">
                  <Button
                    onClick={simulateGeneration}
                    disabled={!isGenerateEnabled}
                    size="lg"
                    className={`px-12 py-4 text-lg font-semibold transition-all duration-300 ${
                      isGenerateEnabled 
                        ? 'bg-gradient-to-r from-primary to-accent neon-glow-purple hover:scale-105' 
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Video
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="glass-morphism border-accent/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 gradient-text">How It Works</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">1</div>
                    <div>
                      <p className="font-medium">Upload Your Video</p>
                      <p className="text-muted-foreground">Supported formats: MP4, AVI, MOV</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">2</div>
                    <div>
                      <p className="font-medium">Upload Your Audio</p>
                      <p className="text-muted-foreground">Supported formats: MP3, WAV, AAC</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-pink/20 flex items-center justify-center text-[hsl(var(--neon-pink))] font-bold text-xs">3</div>
                    <div>
                      <p className="font-medium">Generate & Download</p>
                      <p className="text-muted-foreground">AI creates perfect lip-sync video</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentState === 'processing' && (
          <ProcessingView status={processingStatus} />
        )}

        {currentState === 'result' && currentJob && (
          <ResultView
            job={currentJob}
            onDownload={handleDownload}
            onStartNew={handleStartNew}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
