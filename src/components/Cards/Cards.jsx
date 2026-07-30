import "./Cards.css";
import Button from "../Button/Button";

function Card({ image, title, description, buttonText }) {
  return (
    <div className="card">
      <img src={image} alt={title} />

      <h3>{title}</h3>

      <p>{description}</p>

      {buttonText && (
        <Button text={buttonText} variant="primary" />
      )}
    </div>
  );
}

export default Card;