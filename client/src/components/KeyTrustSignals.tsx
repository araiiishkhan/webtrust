import { Check, AlertCircle, XCircle } from "lucide-react";

export interface TrustSignal {
  name: string;
  status: 'positive' | 'warning' | 'negative';
}

interface KeyTrustSignalsProps {
  signals: TrustSignal[];
}

const KeyTrustSignals = ({ signals }: KeyTrustSignalsProps) => {
  const getIcon = (status: TrustSignal['status']) => {
    switch (status) {
      case 'positive':
        return <Check className="h-5 w-5 text-trust-green mr-2 mt-0.5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-medium-risk mr-2 mt-0.5" />;
      case 'negative':
        return <XCircle className="h-5 w-5 text-warning-red mr-2 mt-0.5" />;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-roboto font-medium mb-3">Key Trust Signals</h3>
      
      {signals.length > 0 ? (
        <ul className="space-y-2">
          {signals.map((signal, index) => (
            <li key={index} className="flex items-start">
              {getIcon(signal.status)}
              <span>{signal.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No trust signals available</p>
        </div>
      )}
    </div>
  );
};

export default KeyTrustSignals;
