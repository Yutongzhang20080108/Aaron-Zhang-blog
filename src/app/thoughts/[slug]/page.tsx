import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import ThoughtContent from "./ThoughtContent";

export default async function ThoughtPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), "thoughts", `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <ThoughtContent
      title={data.title}
      date={data.date}
      author={data.author}
      contentHtml={contentHtml}
    />
  );
} 