// import { useNavigate, useParams } from "react-router";
// import { format } from "date-fns";
// import { ArrowLeft } from "lucide-react";
// import useSingleNews from "../../hooks/useSingleNews";
// import Loader from "../../components/Loader";

// const ArticlesDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const { singleNews, singleNewsLoading, singleNewsError } = useSingleNews(id);

//   if (singleNewsLoading)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white">
//         <Loader size={100} />
//       </div>
//     );

//   if (singleNewsError || !singleNews)
//     return <p className="text-center text-red-600 mt-12">News not found.</p>;

//   return (
//     <div className="max-w-4xl mx-auto px-4">
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center text-[#003b75] mb-4 cursor-pointer"
//       >
//         <ArrowLeft className="w-5 h-5 mr-1" />
//       </button>

//       {singleNews.imageUrl && (
//         <div className="w-full h-[60vh] mb-8 overflow-hidden rounded-xl shadow-md">
//           <img
//             src={singleNews.imageUrl}
//             alt={singleNews.title}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       )}

//       <h1 className="text-3xl font-bold text-[#003b75] mb-2">
//         {singleNews.title}
//       </h1>
//       <p className="text-sm text-gray-600 mb-4">
//         By {singleNews.author} •{" "}
//         {format(new Date(singleNews.publishedAt), "PPP")}
//       </p>

//       {singleNews.tags?.length ? (
//         <div className="mb-4 flex flex-wrap gap-2">
//           {singleNews.tags.map((tag, i) => (
//             <span
//               key={i}
//               className="bg-blue-100 text-[#003b75] text-xs px-2 py-1 rounded-full"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>
//       ) : null}

//       <p className="text-gray-800 leading-relaxed whitespace-pre-line">
//         {singleNews.content}
//       </p>
//     </div>
//   );
// };

// export default ArticlesDetails;

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Share2,
  Calendar,
  User,
  Tag,
  Link as LinkIcon,
} from "lucide-react";
import useSingleNews from "../../hooks/useSingleNews";
import Loader from "../../components/Loader";

const fallbackImg = "/zinme.jpg";

const ArticlesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { singleNews, singleNewsLoading, singleNewsError } = useSingleNews(id);

  // Reading progress bar
  const articleRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [singleNewsLoading]);

  // Reading time (avg ~200 wpm)
  const readingTime = useMemo(() => {
    if (!singleNews?.content) return null;
    const words = singleNews.content.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  }, [singleNews?.content]);

  // Share handlers
  const handleShare = async () => {
    const url = window.location.href;
    const title = singleNews?.title ?? "Article";
    const text = singleNews?.content?.slice(0, 120) ?? title;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch {
      // no-op
    }
  };

  if (singleNewsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader size={100} />
      </div>
    );
  }

  if (singleNewsError || !singleNews) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="font-semibold text-lg">News not found</p>
          <p className="text-sm mt-1">
            {singleNewsError?.message || "Please go back and try again."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  const cover = singleNews.imageUrl || fallbackImg;

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header with back/share + reading progress */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-[#003b75] font-semibold cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Back
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border bg-[#003b75] text-white cursor-pointer"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
        <div
          className="h-1 bg-[#003b75]"
          style={{ width: `${progress}%`, transition: "width .15s linear" }}
          aria-hidden="true"
        />
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative h-[42vh] md:h-[56vh] mt-4 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={cover}
              alt={singleNews.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute bottom-0 p-5 md:p-8 text-white">
              <h1 className="text-2xl md:text-4xl font-extrabold drop-shadow-sm">
                {singleNews.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-blue-100">
                <span className="inline-flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(singleNews.publishedAt), "MMM dd, yyyy")}
                </span>
                {singleNews.author && (
                  <span className="inline-flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {singleNews.author}
                  </span>
                )}
                {readingTime && (
                  <span className="inline-flex items-center">
                    <LinkIcon className="w-4 h-4 mr-1 rotate-45 opacity-70" />
                    {readingTime}
                  </span>
                )}
              </div>
              {singleNews.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {singleNews.tags.slice(0, 6).map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="inline-flex items-center text-xs bg-white/20 border border-white/30 rounded-full px-2.5 py-1"
                    >
                      <Tag className="w-3.5 h-3.5 mr-1" /> #{t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section ref={articleRef} className="max-w-4xl mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:text-[#0a2950] prose-p:text-gray-800 prose-a:text-[#003b75] prose-strong:text-[#0a2950]">
          {/* If your content already contains line breaks, preserve them: */}
          <div className="whitespace-pre-line text-[#003b75]">
            {singleNews.content}
          </div>
        </article>

        {/* Optional: Source / footer meta */}
        {singleNews.author && (
          <div className="mt-8 text-sm text-gray-500">
            Source: <span className="font-medium">{singleNews.author}</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default ArticlesDetails;
