import FormLogin from "@/components/login/FormLogin";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">اهلا بك</h1>
        <FormLogin />
      </div>
    </div>
  );
}
