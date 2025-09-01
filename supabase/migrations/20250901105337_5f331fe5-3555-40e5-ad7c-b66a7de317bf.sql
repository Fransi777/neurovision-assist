-- Create scan_results table for storing MRI analysis results
CREATE TABLE public.scan_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  patient_name TEXT NOT NULL,
  scan_type TEXT NOT NULL DEFAULT 'MRI',
  classification_result TEXT,
  confidence_score DECIMAL(3,2),
  tumor_type TEXT,
  scan_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  file_path TEXT,
  segmentation_data JSONB,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

-- Create policies for scan_results
CREATE POLICY "Users can view scans they uploaded or are authorized to see" 
ON public.scan_results 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'doctor'::app_role) OR
  has_role(auth.uid(), 'specialist_patient'::app_role)
);

CREATE POLICY "Radiologists can create scan results" 
ON public.scan_results 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  has_role(auth.uid(), 'radiologist'::app_role)
);

CREATE POLICY "Users can update their own scan results" 
ON public.scan_results 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authorized users can delete scan results" 
ON public.scan_results 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_scan_results_updated_at
BEFORE UPDATE ON public.scan_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the scan_results table
ALTER TABLE public.scan_results REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scan_results;