import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import useSingleNews from "../../hooks/useSingleNews";
import Loader from "../../components/Loader";

const NewsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { singleNews, singleNewsLoading, singleNewsError } = useSingleNews(id);

  if (singleNewsLoading)
    return (
      <div className="text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[200px]">
        <Loader size={100} />
      </div>
    );

  if (singleNewsError || !singleNews)
    return <p className="text-center text-red-600 mt-12">News not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#003b75] mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
      </button>

      {singleNews.imageUrl && (
        <div className="w-full h-[60vh] mb-8 overflow-hidden rounded-xl shadow-md">
          <img
            src={singleNews.imageUrl}
            alt={singleNews.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#003b75] mb-2">
        {singleNews.title}
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        By {singleNews.author} •{" "}
        {format(new Date(singleNews.publishedAt), "PPP")}
      </p>

      {singleNews.tags?.length ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {singleNews.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-[#003b75] text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
        {singleNews.content}
      </p>
    </div>
  );
};

export default NewsDetails;
