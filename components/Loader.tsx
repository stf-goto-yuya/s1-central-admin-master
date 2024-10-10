import { css } from "@emotion/core";
import RingLoader from "react-spinners/RingLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Loader: React.FC<{}> = () => (
  <section className="h-screen w-full flex flex-col justify-center items-center">
    <RingLoader css={override} size={150} color={"#36D7B7"} loading={true} />
    <p className="py-4 uppercase text-white tracking-widest">Loading ...</p>
  </section>
);

export default Loader;
