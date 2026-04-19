"use client"
import { useFormContext } from "react-hook-form";

interface RoleSelectionProps {
  onBack: () => void;
}

const RoleSelection = ({ onBack }: RoleSelectionProps) => {
  const { 
    setValue, 
    watch, 
    formState: { isSubmitting } 
  } = useFormContext<{ role: string }>();

  const selectedRole = watch("role");

  const handleSelect = (role: string) => {
    setValue("role", role, { shouldValidate: true });
  };

  return (
    <>
      <h3 className="text-xl font-semibold mb-6 text-center">Choose your account type</h3>
      
      <div className="flex gap-4 mb-8">
        <div 
          onClick={() => handleSelect("VENDOR")}
          className={`flex-1 cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-md ${
            selectedRole === "VENDOR" ? "border-primary bg-accent/20" : "border-border bg-card"
          }`}
        >
          <div className="text-3xl mb-2">📦</div>
          <p className="font-bold text-lg">Vendor</p>
          <p className="text-sm text-muted-foreground">Sell products, manage inventory, and grow your business.</p>
        </div>

        <div 
          onClick={() => handleSelect("HOST")}
          className={`flex-1 cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-md ${
            selectedRole === "HOST" ? "border-primary bg-accent/20" : "border-border bg-card"
          }`}
        >
          <div className="text-3xl mb-2">🏠</div>
          <p className="font-bold text-lg">Host</p>
          <p className="text-sm text-muted-foreground">List spaces, manage bookings, and earn from your property.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          type="button" 
          onClick={onBack} 
          className="w-1/3 bg-secondary text-secondary-foreground py-3 px-6 rounded-full font-bold hover:bg-muted transition-colors"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || !selectedRole} 
          className="w-2/3 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted"
        >
          {isSubmitting ? "Creating Account..." : `Sign Up as ${selectedRole || '...'}`}
        </button>
      </div>
    </>
  );
};

export default RoleSelection;