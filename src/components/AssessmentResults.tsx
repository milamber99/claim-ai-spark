import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertTriangle, XCircle, Pencil, X } from "lucide-react";
import { AssessmentData, ClaimData } from "./ClaimForm";

interface AssessmentResultsProps {
  data: AssessmentData;
  claimData: ClaimData;
  onNewClaim: () => void;
}

export const AssessmentResults = ({ data, claimData, onNewClaim }: AssessmentResultsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<AssessmentData>(data);
  const [newDamageArea, setNewDamageArea] = useState("");

  const currentData = isEditing ? editedData : data;

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you'd save this to a database or pass it up to parent
  };

  const handleCancel = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  const addDamageArea = () => {
    if (newDamageArea.trim()) {
      setEditedData({
        ...editedData,
        damageAreas: [...editedData.damageAreas, newDamageArea.trim()]
      });
      setNewDamageArea("");
    }
  };

  const removeDamageArea = (index: number) => {
    setEditedData({
      ...editedData,
      damageAreas: editedData.damageAreas.filter((_, i) => i !== index)
    });
  };

  const addNextStep = () => {
    setEditedData({
      ...editedData,
      nextSteps: [...editedData.nextSteps, ""]
    });
  };

  const updateNextStep = (index: number, value: string) => {
    const updated = [...editedData.nextSteps];
    updated[index] = value;
    setEditedData({
      ...editedData,
      nextSteps: updated
    });
  };

  const removeNextStep = (index: number) => {
    setEditedData({
      ...editedData,
      nextSteps: editedData.nextSteps.filter((_, i) => i !== index)
    });
  };

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

  const config = severityConfig[currentData.severity];
  const SeverityIcon = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">AI Damage Assessment</h2>
          <p className="text-muted-foreground">
            Preliminary analysis results for claim #{claimData.policyNumber}
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Assessment
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        )}
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
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Severity</label>
                  <Select
                    value={editedData.severity}
                    onValueChange={(value: "minor" | "moderate" | "severe") =>
                      setEditedData({ ...editedData, severity: value })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor Damage</SelectItem>
                      <SelectItem value="moderate">Moderate Damage</SelectItem>
                      <SelectItem value="severe">Severe Damage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Estimated Cost</label>
                  <Input
                    value={editedData.estimatedCost}
                    onChange={(e) => setEditedData({ ...editedData, estimatedCost: e.target.value })}
                    placeholder="e.g., $2,500 - $3,500"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground">{config.label}</h3>
                <p className="text-sm text-muted-foreground">Estimated Cost: {currentData.estimatedCost}</p>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Damage Areas */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Damaged Areas</h3>
        <div className="flex flex-wrap gap-2">
          {currentData.damageAreas.map((area, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-2">
              {area}
              {isEditing && (
                <button
                  onClick={() => removeDamageArea(index)}
                  className="hover:text-destructive"
                  aria-label="Remove area"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
        {isEditing && (
          <div className="flex gap-2 mt-3">
            <Input
              value={newDamageArea}
              onChange={(e) => setNewDamageArea(e.target.value)}
              placeholder="Add new damage area"
              onKeyPress={(e) => e.key === "Enter" && addDamageArea()}
            />
            <Button onClick={addDamageArea} size="sm">Add</Button>
          </div>
        )}
      </div>

      {/* Assessment Details */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Detailed Assessment</h3>
        <Card className="p-4 bg-muted/50">
          {isEditing ? (
            <Textarea
              value={editedData.assessment}
              onChange={(e) => setEditedData({ ...editedData, assessment: e.target.value })}
              rows={6}
              className="bg-background"
            />
          ) : (
            <p className="text-foreground leading-relaxed whitespace-pre-line">{currentData.assessment}</p>
          )}
        </Card>
      </div>

      {/* Next Steps */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Next Steps</h3>
        <Card className="p-4 bg-card">
          <ol className="space-y-2">
            {currentData.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium flex-shrink-0">
                  {index + 1}
                </span>
                {isEditing ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={step}
                      onChange={(e) => updateNextStep(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeNextStep(index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-foreground pt-0.5">{step}</span>
                )}
              </li>
            ))}
          </ol>
          {isEditing && (
            <Button onClick={addNextStep} variant="outline" size="sm" className="mt-3">
              Add Step
            </Button>
          )}
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