import ProfitsZeroButton from "@/components/settings/ProfitsZeroButton";
import SettingPrice from "@/components/settings/SettingPrice";
import TableOfZeroButton from "@/components/settings/TableOfZeroButton";

const SettingPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">الإعدادات</h1>
      
      <div className="space-y-6">
        {/* Pricing Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-right text-gray-700">إعدادات الأسعار</h2>
          <SettingPrice />
        </div>

        {/* Profits Button Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-right text-gray-700">إدارة الأرباح</h2>
          <ProfitsZeroButton />
        </div>

        {/* Updates Table Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-right text-gray-700">سجل التحديثات</h2>
          <TableOfZeroButton />
        </div>
      </div>
    </div>
  );
};

export default SettingPage;