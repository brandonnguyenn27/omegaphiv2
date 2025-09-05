export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // User layout just passes through children - sidebar is handled by parent (authenticated) layout
  return <>{children}</>;
}
