import { useContext, useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiEye, FiSearch, FiPlus, FiVideo, FiClock, FiX, FiAlertTriangle, FiPlayCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import Dashboard from "../Dashboard";
import { AdminContext } from "../../context/context";
import { motion, AnimatePresence } from "framer-motion";

const ViewVideos = () => {
  const { getAllVideos, videosList, deleteVideo } = useContext(AdminContext);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    getAllVideos?.();
  }, [getAllVideos]);

  const normalizedSearch = search?.toString().trim().toLowerCase();
  const filteredVideos = (videosList || []).filter((v) =>
    (v?.title || "").toLowerCase().includes(normalizedSearch)
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (videoToDelete?.id) {
      try {
        await deleteVideo(videoToDelete.id);
      } catch (e) {
        console.error("deleteVideo error:", e);
      }
    }
    setShowDeleteModal(false);
    setVideoToDelete(null);
  };

  return (
    <Dashboard>
      <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">مدیریت ویدیوها</h2>
            <p className="text-slate-500 font-bold text-sm">بارگذاری و مدیریت محتوای ویدیویی رسانه</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 max-w-2xl">
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 w-full flex-1">
              <FiSearch className="text-slate-400" size={20} />
              <input
                type="text"
                placeholder="جستجو در عنوان ویدیو..."
                className="bg-transparent border-none focus:ring-0 w-full text-sm font-bold text-slate-700 placeholder:text-slate-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link
              to="/admin-add-video"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 transition-all hover:-translate-y-0.5 w-full sm:w-auto shrink-0"
            >
              <FiPlus size={20} />
              <span>افزودن ویدیو</span>
            </Link>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest w-24 text-center">ردیف</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">عنوان ویدیو</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">توضیحات کوتاه</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">تاریخ آپلود</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVideos.length > 0 ? filteredVideos.map((video, index) => (
                  <tr key={video?.id || index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 text-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mx-auto">
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                          <FiVideo size={20} />
                        </div>
                        <div className="font-black text-slate-800 text-sm">{video?.title || "بدون عنوان"}</div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-bold text-slate-500 max-w-[250px] truncate leading-relaxed">
                        {video?.description || "بدون توضیح"}
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-xs font-black text-slate-400 flex items-center justify-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl w-fit mx-auto">
                        <FiClock size={12} />
                        {new Date(video.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </td>
                    <td className="p-6 text-left">
                      <div className="flex items-center justify-end gap-2 text-indigo-500">
                        <button
                          onClick={() => setPreviewVideo(video)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-indigo-50 hover:scale-110 transition-all"
                        >
                          <FiEye size={16} />
                        </button>
                        <Link
                          to={`/admin-edit-video/${video?.id}`}
                          state={video}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-500 hover:scale-110 transition-all"
                        >
                          <FiEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(video)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-500 hover:scale-110 transition-all"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredVideos.length > 0 ? filteredVideos.map((video, index) => (
            <div key={video?.id || index} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 shadow-inner">
                  <FiVideo size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-slate-800 text-sm truncate">{video?.title || "بدون عنوان"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FiClock size={10} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400">{new Date(video.createdAt).toLocaleDateString("fa-IR")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewVideo(video)}
                    className="flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                  >
                    <FiEye size={14} />
                    پیش‌نمایش
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin-edit-video/${video?.id}`}
                    state={video}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-500 active:scale-90 transition-all"
                  >
                    <FiEdit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(video)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 active:scale-90 transition-all"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          )) : null}
        </div>

        {filteredVideos.length === 0 && (
          <div className="p-20 text-center bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200"><FiVideo size={32} /></div>
              <p className="text-slate-400 font-bold">هیچ ویدیویی یافت نشد.</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewVideo(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-[40px] shadow-2xl relative z-10 w-full max-w-4xl overflow-hidden"
              dir="rtl"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FiPlayCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{previewVideo.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400">تاریخ انتشار: {new Date(previewVideo.createdAt).toLocaleDateString("fa-IR")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center hover:text-rose-500 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center">
                {previewVideo.url && (
                  <video
                    src={previewVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              {previewVideo.description && (
                <div className="p-8 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">توضیحات تکمیلی</span>
                  </div>
                  <p className="text-slate-600 font-bold text-sm leading-8 whitespace-pre-line">
                    {previewVideo.description}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-[32px] p-8 shadow-2xl relative z-10 w-full max-w-sm text-center"
              dir="rtl"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FiAlertTriangle size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">حذف ویدیو</h3>
              <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
                آیا از حذف ویدیو <span className="text-slate-800">"{videoToDelete?.title}"</span> مطمئن هستید؟ این فایل برای همیشه پاک خواهد شد.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 h-12 rounded-2xl font-black text-sm transition-all"
                >
                  انصراف
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-rose-500 hover:bg-rose-600 text-white h-12 rounded-2xl font-black text-sm shadow-lg shadow-rose-100 transition-all"
                >
                  حذف قطعی
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Dashboard>
  );
};

export default ViewVideos;
