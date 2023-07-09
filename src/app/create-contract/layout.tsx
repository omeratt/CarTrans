import Providers from "../Provider";

interface CreateContractLayoutProps {
  children: React.ReactNode;
}

export default function CreateContractLayout({
  children,
}: CreateContractLayoutProps) {
  return <Providers>{children}</Providers>;
}
