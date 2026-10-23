import "./Typography.css";

export function Heading({children}) {
  return <h1 className="heading">{children}</h1>;
}

export function SubHeading({children}) {
  return <h2 className="subheading">{children}</h2>;
}

export function Paragraph({children}) {
  return <p className="paragraph">{children}</p>;
}

export function Caption({children}) {
  return <span className="caption">{children}</span>;
}