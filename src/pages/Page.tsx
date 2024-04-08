export function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="bg-gray-800 no-scrollbar">{children}</main>
    </>
  );
}
