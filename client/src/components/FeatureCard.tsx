import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor: string;
}

const FeatureCard = ({ icon, title, description, iconColor }: FeatureCardProps) => {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm">
      <div className={`${iconColor} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold font-roboto mb-2">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
