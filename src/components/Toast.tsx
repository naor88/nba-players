interface ToastProps {
    message: string;
  }
  
  const Toast: React.FC<ToastProps> = ({ message }) => {
    return (
      <div className="toast toast-top toast-center z-20">
        <div className="alert alert-error">
          <span>{message}</span>
        </div>
      </div>
    );
  };
  
  export default Toast;
  