// Home route: intentionally light, loads instantly with no heavy dependencies.
export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Open Reports to see the revenue chart.
      </p>
    </>
  );
}
