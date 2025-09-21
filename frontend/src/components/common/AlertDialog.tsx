import React from 'react';
import Button from './Button';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'warning',
}) => {
  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.401-3.75c-.916 0-1.648.742-1.648 1.658v2.224c0 .916.732 1.658 1.648 1.658h.012c.916 0 1.648-.742 1.648-1.658V9.908c0-.916-.732-1.658-1.648-1.658h-.012z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {getIconByType()}
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              variant={type === 'danger' ? 'danger' : 'primary'}
              className="sm:ml-3"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
