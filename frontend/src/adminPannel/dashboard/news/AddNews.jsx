import { useContext, useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import * as yup from "yup";
import { useFormik } from "formik";
import { AdminContext } from "../../context/context";
import { FiImage, FiVideo, FiFileText, FiLayers, FiSave, FiX, FiCheckCircle, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

const formSchema = yup.object({
    title: yup.string().required("عنوان خبر الزامی است"),
    description: yup.string().required("متن خبر الزامی است"),
    catId: yup.string().required("دسته بندی خبر را مشخص کنید"),
});

const AddNews = () => {
    const { getAllCategories, categoryList, createNews } = useContext(AdminContext);
    const [file, setFile] = useState([]);
    const [preview, setPreview] = useState("");
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);

    const loadImage = (e) => {
        const image = e.target.files[0];
        if (image) {
            setFile(image);
            setPreview(URL.createObjectURL(image));
        }
    };

    const loadImages = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages(selectedFiles);
    };

    const loadVideo = (e) => {
        const selectedVideo = e.target.files[0];
        setVideo(selectedVideo);
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            catId: "",
            file: "",
            subTitle1: "",
            subDescription1: "",
            subTitle2: "",
            subDescription2: "",
            subTitle3: "",
            subDescription3: "",
            subTitle4: "",
            subDescription4: ""
        },
        onSubmit: (values) => {
            const data = {
                title: values.title,
                description: values.description,
                catId: values.catId,
                file: file,
                images: images,
                video: video,
                subTitle1: values.subTitle1,
                subDescription1: values.subDescription1,
                subTitle2: values.subTitle2,
                subDescription2: values.subDescription2,
                subTitle3: values.subTitle3,
                subDescription3: values.subDescription3,
                subTitle4: values.subTitle4,
                subDescription4: values.subDescription4
            };
            createNews(data);
        },
        validationSchema: formSchema,
    });

    return (
        <Dashboard>
            <div dir="rtl" className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">انتشار خبر جدید</h2>
                        <p className="text-slate-500 font-bold text-xs md:text-sm">محتوای غنی و جذاب برای مخاطبان خود ایجاد کنید</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                        >
                            <FiX />
                            انصراف
                        </button>
                        <button
                            onClick={formik.handleSubmit}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                        >
                            <FiSave />
                            انتشار
                        </button>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6 md:space-y-10 pb-20">

                    {/* Section 1: General Info */}
                    <section className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-6 md:mb-10 pb-4 border-b border-slate-50 text-indigo-600">
                            <FiFileText size={22} className="shrink-0" />
                            <h3 className="text-lg font-black text-slate-800">اطلاعات پایه خبر</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:gap-10">
                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">عنوان خبر <span className="text-red-500 text-lg">*</span></label>
                                <input
                                    name="title"
                                    type="text"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-3.5 focus:bg-white transition-all outline-none font-bold text-slate-800 placeholder:text-slate-300 ${formik.touched.title && formik.errors.title ? 'border-red-100 placeholder:text-red-200' : 'border-slate-50 focus:border-indigo-100'}`}
                                    placeholder="یک عنوان جذاب بنویسید..."
                                />
                                {formik.touched.title && formik.errors.title && <p className="text-[10px] font-black text-red-500 mr-2 uppercase tracking-tighter">! {formik.errors.title}</p>}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">متن اصلی خبر <span className="text-red-500 text-lg">*</span></label>
                                <textarea
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    rows={10}
                                    className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 focus:bg-white transition-all outline-none font-medium text-slate-700 leading-loose placeholder:text-slate-300 ${formik.touched.description && formik.errors.description ? 'border-red-100 placeholder:text-red-200' : 'border-slate-50 focus:border-indigo-100'}`}
                                    placeholder="جزئیات خبر را در اینجا وارد کنید..."
                                ></textarea>
                                {formik.touched.description && formik.errors.description && <p className="text-[10px] font-black text-red-500 mr-2 uppercase tracking-tighter">! {formik.errors.description}</p>}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">پیشوند یا دسته‌بندی <span className="text-red-500 text-lg">*</span></label>
                                <div className="relative">
                                    <select
                                        name="catId"
                                        value={formik.values.catId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-indigo-100 transition-all outline-none font-bold text-slate-800 appearance-none pl-12"
                                    >
                                        <option value="">انتخاب دسته مناسب</option>
                                        {categoryList.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <FiLayers size={20} />
                                    </div>
                                </div>
                                {formik.touched.catId && formik.errors.catId && <p className="text-[10px] font-black text-red-500 mr-2 uppercase tracking-tighter">! {formik.errors.catId}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Media */}
                    <section className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-6 md:mb-10 pb-4 border-b border-slate-50 text-indigo-600">
                            <FiImage size={22} className="shrink-0" />
                            <h3 className="text-lg font-black text-slate-800">رسانه و چندرسانه‌ای</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-700 mr-2 block">تصویر شاخص (اصلی)</label>
                                <div className="relative group">
                                    <div className={`aspect-video rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all overflow-hidden ${preview ? 'border-indigo-200 bg-white shadow-inner' : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50'}`}>
                                        {preview ? (
                                            <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all"><FiPlus size={24} /></div>
                                                <div className="text-center">
                                                    <p className="text-xs md:text-sm font-black text-slate-600 mb-1">بارگذاری تصویر</p>
                                                    <p className="text-[10px] font-bold text-slate-400">فرمت‌های مجاز (JPG, PNG)</p>
                                                </div>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={loadImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={() => { setPreview(""); setFile([]) }}
                                            className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:-rotate-12"
                                        >
                                            <FiX size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-700 mr-2 block">ویدیو برای خبر (اختیاری)</label>
                                <div className="aspect-video rounded-[24px] border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 transition-all flex flex-col items-center justify-center gap-4 relative group overflow-hidden">
                                    {video ? (
                                        <div className="flex flex-col items-center p-6 text-center">
                                            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                                                <FiCheckCircle size={32} />
                                            </div>
                                            <p className="text-sm font-black text-slate-700 leading-snug">{video.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">ویدیوی اصلی آپلود شد</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all"><FiVideo size={24} /></div>
                                            <div className="text-center">
                                                <p className="text-xs md:text-sm font-black text-slate-600 mb-1">بارگذاری ویدیو</p>
                                                <p className="text-[10px] font-bold text-slate-400">حجم زیر ۲۰ مگابایت</p>
                                            </div>
                                        </>
                                    )}
                                    <input type="file" accept="video/*" onChange={loadVideo} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-4">
                                <label className="text-sm font-black text-slate-700 mr-2 block">سایر تصاویر (گالری خبر)</label>
                                <div className="p-6 md:p-8 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/30">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        {images.map((img, index) => (
                                            <div key={index} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white relative group">
                                                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                                                <button
                                                    type="button"
                                                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                    className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]"
                                                >
                                                    <FiX size={24} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300 cursor-pointer hover:border-indigo-400 hover:text-indigo-400 hover:bg-white transition-all">
                                            <FiPlus size={32} />
                                            <input type="file" multiple accept="image/*" onChange={loadImages} className="hidden" />
                                        </label>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 mt-6 uppercase tracking-[0.1em] text-center md:text-right">میتوانید چندین تصویر همزمان انتخاب کنید تا یک اسلایدر در خبر داشته باشید</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Sub-Sections */}
                    <section className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-6 md:mb-10 pb-4 border-b border-slate-50 text-indigo-600">
                            <FiLayers size={22} className="shrink-0" />
                            <h3 className="text-lg font-black text-slate-800">بخش‌های تکمیلی خبر</h3>
                        </div>

                        <div className="space-y-6 md:space-y-8">
                            {[1, 2, 3, 4].map((num) => (
                                <div key={num} className="p-6 md:p-8 rounded-[24px] bg-slate-50/50 border border-slate-100 space-y-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center justify-center">۰{num}</span>
                                        <h4 className="text-sm font-black text-slate-700 tracking-tight">بخش تکمیلی شماره {num}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <input
                                                name={`subTitle${num}`}
                                                type="text"
                                                value={formik.values[`subTitle${num}`]}
                                                onChange={formik.handleChange}
                                                className="w-full bg-white border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:border-indigo-100 outline-none font-bold text-sm text-slate-800 placeholder:text-slate-300 transition-all shadow-sm"
                                                placeholder={`یک تیتر فرعی بنویسید...`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <textarea
                                                name={`subDescription${num}`}
                                                value={formik.values[`subDescription${num}`]}
                                                onChange={formik.handleChange}
                                                rows={5}
                                                className="w-full bg-white border-2 border-slate-50 rounded-2xl px-6 py-4 focus:border-indigo-100 outline-none font-medium text-sm text-slate-600 leading-relaxed placeholder:text-slate-300 transition-all shadow-sm"
                                                placeholder="توضیحات تکمیلی این بخش را اینجا وارد کنید..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </form>
            </div>
        </Dashboard>
    );
};

export default AddNews;
