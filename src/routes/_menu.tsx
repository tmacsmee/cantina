import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_menu')({
  component: MenuLayout,
});

function MenuLayout() {
  return (
    <main className="isolate flex h-screen items-center justify-center bg-black">
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:250px]" />
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:300px]" />
      <div className="animate-starfield fixed inset-0 -z-10 bg-[url('/starfield.png')] bg-size-(--starfield-width) bg-repeat [--starfield-width:350px]" />
      <Outlet />
    </main>
  );
}
