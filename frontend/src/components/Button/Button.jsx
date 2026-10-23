import "./Button.css";

function Button({ text, variant = "primary", onClick, disabled }) {
  return (
    <button
      className={`btn ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
