"use client";

import { useState } from "react";
import { FiUser, FiMail, FiMessageSquare, FiSend, FiLoader } from "react-icons/fi";
import { CreateCommentRequest } from "@/types/blog";

interface CommentFormProps {
  postId: string;
}

interface FormData {
  author: string;
  email: string;
  content: string;
}

interface FormErrors {
  author?: string;
  email?: string;
  content?: string;
  submit?: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    author: "",
    email: "",
    content: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Author validation
    if (!formData.author.trim()) {
      newErrors.author = "İsim alanı zorunludur";
    } else if (formData.author.trim().length < 2) {
      newErrors.author = "İsim en az 2 karakter olmalıdır";
    } else if (formData.author.trim().length > 50) {
      newErrors.author = "İsim en fazla 50 karakter olabilir";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "E-posta alanı zorunludur";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = "Yorum alanı zorunludur";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Yorum en az 10 karakter olmalıdır";
    } else if (formData.content.trim().length > 1000) {
      newErrors.content = "Yorum en fazla 1000 karakter olabilir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if it exists
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const commentData: CreateCommentRequest = {
        postId,
        author: formData.author.trim(),
        email: formData.email.trim(),
        content: formData.content.trim(),
      };

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Yorum gönderilirken bir hata oluştu");
      }

      // Success - reset form and show success message
      setFormData({ author: "", email: "", content: "" });
      setIsSubmitted(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error("Comment submission error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Yorum gönderilirken bir hata oluştu"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-green-800 dark:text-green-200 font-medium">
              Yorumunuz başarıyla gönderildi!
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">
              Yorumunuz onaylandıktan sonra yayınlanacaktır.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" rounded-lg p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Yorum Yapın
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Author Field */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            İsim *
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.author 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Adınız"
              disabled={isSubmitting}
            />
          </div>
          {errors.author && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-posta *
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="email@example.com"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            E-posta adresiniz yayınlanmayacaktır.
          </p>
        </div>

        {/* Content Field */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Yorum *
          </label>
          <div className="relative">
            <FiMessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <textarea
              id="content"
              name="content"
              rows={4}
              value={formData.content}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                errors.content 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Yorumunuzu yazın..."
              disabled={isSubmitting}
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.content.length}/1000 karakter
          </p>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              <span>Gönderiliyor...</span>
            </>
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              <span>Yorum Gönder</span>
            </>
          )}
        </button>

        {/* Info Message */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Not:</strong> Yorumlar moderasyon sonrası yayınlanır. Lütfen saygılı ve yapıcı yorumlar yazınız.
          </p>
        </div>
      </form>
    </div>
  );
}