const supabase = require('../../supabaseClient');

// 1. جلب الإعدادات الحالية
const getSettings = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .single(); // نجلب سطر واحد فقط يحتوي على كل الإعدادات

        if (error) {
            // إذا لم يوجد جدول بعد، نرسل القيم الافتراضية التي اتفقنا عليها
            return res.status(200).json({
                success: true,
                data: {
                    black_market_factor: 1.7,
                    usd_to_dzd_base: 225.31,
                    default_vat: 0.19 // ضريبة القيمة المضافة مثلاً
                }
            });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. تحديث الإعدادات
const updateSettings = async (req, res) => {
    try {
        const updatedData = req.body;
        const { data, error } = await supabase
            .from('settings')
            .update(updatedData)
            .eq('id', 1); // نحدث الإعدادات في السطر رقم 1 دائماً

        if (error) throw error;
        res.status(200).json({ success: true, message: "Settings updated successfully", data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};