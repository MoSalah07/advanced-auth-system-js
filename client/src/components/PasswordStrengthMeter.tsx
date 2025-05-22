import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }: { password: string }) => {
  const criteria = [
    { label: "At Least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letters", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letters", met: /[a-z]/.test(password) },
    { label: "Contains numbers", met: /\d/.test(password) },
    {
      label: "Contains special characters",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}
          <span className={item.met ? "text-green-500" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function PasswordStrengthMeter({
  password,
}: {
  password: string;
}) {
  const getStrength = (pass: string) => {
    let strength: number = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = (strength: number) => {
    switch (strength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-400";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-yellow-400";
      default:
        return "bg-green-500";
    }
  };

  const getStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      default:
        return "Strong";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-center mb-2">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400 ml-1">
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
              index < strength ? getColor(strength) : "bg-gray-600"
            }`}
          ></div>
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
}
