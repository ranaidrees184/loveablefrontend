import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Activity, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BiomarkerInputs {
  age: string;
  albumin_gL: string;
  creat_umol: string;
  glucose_mmol: string;
  lncrp: string;
  lymph: string;
  mcv: string;
  rdw: string;
  alp: string;
  wbc: string;
}

interface PredictionResult {
  prediction: number;
  confidence?: number;
  status: string;
}

const biomarkerLabels = {
  age: { label: "Age", unit: "years", description: "Patient age in years" },
  albumin_gL: { label: "Albumin", unit: "g/L", description: "Serum albumin concentration" },
  creat_umol: { label: "Creatinine", unit: "μmol/L", description: "Serum creatinine level" },
  glucose_mmol: { label: "Glucose", unit: "mmol/L", description: "Blood glucose level" },
  lncrp: { label: "ln(CRP)", unit: "", description: "Natural log of C-reactive protein" },
  lymph: { label: "Lymphocytes", unit: "%", description: "Lymphocyte percentage" },
  mcv: { label: "MCV", unit: "fL", description: "Mean corpuscular volume" },
  rdw: { label: "RDW", unit: "%", description: "Red blood cell distribution width" },
  alp: { label: "ALP", unit: "U/L", description: "Alkaline phosphatase level" },
  wbc: { label: "WBC", unit: "×10⁹/L", description: "White blood cell count" }
};

export default function PhenoageForm() {
  const [inputs, setInputs] = useState<BiomarkerInputs>({
    age: "",
    albumin_gL: "",
    creat_umol: "",
    glucose_mmol: "",
    lncrp: "",
    lymph: "",
    mcv: "",
    rdw: "",
    alp: "",
    wbc: ""
  });
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof BiomarkerInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const validateInputs = (): boolean => {
    for (const [key, value] of Object.entries(inputs)) {
      if (!value.trim()) {
        toast({
          title: "Missing Input",
          description: `Please enter a value for ${biomarkerLabels[key as keyof BiomarkerInputs].label}`,
          variant: "destructive"
        });
        return false;
      }
      if (isNaN(Number(value))) {
        toast({
          title: "Invalid Input",
          description: `${biomarkerLabels[key as keyof BiomarkerInputs].label} must be a valid number`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handlePredict = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Convert string inputs to numbers
      const numericInputs = Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, parseFloat(value)])
      );

      // Replace this URL with your actual API endpoint
      const response = await fetch('https://biological-age-prediction.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(numericInputs)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      // const data = await response.json();
      
      // Simulate API response for demo purposes
      // Remove this simulation when connecting to real API
      //const simulatedResult: PredictionResult = {
       // prediction: Math.round((Math.random() * 20 + 40) * 100) / 100,
        //confidence: Math.round(Math.random() * 30 + 70),
       // status: "success"
      //};

      //setResult(simulatedResult);
      //const data: PredictionResult = await response.json();
      //setResult({ prediction: data, status: "success" });

      const data = await response.json(); // Assuming data is the raw prediction number (e.g., 42)

      // Construct PredictionResult object
      const resultData: PredictionResult = {
      prediction: data["Predicted Biological Age of Patient"], // Access the nested value
      status: "success",
      confidence: undefined // Optional; set to undefined or fetch from API if provided
    };

    setResult(resultData);

      setResult(resultData);

      toast({
        title: "Prediction Complete",
        description: "Phenoage prediction calculated successfully",
      });

    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Failed",
        description: "Please check your API endpoint and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setInputs({
      age: "",
      albumin_gL: "",
      creat_umol: "",
      glucose_mmol: "",
      lncrp: "",
      lymph: "",
      mcv: "",
      rdw: "",
      alp: "",
      wbc: ""
    });
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <Card className="shadow-medical border-0 bg-gradient-to-br from-card to-medical-light">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary to-primary-glow rounded-full shadow-glow">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Phenoage Prediction Using AI
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Enter biomarker values to predict biological age using advanced machine learning
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(biomarkerLabels).map(([key, info]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-primary" />
                  {info.label}
                  {info.unit && <span className="text-muted-foreground">({info.unit})</span>}
                </Label>
                <Input
                  id={key}
                  type="number"
                  step="any"
                  placeholder={`Enter ${info.label.toLowerCase()}`}
                  value={inputs[key as keyof BiomarkerInputs]}
                  onChange={(e) => handleInputChange(key as keyof BiomarkerInputs, e.target.value)}
                  className="transition-all duration-300 focus:shadow-md focus:scale-[1.02]"
                />
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-6">
            <Button 
              onClick={handlePredict} 
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Predict Phenoage
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="px-8 hover:bg-secondary transition-all duration-300"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="shadow-medical border-0 bg-gradient-to-br from-card to-success/5 animate-in slide-in-from-bottom duration-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-success flex items-center justify-center gap-2">
              <Activity className="h-6 w-6" />
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-xl p-8">
                <div className="text-4xl font-bold text-success mb-2">
                  {result.prediction.toFixed(2)} years
                </div>
                <p className="text-lg text-muted-foreground">Predicted Biological Age</p>
                {result.confidence && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Confidence: {result.confidence}%
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-medical-light/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-semibold text-success capitalize">{result.status}</div>
                </div>
                <div className="text-center p-4 bg-medical-light/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Model Type</div>
                  <div className="font-semibold">AI/ML Prediction</div>
                </div>
                <div className="text-center p-4 bg-medical-light/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                  <div className="font-semibold">&lt; 1 second</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}