const estimationService = require('../services/estimationService');
const materialService = require('../services/materialService');
const emailService = require('../services/emailService');
const serviceService = require('../services/serviceService');
const exchangeService = require('../services/exchangeService');
const { generatePDF } = require('../services/pdfService');

const calculateEstimation = async (req, res) => {
    try {
        const { surface, budget_type, client_name, project_name, email } = req.body;

        if (!surface) {
            return res.status(400).json({ success: false, message: "المساحة مطلوبة" });
        }

        // جلب البيانات (تأكدي أن الفانكشنز هادو موجودين في الـ services)
        const materials = await materialService.getAllMaterials(); 
        const services = await serviceService.getAllServices(); 
        const exchangeData = await exchangeService.getDZDExchangeRate(); 

        const priceColumn = budget_type === 'optimiste' ? 'min_price_usd' : 
                            budget_type === 'pessimiste' ? 'max_price_usd' : 'unit_price_usd'; 

        let totalUsd = 0;
        materials.forEach(mat => {
            totalUsd += (surface * (mat[priceColumn] || 0)) * (1 + (mat.default_waste_factor || 0)); 
        });

        services.forEach(ser => {
            totalUsd += (surface * (ser.install_labor_price || 0)); 
        });

        const totalDzd = totalUsd * (exchangeData.coefficient  ||1.7) * (exchangeData.official_rate || 1); 

        res.status(200).json({
            success: true,
            data: { total_dzd: totalDzd.toFixed(2), total_usd: totalUsd.toFixed(2) }
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { calculateEstimation ,
    generatPDF,
    sendEmail,
    calculateCategory
};
