import { useState, useRef } from "react";
import {
  Plus,
  Search,
  Calendar,
  User,
  X,
  ImagePlus,
  Tag,
  Globe,
  FileText,
  Trash2,
  Loader2,
  
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from 'sweetalert2';
import { getBlogs, createBlog, updateBlog, deleteBlog } from "@/api/endpoints/blogs.api";
import type { Blog } from "@/api/endpoints/blogs.api";
import { uploadAttachment } from "@/api/endpoints/attachments.api";
import { getCategories } from "@/api/endpoints/categories.api";
import { getDoctors } from "@/api/endpoints/dashboard/doctorManagement";

export default function BlogPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [status, setStatus] = useState("draft");
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: blogsData, isLoading, isError } = useQuery({
    queryKey: ["admin-blogs", searchQuery, statusFilter, page],
    queryFn: () =>
      getBlogs({
        search: searchQuery || undefined,
        isPublished:
          statusFilter === "all" ? undefined : statusFilter === "published",
        page,
        limit: 12,
      }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => getCategories({ limit: 100 }),
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: () => getDoctors({ limit: 100 }),
  });

  const blogs = blogsData?.data || [];
  const categoriesList = categoriesData?.data || [];
  const providersList = doctorsData?.data || [];

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      let featuredImageId = "";
      if (coverFile) {
        const uploadRes = await uploadAttachment(coverFile, "PUBLIC");
        featuredImageId = uploadRes.id;
      }

      const payload: any = {
        title,
        content,
        categoryId,
        providerId,
        isPublished: status === "published",
      };

      if (featuredImageId) {
        payload.featuredImageId = featuredImageId;
      }

      if (editingBlogId) {
        await updateBlog(editingBlogId, payload);
      } else {
        await createBlog(payload);
      }

      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      closeModal();
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(id);
        queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
        Swal.fire("Deleted!", "The blog has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete blog:", error);
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const TITLE_LIMIT = 100;
  const wordCount = stripHtml(content).trim() ? stripHtml(content).trim().split(/\s+/).length : 0;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
      setCoverFile(file);
    }
  };

  const resetForm = () => {
    setEditingBlogId(null);
    setCoverImage(null);
    setCoverFile(null);
    setTitle("");
    setContent("");
    setCategoryId("");
    setProviderId("");
    setStatus("draft");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    resetForm();
    setEditingBlogId(blog.id);
    setTitle(blog.title);
    setContent(blog.content || "");
    setCategoryId(blog.categoryId || "");
    setProviderId(blog.providerId || "");
    setStatus(blog.isPublished ? "published" : "draft");
    if (blog.featuredImage?.fileUrl) {
      setCoverImage(blog.featuredImage.fileUrl);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Blog Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create, edit, and manage your blog posts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#1447E6] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create Blog
        </button>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search blogs..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all bg-white"
          />
        </div>
        {/* <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-slate-200 bg-white text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div> */}
      </div>

      {/* Blog Cards Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#1447E6]" size={40} />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          Failed to load blogs. Please try again.
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">
          No blogs found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {blogs.map((blog: Blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden border-b border-slate-100">
                <img
                  src={blog.featuredImage?.fileUrl || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"}
                  alt={blog.title}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image";
                  }}
                  className="relative z-10 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 z-20">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-sm ${
                      blog.isPublished
                        ? "bg-green-100/90 text-green-700 border border-green-200"
                        : "bg-slate-100/90 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                {/* Author and Date on the same line */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-2.5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    {blog.provider?.avatar?.fileUrl ? (
                      <img 
                        src={blog.provider.avatar.fileUrl} 
                        alt="Author" 
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <User size={12} className="text-slate-400" />
                      </div>
                    )}
                    <span className="truncate max-w-[140px]">
                      {blog.provider?.name || (blog.provider as any)?.fullName || blog.author?.name || "Unknown Author"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar size={12} className="text-slate-400" />
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#1447E6] transition-colors">
                  {blog.title}
                </h3>
                <div className="flex-1 mt-1.5">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {stripHtml(blog.content)}
                  </p>
                </div>

                {/* Edit and Delete Buttons exactly like the screenshot */}
                <div className="mt-auto pt-4 flex items-center gap-2">
                  <button 
                    onClick={() => openEditModal(blog)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#1447E6] font-medium text-sm py-2 rounded-xl transition-colors text-center"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="bg-[#FFF1F2] hover:bg-[#FFE4E6] text-red-500 p-2 rounded-xl transition-colors flex-shrink-0 flex items-center justify-center aspect-square"
                    aria-label="Delete blog"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && blogsData?.meta && blogsData.meta.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-xl border border-slate-200 shadow-sm mt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(blogsData.meta.totalPages, p + 1))}
              disabled={page === blogsData.meta.totalPages}
              className="relative ml-3 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-semibold text-slate-900">{(page - 1) * 12 + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(page * 12, blogsData.meta.total)}</span> of <span className="font-semibold text-slate-900">{blogsData.meta.total}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-lg px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                {/* Pages */}
                {Array.from({ length: blogsData.meta.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 transition-colors ${
                      page === i + 1
                        ? "z-10 bg-[#1447E6] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1447E6]"
                        : "text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(blogsData.meta.totalPages, p + 1))}
                  disabled={page === blogsData.meta.totalPages}
                  className="relative inline-flex items-center rounded-r-lg px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingBlogId ? "Edit Blog" : "Create New Blog"}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {editingBlogId ? "Update your blog details below" : "Fill in the details below to publish a new post"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {coverImage ? (
                  <div className="relative h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center group shadow-sm">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm font-medium bg-white text-slate-700 rounded-lg shadow-md hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                      >
                        <ImagePlus size={16} />
                        Replace Image
                      </button>
                      <button
                        onClick={() => {
                          setCoverImage(null);
                          setCoverFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="p-2 bg-white text-red-600 rounded-lg shadow-md hover:bg-red-50 hover:text-red-700 transition-colors"
                        aria-label="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-52 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 hover:bg-[#1447E6]/5 hover:border-[#1447E6]/50 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <ImagePlus size={20} className="text-slate-400 group-hover:text-[#1447E6] transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-[#1447E6] transition-colors">Click to upload featured image</p>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">SVG, PNG, JPG or WEBP (max. 5MB)</p>
                  </button>
                )}
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-xs ${title.length > TITLE_LIMIT ? "text-red-500" : "text-slate-400"}`}>
                    {title.length}/{TITLE_LIMIT}
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, TITLE_LIMIT))}
                  placeholder="Enter a catchy, descriptive title"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                />
              </div>

              {/* Category & Provider & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                    <Tag size={14} className="text-slate-400" />
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all bg-white"
                  >
                    <option value="">Select category</option>
                    {categoriesList.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                    <User size={14} className="text-slate-400" />
                    Provider (Author)
                  </label>
                  <select
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all bg-white"
                  >
                    <option value="">Select provider</option>
                    {providersList.map((doc: any) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                    <Globe size={14} className="text-slate-400" />
                    Visibility
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all bg-white"
                  >
                    <option value="draft">Save as draft</option>
                    <option value="published">Publish now</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <FileText size={14} className="text-slate-400" />
                    Content <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400">{wordCount} {wordCount === 1 ? "word" : "words"}</span>
                </div>
                <div className="bg-white [&_.quill]:flex [&_.quill]:flex-col [&_.quill]:h-[350px] [&_.quill]:mb-12 [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-slate-200 [&_.ql-container]:flex-1 [&_.ql-editor]:text-sm [&_.ql-editor]:text-slate-700">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    placeholder="Write your blog content here..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-400 hidden sm:block">
                Fields marked <span className="text-red-500">*</span> are required
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!title.trim() || !stripHtml(content).trim() || !categoryId || !providerId || isPublishing}
                  className="px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white bg-[#1447E6] hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : status === "published" ? (
                    editingBlogId ? "Update Blog" : "Publish Blog"
                  ) : (
                    "Save Draft"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}