import { FC } from "react";

interface InputsProps {
  type: string;
  placeholder: string;
  value?: string; // Optional
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Optional onBlur for RHF
  name?: string; // Name for RHF
  ref?: React.Ref<HTMLInputElement>; // Ref for RHF
}

const Inputs: FC<InputsProps> = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  onBlur,
  name,
  ref,
}) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
        className={`flex h-9 w-full rounded-md border ${
          error ? "border-red-500" : "border-input"
        } bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Inputs;
