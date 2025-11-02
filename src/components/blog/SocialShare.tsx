"use client";

import { FiTwitter, FiLinkedin, FiFacebook } from "react-icons/fi";
import { BlogPost } from "@/types/blog";

// Social Sharing Component
const SocialShare = ({ post, url }: { post: BlogPost, url: string }) => {
  const shareData = {
    title: post.title,
    url: url,
    text: post.excerpt || post.title
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Paylaş:</span>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
        title="Twitter'da Paylaş"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.295 1.634 4.208 3.803 4.649-.666.18-1.371.226-2.093.084.616 1.922 2.397 3.313 4.512 3.354-1.786 1.399-4.049 2.16-6.447 2.16-.42 0-.834-.025-1.242-.073 2.298 1.472 5.025 2.327 7.95 2.327 9.49 0 14.693-7.86 14.693-14.693 0-.224-.004-.448-.014-.67.962-.695 1.797-1.562 2.457-2.544z"></path></svg>
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
        title="LinkedIn'de Paylaş"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
        title="Facebook'ta Paylaş"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg>
      </a>
    </div>
  );
};

export default SocialShare;
