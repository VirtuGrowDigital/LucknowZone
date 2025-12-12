import React from "react";
import NewsCard from "./NewsCard";
import SkeletonNewsCard from "./SkeletonNewsCard";

export default function NewsList({ news = [], loading = false }) {
  if (loading) {
    return (
      <>
        {Array(6).fill(0).map((_, i) => (
          <SkeletonNewsCard key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      {news.map((item, index) => (
        <NewsCard key={index} item={item} />
      ))}
    </>
  );
}
