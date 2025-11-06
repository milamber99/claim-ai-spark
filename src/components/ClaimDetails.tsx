import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClaimData } from "./ClaimForm";

interface ClaimDetailsProps {
  initialData: ClaimData;
  onComplete: (data: Partial<ClaimData>) => void;
}

export const ClaimDetails = ({ initialData, onComplete }: ClaimDetailsProps) => {
  const [formData, setFormData] = useState({
    policyNumber: initialData.policyNumber,
    incidentDate: initialData.incidentDate,
    description: initialData.description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isValid = formData.policyNumber && formData.incidentDate && formData.description;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Claim Details</h2>
        <p className="text-muted-foreground">
          Please provide information about your vehicle damage incident.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="policyNumber">Policy Number</Label>
          <Input
            id="policyNumber"
            placeholder="Enter your policy number"
            value={formData.policyNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, policyNumber: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="incidentDate">Incident Date</Label>
          <Input
            id="incidentDate"
            type="date"
            value={formData.incidentDate}
            onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Incident Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what happened and the damage to your vehicle..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={5}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-secondary"
          disabled={!isValid}
        >
          Continue to Photo Upload
        </Button>
      </form>
    </div>
  );
};