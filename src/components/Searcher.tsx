import { SearchIcon } from "../icons";
import "./styles/Searcher.css";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  search: string;
}

export default function Searcher({ onChange, search }: Props) {
  return (
    <label className="searcher-wrapper">
      <input
        className="searcher"
        onChange={onChange}
        value={search}
        type="text"
      />
      <span className="search-icon">
        <SearchIcon />
      </span>
    </label>
  );
}
