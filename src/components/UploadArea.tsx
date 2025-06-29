
import { useCallback, useState } from 'react';
import { Upload, Check, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  accept: string;
  uploadedFile: File | null;
  fileType: 'video' | 'audio';
  icon: React.ReactNode;
}

const UploadArea = ({ onFileUpload, accept, uploadedFile, fileType, icon }: UploadAreaProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer glass-morphism",
        isDragOver ? "border-accent bg-accent/10 neon-glow" : "border-muted-foreground/30 hover:border-accent/50",
        uploadedFile && "border-green-500/50 bg-green-500/10"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-input-${fileType}`)?.click()}
    >
      <input
        id={`file-input-${fileType}`}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-4">
        {uploadedFile ? (
          <>
            <div className="text-green-400">
              <Check className="w-12 h-12 mx-auto animate-scale-in" />
            </div>
            <div>
              <p className="text-green-400 font-medium">File uploaded successfully!</p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-2">
                <File className="w-4 h-4" />
                {uploadedFile.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={cn(
              "transition-colors duration-300",
              isDragOver ? "text-accent" : "text-muted-foreground"
            )}>
              {isDragOver ? (
                <div className="animate-pulse">{icon}</div>
              ) : (
                <>
                  {icon}
                  <Upload className="w-6 h-6 mx-auto mt-2" />
                </>
              )}
            </div>
            <div>
              <p className="font-medium mb-1">
                {isDragOver ? `Drop your ${fileType} file here` : `Choose ${fileType} file or drag & drop`}
              </p>
              <p className="text-sm text-muted-foreground">
                {fileType === 'video' ? 'MP4, AVI, MOV up to 500MB' : 'MP3, WAV, AAC up to 100MB'}
              </p>
            </div>
          </>
        )}
      </div>
      
      {isDragOver && (
        <div className="absolute inset-0 bg-accent/20 rounded-lg animate-pulse" />
      )}
    </div>
  );
};

export default UploadArea;
