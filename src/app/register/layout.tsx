import Providers from "../Provider";

interface RegisterLayoutProps {
  children: React.ReactNode;
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return <Providers>{children}</Providers>;
}
