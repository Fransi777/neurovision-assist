import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  X,
  Eye,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: {
    classification: string;
    confidence: number;
    segmentation: boolean;
  };
}

const MRIUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedFormats = ['.dcm', '.nii', '.nii.gz', '.png', '.jpg', '.jpeg'];
  
  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(fileList).forEach((file) => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!acceptedFormats.some(format => file.name.toLowerCase().endsWith(format.replace('.', '')))) {
        toast({
          title: "Unsupported Format",
          description: `${file.name} is not a supported format.`,
          variant: "destructive",
        });
        return;
      }

      const uploadFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: fileExtension,
        status: 'uploading',
        progress: 0
      };

      newFiles.push(uploadFile);
    });

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      
      // Simulate upload and processing
      newFiles.forEach((file) => {
        simulateProcessing(file.id);
      });
    }
  };

  const simulateProcessing = (fileId: string) => {
    // Upload simulation
    const uploadInterval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId && file.status === 'uploading') {
          const newProgress = Math.min(file.progress + Math.random() * 20 + 5, 100);
          
          if (newProgress >= 100) {
            clearInterval(uploadInterval);
            // Start processing
            setTimeout(() => {
              setFiles(prevFiles => prevFiles.map(f => 
                f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
              ));
              processFile(fileId);
            }, 500);
            
            return { ...file, progress: 100, status: 'uploading' };
          }
          
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);
  };

  const processFile = (fileId: string) => {
    const processingInterval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId && file.status === 'processing') {
          const newProgress = Math.min(file.progress + Math.random() * 15 + 3, 100);
          
          if (newProgress >= 100) {
            clearInterval(processingInterval);
            
            // Generate mock results
            const classifications = ['Meningioma', 'Glioma', 'Pituitary Tumor', 'Healthy'];
            const classification = classifications[Math.floor(Math.random() * classifications.length)];
            const confidence = Math.random() * 30 + 70; // 70-100%
            
            setTimeout(() => {
              setFiles(prevFiles => prevFiles.map(f => 
                f.id === fileId ? { 
                  ...f, 
                  status: 'completed', 
                  progress: 100,
                  result: {
                    classification,
                    confidence,
                    segmentation: classification !== 'Healthy'
                  }
                } : f
              ));
              
              toast({
                title: "Analysis Complete",
                description: `${classification} detected with ${confidence.toFixed(1)}% confidence.`,
              });
            }, 500);
            
            return { ...file, progress: 100 };
          }
          
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (classification: string) => {
    switch (classification) {
      case 'Healthy':
        return 'bg-green-500';
      case 'Meningioma':
        return 'bg-blue-500';
      case 'Glioma':
        return 'bg-red-500';
      case 'Pituitary Tumor':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            MRI Scan Upload
          </CardTitle>
          <CardDescription>
            Upload MRI scans for AI-powered tumor detection and segmentation analysis.
            Supported formats: {acceptedFormats.join(', ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <FileImage className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Drop your MRI files here</h3>
                <p className="text-muted-foreground mt-1">
                  or click to browse your computer
                </p>
              </div>
              
              <Button 
                variant="medical-outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                Select Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>
              Track the progress of your MRI scans through AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(file.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium truncate">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {file.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.status === 'completed' && file.result && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <Progress value={file.progress} className="h-2" />

                  {/* Results */}
                  {file.status === 'completed' && file.result && (
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="font-medium">Analysis Results</span>
                        </div>
                        <Badge className={`${getStatusColor(file.result.classification)} text-white`}>
                          {file.result.classification}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="ml-2 font-medium">{file.result.confidence.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Segmentation:</span>
                          <span className="ml-2 font-medium">
                            {file.result.segmentation ? 'Available' : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MRIUpload;