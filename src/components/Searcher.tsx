interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  search: string;
}

export default function Searcher({ onChange, search }: Props) {
  return <input onChange={onChange} value={search} type="text" />;
}
