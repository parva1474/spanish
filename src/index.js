export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // اگر ربات Spanish بود، مسیرش را از Jadvalsharh جدا کن
    if (url.pathname === "/spanish") {
       // اینجا کدهای مخصوص ربات اسپانیایی را بنویس
       return new Response("Spanish Bot Working");
    }
    
    // کدهای ربات جدول در مسیر پیش‌فرض /webhook
    return new Response("Jadval Bot Working");
  }
};
