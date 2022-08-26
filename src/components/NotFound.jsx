import React from "react";
import { Link } from "react-router-dom";

function NotFound(props) {
  return (
    <section className="not--found">
      <h1>Not Found</h1>
      <Link to="/">Return</Link>
    </section>
  );
}

export default NotFound;
