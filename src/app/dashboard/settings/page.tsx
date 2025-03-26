import ProfitsZeroButton from "@/components/settings/ProfitsZeroButton";
import SettingPrice from "@/components/settings/SettingPrice";

const SettingPage = () => {
  return (
    <>
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">الاعدادات</h1>
        <SettingPrice />
        <div className="mt-4">
          <ProfitsZeroButton />
        </div>
      </div>
    </>
  );
};

export default SettingPage;