import Spin from "./icons/icon-spin";

type LoaderProps = {
  children: React.ReactElement;
  loading: boolean;
};

const Loader = ({ children, loading }: LoaderProps) => {
  return (
    <div>
      {loading ? (
        <Spin className="h-[1em] ml-1 inline sroke-1 animate-spin" />
      ) : (
        children
      )}
    </div>
  );
};
export default Loader;
