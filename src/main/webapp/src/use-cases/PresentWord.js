import { Link } from "react-router-dom";

function PresentWord() {
  return (
    <div className="App">
      <div>
        <div>
          <Link to="/lobby">
            <a>Go back</a>
          </Link>
          <h1>Presenting word page</h1>{" "}
        </div>
      </div>
    </div>
  );
}

export default PresentWord;
