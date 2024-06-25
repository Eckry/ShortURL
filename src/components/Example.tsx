import "./styles/Example.css";

export default function Example() {
  return (
    <section className="example-container">
      <h1 className="example-title">Example</h1>
      <ul>
        <li className="example-step">
          <span className="example-icon"></span>If you want this link
        </li>
        <span className="link">https://urlsito.netlify.app/youtube</span>
        <li className="example-step">
          <span className="example-icon"></span>to take you to
        </li>
        <span className="link">
          https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1s
        </span>
        <li className="example-step">
          <span className="example-icon"></span>on the above form, write
        </li>
        <div className="example-form">
          <label className="form-label">
            <input
              disabled
              value="https://www.youtube.com/watch?v=dQw4w9..."
              className="example-form-input"
              type="text"
            />
            <span className="example-form-span">Long url</span>
          </label>
          <label className="form-label">
            <input
              disabled
              value="youtube"
              className="example-form-input"
              type="text"
            />
            <span className="example-form-span">Short url</span>
          </label>
        </div>
        <li className="example-step">
          <span className="example-icon"></span>after that, click on
        </li>
        <div className="example-form">
          <button className="submit-button">Create url!</button>
        </div>
      </ul>
    </section>
  );
}
