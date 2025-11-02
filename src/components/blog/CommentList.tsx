"use client";

import { FiUser, FiCalendar, FiMessageCircle } from "react-icons/fi";
import { Comment } from "@/types/blog";

interface CommentListProps {
  comments: Comment[];
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  // Format date to Turkish locale
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format content with line breaks
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // Generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Generate consistent color for user avatar
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${getAvatarColor(comment.author)}`}>
          {getInitials(comment.author)}
        </div>
        
        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {comment.author}
            </h4>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-3 h-3" />
              <time dateTime={comment.createdAt.toISOString()}>
                {formatDate(comment.createdAt)}
              </time>
            </div>
          </div>
          
          {/* Comment Text */}
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {formatContent(comment.content)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentList({ comments }: CommentListProps) {
  // Empty state
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <FiMessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Henüz yorum yapılmamış
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Bu yazıya ilk yorumu yapan siz olun! Düşüncelerinizi ve görüşlerinizi bizimle paylaşın.
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <FiMessageCircle className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            İlk yorumu siz yapın
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-800">
        <FiMessageCircle className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {comments.length === 1 ? '1 Yorum' : `${comments.length} Yorum`}
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Comments Footer Info */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <strong>Bilgi:</strong> Bu sayfada sadece onaylanmış yorumlar gösterilmektedir. 
            Yorumlarınız moderasyon sonrası yayınlanacaktır.
          </p>
        </div>
      </div>
    </div>
  );
}