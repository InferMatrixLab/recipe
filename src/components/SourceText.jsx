// Link the owner's explicit HTTPS references without interpreting Markdown/HTML.
export default function SourceText({ children }) {
  return children.split(/(https:\/\/[^\s]+)/g).map((part, i) =>
    part.startsWith("https://") ? (
      <a className="inline-source" key={i} href={part}>
        {part}
      </a>
    ) : (
      part
    ),
  );
}
