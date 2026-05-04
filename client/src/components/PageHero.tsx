import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeroProps {
  title: string;
  backgroundImage?: string;
  breadcrumbs?: Breadcrumb[];
}

const PageHero = ({ title, backgroundImage, breadcrumbs }: PageHeroProps) => (
  <section
    className="relative h-[40vh] min-h-[280px] bg-cover bg-center bg-fixed"
    style={
      backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : undefined
    }
  >
    {/* Fallback solid background when no image */}
    {!backgroundImage && <div className="absolute inset-0 bg-primary-dark" />}

    {/* Dark gradient overlay for text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-black/40 to-transparent" />

    {/* Content */}
    <div className="relative z-10 h-full flex flex-col items-center justify-end pb-10 text-white px-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center justify-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight size={14} className="text-white/40" />
                )}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-accent font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-wide text-center">
        {title}
      </h1>
    </div>
  </section>
);

export default PageHero;
