import React from "react";

const InputField = React.forwardRef(
  ({ label, type, placeholder, onChange, onBlur, name }, ref) => (
    <div>
      <label className="block text-dark mb-1 font-medium">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        className="w-full border-2 border-dark px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark transition"
      />
    </div>
  )
);

export default InputField;
