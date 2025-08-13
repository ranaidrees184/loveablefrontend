import PhenoageForm from "@/components/PhenoageForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light/30 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      <div className="relative z-10 py-12">
        <PhenoageForm />
      </div>
    </div>
  );
};

export default Index;
