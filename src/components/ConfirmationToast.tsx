import React from 'react';
import toast, { Toast } from 'react-hot-toast';
import Button from './Button';

interface ConfirmationToastProps {
  t: Toast;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  t,
  message,
  onConfirm,
  confirmText = 'Sim',
  cancelText = 'Não',
}) => {
  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center gap-3 max-w-sm">
      <span className="font-semibold text-center">{message}</span>
      <div className="flex gap-3 w-full">
        <Button
          onClick={() => toast.dismiss(t.id)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold"
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => { onConfirm(); toast.dismiss(t.id); }}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationToast;
