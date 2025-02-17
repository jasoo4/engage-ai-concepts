
interface ContentBlock {
  type: "text" | "image";
  content: string;
  caption?: string;
}

interface LessonContentProps {
  content: ContentBlock[];
}

export function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="space-y-8">
      {content.map((block, index) => (
        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
          {block.type === "text" ? (
            <div className="prose prose-slate max-w-none">
              {block.content.split('\n').map((text, i) => (
                <p key={i} className="text-lg leading-relaxed">
                  {text}
                </p>
              ))}
            </div>
          ) : (
            <figure className="relative">
              <img
                src={block.content}
                alt={block.caption || "Lesson illustration"}
                className="rounded-lg w-full object-cover max-h-[400px]"
              />
              {block.caption && (
                <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      ))}
    </div>
  );
}
