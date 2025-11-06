import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AssessmentData } from "./ClaimForm";

interface ImageUploadProps {
  onComplete: (imageData: string, assessment: AssessmentData) => void;
}

export const ImageUpload = ({ onComplete }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-damage", {
        body: { imageBase64: selectedImage },
      });

      if (error) {
        console.error("Analysis error:", error);
        toast({
          title: "Analysis failed",
          description: error.message || "Failed to analyze the image. Please try again.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }

      if (data) {
        onComplete(selectedImage, data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
          selectedImage 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 bg-muted/30"
        }`}
      >
        {selectedImage ? (
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt="Selected damage"
              className="max-h-96 mx-auto rounded-lg shadow-md"
            />
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Choose Different Photo
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Damage"
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
                Upload Vehicle Damage Photo
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG or WEBP up to 10MB
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              Select Photo
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};