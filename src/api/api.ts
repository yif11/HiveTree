export const fetchHello = async (): Promise<string> => {
  const res = await fetch('/api/hello');// プロキシにより localhost:3000 に届く
  const data = await res.json();
  return data.message;
};