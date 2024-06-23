import "./styles/UrlForm.css";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function UrlForm({ handleSubmit }: Props) {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <label className="form-label">
        <input required name="realurl" className="form-input" type="text" />
        <span className="form-span">Long url</span>
      </label>
      <label className="form-label">
        <input required name="shorturl" className="form-input" type="text" />
        <span className="form-span">Short url</span>
      </label>
      <button className="submit-button">Create url!</button>
    </form>
  );
}
