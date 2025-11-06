import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { AssessmentData, ClaimData } from "./ClaimForm";

interface AssessmentResultsProps {
  data: AssessmentData;
  claimData: ClaimData;
  onNewClaim: () => void;
}

export const AssessmentResults = ({ data, claimData, onNewClaim }: AssessmentResultsProps) => {
  const severityConfig = {
    minor: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      label: "Minor Damage",
    },
    moderate: {
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      label: "Moderate Damage",
    },
    severe: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      label: "Severe Damage",
    },
  };

  const config = severityConfig[data.severity];
  const SeverityIcon = config.icon;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Damage Assessment</h2>
        <p className="text-muted-foreground">
          Preliminary analysis results for claim #{claimData.policyNumber}
        </p>
      </div>

      {/* Uploaded Photos */}
      {claimData.imageData && claimData.imageData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Submitted Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {claimData.imageData.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Damage photo ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Severity Card */}
      <Card className={`p-6 ${config.bgColor} border-0`}>
        <div className="flex items-center gap-3">
          <SeverityIcon className={`h-8 w-8 ${config.color}`} />
          <div>
            <h3 className="text-lg font-semibold text-foreground">{config.label}</h3>
            <p className="text-sm text-muted-foreground">Estimated Cost: {data.estimatedCost}</p>
          </div>
        </div>
      </Card>

      {/* Damage Areas */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Damaged Areas</h3>
        <div className="flex flex-wrap gap-2">
          {data.damageAreas.map((area, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* Assessment Details */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Detailed Assessment</h3>
        <Card className="p-4 bg-muted/50">
          <p className="text-foreground leading-relaxed whitespace-pre-line">{data.assessment}</p>
        </Card>
      </div>

      {/* Next Steps */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Next Steps</h3>
        <Card className="p-4 bg-card">
          <ol className="space-y-2">
            {data.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-foreground pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button 
          onClick={onNewClaim}
          className="flex-1 bg-gradient-to-r from-primary to-secondary"
        >
          Submit Another Claim
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="p-4 bg-muted/30 border-dashed">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> This is a preliminary AI-powered assessment. A claims adjuster will 
          review your case for final determination. The actual repair cost and coverage may differ 
          from this initial estimate.
        </p>
      </Card>
    </div>
  );
};