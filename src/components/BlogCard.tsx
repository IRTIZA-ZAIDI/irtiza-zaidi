interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
}

const BlogCard = ({ title, excerpt, date, readTime, slug }: BlogCardProps) => {
  return (
    <article className="group h-full">
      <a href={`/blog/${slug}`} className="block h-full">
        <div className="flex flex-col h-full bg-transparent border border-foreground/10 hover:border-foreground/30 p-6 transition-all duration-300">
          <div className="flex justify-between items-baseline mb-4">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-secondary">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
              <span>/</span>
              <span>{readTime}</span>
            </div>
          </div>

          <h3 className="font-serif text-2xl text-foreground mb-4 group-hover:italic transition-all duration-300">
            {title}
          </h3>

          <p className="text-secondary font-mono text-sm leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </div>
      </a>
    </article>
  );
};


export default BlogCard;
