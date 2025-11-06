import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Image as ImageIcon, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AssessmentData } from "./ClaimForm";

interface ImageUploadProps {
  onComplete: (imageData: string[], assessment: AssessmentData) => void;
}

export const ImageUpload = ({ onComplete }: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(file => !file.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only image files.",
        variant: "destructive",
      });
      return;
    }

    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      setSelectedImages(prev => [...prev, ...images]);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) return;

    setIsAnalyzing(true);
    try {
      // Analyze all images and combine results
      const analyses = await Promise.all(
        selectedImages.map(async (image) => {
          const { data, error } = await supabase.functions.invoke("analyze-damage", {
            body: { imageBase64: image },
          });
          if (error) throw error;
          return data as AssessmentData;
        })
      );

      // Combine all analyses into one comprehensive assessment
      const combinedAssessment: AssessmentData = {
        severity: analyses.reduce((max, curr) => {
          const severityOrder = { minor: 1, moderate: 2, severe: 3 };
          return severityOrder[curr.severity] > severityOrder[max.severity] ? curr : max;
        }).severity,
        damageAreas: [...new Set(analyses.flatMap(a => a.damageAreas))],
        estimatedCost: analyses.length === 1 
          ? analyses[0].estimatedCost 
          : `Combined: ${analyses[0].estimatedCost}`,
        assessment: analyses.map((a, i) => 
          `Photo ${i + 1}: ${a.assessment}`
        ).join('\n\n'),
        nextSteps: [...new Set(analyses.flatMap(a => a.nextSteps))],
      };

      onComplete(selectedImages, combinedAssessment);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the images. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Damage Photos</h2>
        <p className="text-muted-foreground">
          Upload a clear photo of the vehicle damage for AI analysis.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          selectedImages.length > 0
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 bg-muted/30"
        }`}
      >
        {selectedImages.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Damage photo ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add More Photos
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing {selectedImages.length} photo{selectedImages.length > 1 ? 's' : ''}...
                  </>
                ) : (
                  `Analyze ${selectedImages.length} Photo${selectedImages.length > 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                Upload Vehicle Damage Photos
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG or WEBP up to 10MB each (multiple photos allowed)
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              Select Photos
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};