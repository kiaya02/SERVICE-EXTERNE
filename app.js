// 1. رابط مشروعك (جاهز)
const supabaseUrl = 'https://zokfxcpdhrvdottkkskf.supabase.co'

// 2. الكود الذي نسختِه الآن (ضعيه بين العلامتين ' ')
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2Z4Y3BkaHJ2ZG90dGtrc2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTkzMDgsImV4cCI6MjA4OTMzNTMwOH0.WBr0q7TGJeTZIpjMCHRV5uKNaYdWNlU2mPCi0BXotpA'

// استدعاء مكتبة Supabase للعمل
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// إنشاء الاتصال الفعلي
const supabase = createClient(supabaseUrl, supabaseKey)

// رسالة للتأكد من أن كل شيء يعمل
console.log("مبروك! مشروع SERVICE-EXTERNE متصل الآن بقاعدة بيانات Supabase.");