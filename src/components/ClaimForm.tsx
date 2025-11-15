import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { ClaimDetails } from "./ClaimDetails";
import { ImageUpload } from "./ImageUpload";
import { AssessmentResults } from "./AssessmentResults";

interface ClaimFormProps {
  onBack: () => void;
}

type Step = "details" | "upload" | "results";

export interface ClaimData {
  policyNumber: string;
  incidentDate: string;
  description: string;
  imageData?: string[];
}

export interface AssessmentData {
  severity: "minor" | "moderate" | "severe";
  damageAreas: string[];
  estimatedCost: string;
  assessment: string;
  nextSteps: string[];
}

export const ClaimForm = ({ onBack }: ClaimFormProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [claimData, setClaimData] = useState<ClaimData>({
    policyNumber: "",
    incidentDate: "",
    description: "",
  });
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const steps = [
    { id: "details", label: "Claim Details" },
    { id: "upload", label: "Upload Photos" },
    { id: "results", label: "Assessment" },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleDetailsComplete = (data: Partial<ClaimData>) => {
    setClaimData(prev => ({ ...prev, ...data }));
    setCurrentStep("upload");
  };

  const handleImageUploadComplete = (imageData: string[], assessment: AssessmentData) => {
    setClaimData(prev => ({ ...prev, imageData }));
    setAssessmentData(assessment);
    setCurrentStep("results");
  };

  const handleNewClaim = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={currentStep === "details" ? onBack : () => {
              if (currentStep === "upload") setCurrentStep("details");
              if (currentStep === "results") setCurrentStep("upload");
            }}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      index <= currentStepIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 transition-colors ${
                      index < currentStepIndex ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8 shadow-lg border-border">
          {currentStep === "details" && (
            <ClaimDetails 
              initialData={claimData} 
              onComplete={handleDetailsComplete} 
            />
          )}
          {currentStep === "upload" && (
            <ImageUpload onComplete={handleImageUploadComplete} />
          )}
          {currentStep === "results" && assessmentData && (
            <AssessmentResults 
              data={assessmentData} 
              claimData={claimData}
              onNewClaim={handleNewClaim}
            />
          )}
        </Card>
      </main>
    </div>
  );
};