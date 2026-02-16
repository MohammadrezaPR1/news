// CommentForm.jsx
import * as yup from "yup";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { HomeContext } from "../../context/context";

const formSchema = yup.object({
  name: yup.string().required("عنوان خبر الزامی است"),
  email: yup.string().required("متن خبر الزامی است"),
  subject: yup.string().required("دسته بندی خبر را مشخص کنید"),
  description: yup.string().required("متن نظر الزامی است")
})

export default function CommentForm() {
  const { createComment } = useContext(HomeContext)
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
      newsId: id
    },
    onSubmit: (values) => {
      createComment(values)
    },
    validationSchema: formSchema,
  })



  return (

    <form
      onSubmit={formik.handleSubmit}
      className="mt-12 bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-slate-100 space-y-8 text-right relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-indigo-500 to-transparent opacity-50" />

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-slate-800">دیدگاه شما</h2>
        <p className="text-slate-400 text-sm font-bold">نظرات شما پس از تایید مدیریت منتشر خواهد شد</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-slate-700 mr-2">نام و نام خانوادگی</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-3.5 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 placeholder:text-right ${formik.touched.name && formik.errors.name ? 'border-red-100 focus:border-red-200' : 'border-slate-50 focus:border-indigo-100'}`}
            placeholder="مثال: محمد رضا"
          />
          {formik.touched.name && formik.errors.name && <p className="text-[10px] font-black text-red-500 mr-2 uppercase tracking-tighter">! {formik.errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-slate-700 mr-2">آدرس ایمیل</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-3.5 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 placeholder:text-right ${formik.touched.email && formik.errors.email ? 'border-red-100 focus:border-red-200' : 'border-slate-50 focus:border-indigo-100'}`}
            placeholder="example@email.com"
          />
          {formik.touched.email && formik.errors.email && <p className="text-[10px] font-black text-red-500 mr-2 uppercase tracking-tighter">! {formik.errors.email}</p>}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="block text-sm font-black text-slate-700 mr-2">موضوع دیدگاه</label>
        <input
          type="text"
          name="subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-3.5 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 placeholder:text-right ${formik.touched.subject && formik.errors.subject ? 'border-red-100 focus:border-red-200' : 'border-slate-50 focus:border-indigo-100'}`}
          placeholder="موضوع نظر خود را بنویسید..."
        />
        {formik.touched.subject && formik.errors.subject && <p className="text-[10px] font-black text-red-500 mr-2 uppercase tracking-tighter">! {formik.errors.subject}</p>}
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label className="block text-sm font-black text-slate-700 mr-2">متن پیام</label>
        <textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full bg-slate-50 border-2 rounded-2xl px-6 py-4 focus:bg-white transition-all outline-none font-medium text-slate-700 leading-loose placeholder:text-slate-300 placeholder:text-right ${formik.touched.description && formik.errors.description ? 'border-red-100 focus:border-red-200' : 'border-slate-50 focus:border-indigo-100'}`}
          rows="6"
          placeholder="دیدگاه خود را با جزئیات وارد کنید..."
        ></textarea>
        {formik.touched.description && formik.errors.description && <p className="text-[10px] font-black text-red-500 mr-2 uppercase tracking-tighter">! {formik.errors.description}</p>}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full md:w-fit min-w-[200px] py-4 px-10 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all font-black text-sm shadow-xl shadow-slate-100 active:scale-95"
        >
          ثبت و ارسال دیدگاه
        </button>
      </div>
    </form>
  );
}
