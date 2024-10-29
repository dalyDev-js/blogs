import "../styles/ErrorMessage.css";

const ErrorMessage = ({ message, retry }) => (
  <div className="error-message">
    <p>{message}</p>
    <button onClick={retry}>Retry</button>
  </div>
);

export default ErrorMessage;
