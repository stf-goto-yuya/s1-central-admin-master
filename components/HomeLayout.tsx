import Header from "./Header";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const HomeLayout: React.FC<Props> = (props) => (
  <>
    <Header authenticated={false} />
    <main>{props.children}</main>
  </>
);

export default HomeLayout;
