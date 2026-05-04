import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useNews from "../../hooks/useNews";
import type { News, NewsCreateUpdatePayload } from "../../types";
import { ConfirmationModal, NewsCreateModal } from "../../components";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const NEWS_PER_PAGE = 10;

const NewsManagementPage: React.FC = () => {
  const {
    newsArticles,
    newsLoading,
    newsError,
    createNews,
    updateNews,
    deleteNews,
    isCreatingNews,
    isUpdatingNews,
    isDeletingNews,
  } = useNews();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [newsToDeleteId, setNewsToDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterIsFeatured, setFilterIsFeatured] = useState<boolean | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddNews = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const handleSubmitNews = async (
    data: NewsCreateUpdatePayload
  ): Promise<void> => {
    try {
      if (editingNews && editingNews._id) {
        await updateNews({
          id: editingNews._id,
          newsData: data,
        });
      } else {
        await createNews(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error in news creation/update:", error);
      const errorMessage =
        (error as any).response?.data?.message ||
        (error as any).message ||
        "Failed to save news article.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (id: string) => {
    setNewsToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (newsToDeleteId) {
      try {
        await deleteNews(newsToDeleteId);
        setIsConfirmDeleteModalOpen(false);
        setNewsToDeleteId(null);
      } catch (error) {
        console.error("Failed to delete news article:", error);
        toast.error("Failed to delete news article.");
      }
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setNewsToDeleteId(null);
  };

  const isSubmitting = isCreatingNews || isUpdatingNews || isDeletingNews;

  const filteredNews = useMemo(() => {
    if (!newsArticles) return [];

    return newsArticles
      .filter((news) => {
        if (searchTerm.trim() === "") {
          return true;
        }
        const term = searchTerm.toLowerCase();
        return (
          news.title.toLowerCase().includes(term) ||
          news.content.toLowerCase().includes(term) ||
          news.author.toLowerCase().includes(term) ||
          news.tags?.some((tag) => tag.toLowerCase().includes(term))
        );
      })
      .filter((news) => {
        if (filterIsFeatured === undefined) return true;
        return news.isFeatured === filterIsFeatured;
      })
      .sort((a, b) => {
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      });
  }, [newsArticles, searchTerm, filterIsFeatured]);

  const totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);

  const paginatedNews = useMemo(() => {
    return filteredNews.slice(
      (currentPage - 1) * NEWS_PER_PAGE,
      currentPage * NEWS_PER_PAGE
    );
  }, [filteredNews, currentPage]);

  if (newsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md">
        <Loader size={100} />
        <p className="text-xl font-semibold text-gray-700 mt-4">
          Loading news articles...
        </p>
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-md">
        <XCircle className="h-6 w-6 mr-2" />
        <p className="text-xl font-semibold">
          Error loading news: {newsError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">News Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search title, content, author, tags"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border text-primary border-gray-300 rounded-md"
          />
          <select
            value={
              filterIsFeatured === undefined
                ? "all"
                : filterIsFeatured.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              setFilterIsFeatured(
                value === "all" ? undefined : value === "true"
              );
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-primary border border-gray-300 rounded-md"
          >
            <option value="all">All News</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured Only</option>
          </select>
          <button
            onClick={handleAddNews}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer transition-colors shadow-md"
            disabled={isSubmitting}
          >
            <Plus size={20} className="mr-2" /> Add New Article
          </button>
        </div>
      </div>

      {paginatedNews.length > 0 ? (
        <>
          <div className="flex flex-col justify-between min-h-[600px]">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published At
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedNews.map((news) => (
                    <tr key={news._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-primary w-1/4">
                        {news.title}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-primary">
                        {news.author}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-primary">
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-primary">
                        {news.tags && news.tags.length > 0
                          ? news.tags.join(", ")
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center text-sm">
                        {news.isFeatured ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleEditNews(news)}
                            className="text-primary hover:text-primary cursor-pointer bg-blue-100 p-2 rounded-full"
                            title="Edit News Article"
                            disabled={isSubmitting}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(news._id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer bg-red-100 p-2 rounded-full"
                            title="Delete News Article"
                            disabled={isDeletingNews || isSubmitting}
                          >
                            {isDeletingNews && newsToDeleteId === news._id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 cursor-pointer rounded-full text-primary disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft className="text-primary" size={24} />
            </button>

            <span className="text-primary font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 cursor-pointer rounded-full text-primary disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight className="text-primary" size={24} />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 py-8">
          No news articles found. Click "Add New Article" to get started!
        </p>
      )}

      <NewsCreateModal
        key={editingNews ? editingNews._id : "new-news"} // Key to force re-mount and reset state
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingNews={editingNews}
        onSubmit={handleSubmitNews}
        isSubmitting={isSubmitting}
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${
          newsArticles?.find((n) => n._id === newsToDeleteId)?.title ||
          "this news article"
        }"? This action cannot be undone.`}
        isConfirming={isDeletingNews}
      />
    </div>
  );
};

export default NewsManagementPage;
