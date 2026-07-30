interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField = ({ label, description, error, children }: FormFieldProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start w-full">
      <div className="w-1/4 flex-shrink-0 pt-4 flex flex-col gap-2">
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>


      <div className="flex flex-col flex-1 w-full">
        {children}
        {error && (
          <p className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};