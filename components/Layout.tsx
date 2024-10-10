import Header from "./Header";

interface Props {
  authenticated: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ authenticated, children }) => (
  <>
    <Header authenticated={authenticated} />
    <main className="container mx-auto">{children}</main>
  </>
);

export default Layout;
