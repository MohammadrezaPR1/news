import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaTelegramPlane, FaWhatsapp, FaTwitter, FaFacebookF, FaHeart } from "react-icons/fa";

import NewsMain from "./NewsMain";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Footer from "../Footer";
import Navbar from "../Navbar";

import banner from "../../../assets/home/banner1.gif";
import banner2 from "../../../assets/home/banner2.gif";
import banner3 from "../../../assets/home/banner3.gif";
import banner4 from "../../../assets/home/banner4.gif";

import { HomeContext } from "../../context/context";
import LastRelatedNews from "./LastRelatedNews";

export default function NewsDetail() {
  const { state } = useLocation();
  const { id } = useParams();
  const { loadNewsDtail, likeNews } = useContext(HomeContext);

  const banners = [banner, banner2, banner3, banner4];
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const effectRan = useRef(false);

  useEffect(() => {
    // اگر قبلاً اجرا شده، دوباره اجرا نکن
    if (effectRan.current === false) {
      loadNewsDtail(id);
      effectRan.current = true;
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [id]);

  // کلیک روی دکمه لایک
  const handleLike = async () => {
    try {
      const res = await likeNews(id);
      if (res && res.data && !res.data.error) {
        setIsLiked(true);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1200);
        await loadNewsDtail(id);
      }
    } catch (error) {
      console.error("خطا در ثبت لایک:", error);
    }
  };

  // دکمه‌های اشتراک گذاری
  const shareButtons = [
    {
      icon: <FaTelegramPlane />,
      color: "bg-blue-500",
      link: `https://t.me/share/url?url=${window.location.href}`,
    },
    {
      icon: <FaWhatsapp />,
      color: "bg-green-500",
      link: `https://wa.me/?text=${window.location.href}`,
    },
    {
      icon: <FaTwitter />,
      color: "bg-sky-500",
      link: `https://twitter.com/intent/tweet?url=${window.location.href}`,
    },
    {
      icon: <FaFacebookF />,
      color: "bg-blue-700",
      link: `https://facebook.com/sharer/sharer.php?u=${window.location.href}`,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex justify-center bg-[#fdfdfd] min-h-screen p-4 md:pt-12">
        {/* بخش اشتراک‌گذاری در دسکتاپ */}
        <div className="hidden lg:flex flex-col gap-4 w-14 items-center bg-white rounded-2xl shadow-sm border border-slate-100 p-3 h-fit sticky top-28">
          {shareButtons.map((btn, i) => (
            <a
              key={i}
              href={btn.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn.color} text-white p-2.5 rounded-xl hover:scale-110 transition-transform shadow-sm`}
            >
              {btn.icon}
            </a>
          ))}
        </div>

        {/* بخش اصلی خبر */}
        <div className="w-full lg:w-3/5 lg:mx-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] overflow-hidden p-6 md:p-12 border border-slate-50 relative">
          <NewsMain data={state} />

          {/* بخش لایک خبر */}
          <div className="mt-12 mb-12 text-center bg-slate-50 rounded-[32px] p-8 border border-slate-100">
            <h3 className="text-slate-800 text-xl font-black mb-2">
              این مطلب برای شما مفید بود؟
            </h3>
            <p className="text-slate-400 text-sm font-bold mb-6">با لایک خود از نویسنده حمایت کنید</p>
            <button
              onClick={handleLike}
              disabled={isLiked}
              className={`flex items-center justify-center gap-3 mx-auto px-10 py-4 rounded-2xl font-black transition-all duration-300 shadow-xl active:scale-95 ${isLiked ? "bg-green-500 text-white shadow-green-100" : "bg-white text-red-500 hover:bg-red-50 shadow-slate-100"
                }`}
            >
              <FaHeart className={`text-xl ${isLiked ? "" : ""}`} />
              {isLiked ? "پسندیده شد" : "لایک این خبر"}
            </button>
          </div>

          {/* دکمه‌های اشتراک گذاری در موبایل */}
          <div className="lg:hidden">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">اشتراک گذاری</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>
            <div className="flex justify-center gap-4">
              {shareButtons.map((btn, i) => (
                <a
                  key={i}
                  href={btn.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn.color} text-white p-3.5 rounded-2xl hover:scale-110 transition-transform shadow-lg`}
                >
                  {btn.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="my-14 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

          {/* فرم و لیست نظرات */}
          <LastRelatedNews />
          <CommentForm />
          <CommentList />
        </div>

        {/* تبلیغات سمت راست */}
        <div className="hidden lg:flex flex-col gap-6 w-1/5 sticky top-28 h-fit">
          <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-300 mb-4 uppercase tracking-[0.2em] text-center">تبلیغات پیشنهادی</h4>
            <div className="space-y-4">
              {banners.map((ad, i) => (
                <a
                  key={i}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={ad}
                    alt={`banner-${i + 1}`}
                    className="rounded-2xl shadow-sm border border-slate-50 w-full"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
