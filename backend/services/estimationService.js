
const { getDZDExchangeRate } = require('./exchangeService');
/**
 * الوظيفة الأساسية لحساب التقدير المالي
 */
const calculateEstimation = async (data) => {
    const { budget_type, materiaux = [], services = [] } = data;

    // 1. جلب سعر الصرف الحالي
    const rate = await getDZDExchangeRate();
    if (!rate) throw new Error("تعذر جلب سعر الصرف حالياً");

    // 2. تحديد نوع السعر
    const priceKey = budget_type === 'optimiste' ? 'min_price_usd' : 
                     budget_type === 'pessimiste' ? 'max_price_usd' : 'unit_price_usd';

    let total_materiaux_dzd = 0;
    let detail_materiaux = [];

    // 3. حساب تكلفة المواد
    materiaux.forEach(mat => {
        const unitPrice = Number(mat[priceKey]) || Number(mat.unit_price_usd) || 0;
        const waste = Number(mat.default_waste_factor) || 0;
        
        // الحساب الفعلي (يبقى رقم)
        const subtotal = mat.quantite * unitPrice * rate * (1 + waste);
        total_materiaux_dzd += subtotal;
        
        detail_materiaux.push({
            material_name: mat.material_name,
            subtotal_dzd: Number(subtotal.toFixed(2)) // نحوله لنص ثم نعيده لرقم فوراً
        });
    });

    let total_services_dzd = 0;
    let detail_services = [];

    // 4. حساب تكلفة الخدمات
    services.forEach(svc => {
        // نضمن أن كل القيم أرقام لتجنب NaN
        const equip = Number(svc.equipment_cost) || 0;
        const power = Number(svc.manpower_cost) || 0;
        const labor = Number(svc.install_labor_price) || Number(svc.unit_price_usd) || 0;

        const costPerUnit = equip + power + labor;
        const subtotal = svc.quantite * costPerUnit * (svc.equipment_cost ? 1 : rate); // إذا كانت خدمات محلية لا نضرب في الصرف إلا إذا كانت بالدولار
        
        total_services_dzd += subtotal;

        detail_services.push({
            service_name: svc.service_name,
            subtotal_dzd: Number(subtotal.toFixed(2))
        });
    });

    // 5. الميزانية الإجمالية مع إضافة الـ Market Factor (1.7)
    const market_factor = 1.7;
    const final_total = (total_materiaux_dzd + total_services_dzd) * market_factor;

    return {
        success: true,
        data: {
            budget_type,
            project_name: data.project_name || "مشروع جديد",
            client_name: data.client_name || "زبون كريم",
            exchange_rate_used: rate,
            detail_materiaux,
            detail_services,
            // نستخدم Number() لضمان أن النتيجة رقم نقي
            total_budget_dzd: Number(final_total.toFixed(2)) 
        }
    };
};

module.exports = {
    calculateEstimation
};