const nodemailer = require('nodemailer');

const sendEmail = async (to, data) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // تحويل البيانات القادمة إلى أسطر في جدول HTML
    // سنفترض أننا سنرسل ملخصاً للمساحة والنوع حالياً
    const htmlContent = `
        <div style="direction: rtl; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #2c3e50;">تقرير تقدير الميزانية - Smart Construction</h2>
            <p>مرحباً <strong>${data.client_name}</strong>،</p>
            <p>إليك تفاصيل الميزانية التقديرية لمشروعك (<strong>${data.project_name}</strong>):</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f8f9fa;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">البند</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">التفاصيل</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">المساحة الإجمالية</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${data.surface} متر مربع</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">نوع الميزانية</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${data.budget_type}</td>
                </tr>
                <tr style="font-weight: bold; color: #e74c3c;">
                    <td style="border: 1px solid #ddd; padding: 8px;">التكلفة الإجمالية التقديرية</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${data.total_budget_dzd} دج</td>
                </tr>
            </table>

            <p style="font-size: 12px; color: #7f8c8d;">
                * ملاحظة: تم حساب هذه الميزانية بناءً على أسعار السوق الحالية ومعامل تحويل السوق السوداء (1.7).
            </p>
        </div>
    `;

    const mailOptions = {
        from: `"Smart Construction" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `تقدير ميزانية مشروع: ${data.project_name}`,
        html: htmlContent
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };