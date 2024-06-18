interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function UrlForm({ handleSubmit }: Props) {
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <label className="form-label">
        Long url
        <input
          name="realurl"
          className="form-input"
          placeholder="https://example.com"
          type="url"
        />
      </label>
      <label className="form-label">
        Short url
        <input
          name="shorturl"
          className="form-input"
          placeholder="example"
          type="text"
        />
      </label>
      <button className="submit-button">Create url!</button>
    </form>
  );
}
