const express = require('express');
const router = express.Router();
const estimationController = require('../controllers/estimationController');

/**
 * المسار الرئيسي: يقوم بحساب الميزانية بناءً على المساحة (Surface) 
 * ويقوم بإرسال الإيميل تلقائياً إذا تم تزويده في الطلب (Request Body)
 */
router.post('/calculate', estimationController.calculateEstimation);

/**
 * مسار حساب فئة معينة (مثل الأساسات أو التشطيبات فقط)
 */
router.post('/calculate/category', estimationController.calculateCategory);

/**
 * مسار توليد ملف PDF للتقرير النهائي
 */
router.post('/pdf/generate', estimationController.generatePDF);

/**
 * مسار إرسال الإيميل بشكل منفصل (إذا أردتِ إرساله لاحقاً وليس وقت الحساب)
 */
router.post('/email/send', estimationController.sendEmail);

module.exports = router;     