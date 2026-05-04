import { Link } from "react-router";

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
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-wide text-center">
        {title}
      </h1>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mt-3 text-sm text-white/70" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-2">&gt;</span>}
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className="hover:text-accent transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/90">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
    </div>
  </section>
);

export default PageHero;
