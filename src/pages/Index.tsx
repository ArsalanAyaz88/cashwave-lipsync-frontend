import { useState, useCallback, useEffect } from 'react';
import { Video, Music, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import UploadArea from '@/components/UploadArea';
import ProcessingView from '@/components/ProcessingView';
import ResultView from '@/components/ResultView';
import Header from '@/components/Header';
import GenerationHistory from '@/components/GenerationHistory';
import { uploadAndGenerate, getGeneration, estimateCost, Generation } from '@/lib/api';

type AppState = 'upload' | 'processing' | 'result' | 'error';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState('lipsync-2');
  const [currentJob, setCurrentJob] = useState<Generation | null>(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [cost, setCost] = useState<number | null>(null);
  const [isEstimatingCost, setIsEstimatingCost] = useState(false);
  const { toast } = useToast();

  const handleVideoUpload = useCallback((file: File) => {
    setVideoFile(file);
  }, []);

  const handleAudioUpload = useCallback((file: File) => {
    setAudioFile(file);
  }, []);

  const isGenerateEnabled = videoFile && audioFile;

  useEffect(() => {
    const getCostEstimation = async () => {
      if (videoFile && audioFile) {
        setIsEstimatingCost(true);
        try {
          const { cost } = await estimateCost(videoFile, audioFile, selectedModel);
          setCost(cost);
        } catch (error) {
          console.error("Failed to estimate cost:", error);
          setCost(null);
          toast({
            title: "Could Not Estimate Cost",
            description: "There was an issue estimating the generation cost.",
            variant: "destructive",
          });
        } finally {
          setIsEstimatingCost(false);
        }
      }
    };

    getCostEstimation();
  }, [videoFile, audioFile, toast]);

  const pollGenerationStatus = useCallback((id: string) => {
    const intervalId = setInterval(async () => {
      try {
        const job = await getGeneration(id);
        setCurrentJob(job);

        switch (job.status) {
          case 'PENDING':
            setProcessingStatus('Job is pending in the queue...');
            break;
          case 'PROCESSING':
            setProcessingStatus('AI is generating your video...');
            break;
          case 'COMPLETED':
            setProcessingStatus('Generation complete!');
            setCurrentState('result');
            clearInterval(intervalId);
            toast({
              title: "Video Generated Successfully!",
              description: "Your lip-sync video is ready.",
            });
            break;
          case 'FAILED':
            setProcessingStatus(`Generation failed: ${job.error || 'Unknown error'}`);
            setCurrentState('error');
            clearInterval(intervalId);
            toast({
              title: "Generation Failed",
              description: job.error || "An unknown error occurred during processing.",
              variant: "destructive",
            });
            break;
        }
      } catch (error) {
        console.error('Polling failed:', error);
        clearInterval(intervalId);
        toast({
          title: "Error Checking Status",
          description: "Could not retrieve generation status.",
          variant: "destructive",
        });
        setCurrentState('upload');
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [toast]);

  const handleGenerate = async () => {
    if (!videoFile || !audioFile) return;

    setCurrentState('processing');
    setProcessingStatus('Uploading files...');

    try {
      const initialJob = await uploadAndGenerate(videoFile, audioFile, selectedModel);
      setCurrentJob(initialJob);

      if (initialJob.id) {
        setProcessingStatus('Files uploaded. Starting generation...');
        pollGenerationStatus(initialJob.id);
      } else {
        throw new Error("Failed to get a job ID from the server.");
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
      setCurrentState('upload');
    }
  };

  const handleStartNew = () => {
    setCurrentState('upload');
    setVideoFile(null);
    setAudioFile(null);
    setCurrentJob(null);
    setProcessingStatus('');
  };

  const handleDownload = () => {
    if (currentJob?.output_url) {
      window.open(currentJob.output_url, '_blank');
      toast({
        title: "Download Started",
        description: "Your video should be downloading in a new tab.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentState === 'upload' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <Card className="glass-morphism neon-glow border-0 animate-float">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <UploadArea
                    onFileUpload={handleVideoUpload}
                    accept="video/*"
                    uploadedFile={videoFile}
                    fileType="video"
                    icon={<Video className="w-8 h-8" />}
                  />
                  <UploadArea
                    onFileUpload={handleAudioUpload}
                    accept="audio/*"
                    uploadedFile={audioFile}
                    fileType="audio"
                    icon={<Music className="w-8 h-8" />}
                  />
                </div>

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

                <div className="mt-8 text-center">
                  <Button
                    onClick={handleGenerate}
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
                  <div className="mt-4 text-center text-sm text-muted-foreground h-5">
                    {isEstimatingCost ? (
                      <p>Estimating cost...</p>
                    ) : cost !== null ? (
                      <p>Estimated Cost: <span className="font-bold text-accent">${cost.toFixed(2)}</span></p>
                    ) : isGenerateEnabled ? (
                      <p>Cost estimation will appear here.</p>
                    ) : (
                      <p>Select files to see estimated cost.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-accent/20" style={{ display: 'none' }}>
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

            <GenerationHistory />
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
        
        {currentState === 'error' && (
            <div className="text-center">
                <p className="text-red-500">{processingStatus}</p>
                <Button onClick={handleStartNew} className="mt-4">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        )}

      </main>
    </div>
  );
};

export default Index;
