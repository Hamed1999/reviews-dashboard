"use client";
import React, { useMemo } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiStar,
  FiAlertCircle,
  FiThumbsUp,
  FiBarChart2,
} from "react-icons/fi";

type Review = {
  id: number;
  rating: number | null;
  submittedAt: string;
  publicReview?: string;
  categories: Record<string, number>;
};

interface TrendAnalysisProps {
  reviews: Review[];
}

export default function TrendAnalysis({ reviews }: TrendAnalysisProps) {
  const hasEnoughData = reviews.length >= 3;

  const monthlyTrends = useMemo(() => {
    if (!hasEnoughData) return [];

    const monthlyData: Record<
      string,
      { count: number; totalRating: number; reviews: Review[] }
    > = {};

    reviews.forEach((review) => {
      const date = new Date(review.submittedAt);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { count: 0, totalRating: 0, reviews: [] };
      }

      monthlyData[monthYear].count++;
      monthlyData[monthYear].totalRating += review.rating || 0;
      monthlyData[monthYear].reviews.push(review);
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        averageRating: data.totalRating / data.count,
        count: data.count,
        reviews: data.reviews,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [reviews, hasEnoughData]);

  const categoryTrends = useMemo(() => {
    const categoryData: Record<string, { total: number; count: number }> = {};

    reviews.forEach((review) => {
      Object.entries(review.categories || {}).forEach(([category, rating]) => {
        if (!categoryData[category]) {
          categoryData[category] = { total: 0, count: 0 };
        }
        categoryData[category].total += rating;
        categoryData[category].count++;
      });
    });

    return Object.entries(categoryData)
      .map(([category, data]) => ({
        category,
        average: data.total / data.count,
        count: data.count,
      }))
      .sort((a, b) => b.average - a.average);
  }, [reviews]);

  const commonIssues = useMemo(() => {
    if (!hasEnoughData) return [];

    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "should",
      "could",
      "can",
      "may",
      "might",
      "must",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "my",
      "your",
      "his",
      "her",
      "its",
      "our",
      "their",
      "this",
      "that",
      "these",
      "those",
      "am",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
    ]);

    const issueWords: Record<string, number> = {};

    const lowRatedReviews = reviews.filter((r) => (r.rating || 0) <= 7);

    lowRatedReviews.forEach((review) => {
      if (!review.publicReview) return;

      const words = review.publicReview
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(
          (word) =>
            word.length > 3 && !stopWords.has(word) && !word.match(/^\d+$/)
        );

      words.forEach((word) => {
        issueWords[word] = (issueWords[word] || 0) + 1;
      });
    });

    return Object.entries(issueWords)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({ word, count }));
  }, [reviews, hasEnoughData]);

  const overallTrend = useMemo(() => {
    if (monthlyTrends.length < 2) return 0;

    const recentMonths = monthlyTrends.slice(-3);
    const olderMonths = monthlyTrends.slice(
      0,
      Math.min(3, monthlyTrends.length - 3)
    );

    if (olderMonths.length === 0) return 0;

    const recentAvg =
      recentMonths.reduce((sum, m) => sum + m.averageRating, 0) /
      recentMonths.length;
    const olderAvg =
      olderMonths.reduce((sum, m) => sum + m.averageRating, 0) /
      olderMonths.length;

    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }, [monthlyTrends]);

  const ratingDistribution = useMemo(() => {
    const distribution = {
      excellent: 0, // 9-10
      good: 0, // 7-8
      average: 0, // 5-6
      poor: 0, // 0-4
    };

    reviews.forEach((review) => {
      const rating = review.rating || 0;
      if (rating >= 9) distribution.excellent++;
      else if (rating >= 7) distribution.good++;
      else if (rating >= 5) distribution.average++;
      else distribution.poor++;
    });

    return distribution;
  }, [reviews]);

  if (!hasEnoughData) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <FiBarChart2 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Trend Analysis
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">
            Not enough data for trend analysis
          </p>
          <p className="text-sm text-gray-500">
            Need at least 3 reviews to identify trends
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiBarChart2 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Trend Analysis
          </h3>
        </div>

        {/* Overall Trend Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            overallTrend > 5
              ? "bg-emerald-50 text-emerald-700"
              : overallTrend < -5
              ? "bg-rose-50 text-rose-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {overallTrend > 5 ? (
            <FiTrendingUp className="w-4 h-4" />
          ) : overallTrend < -5 ? (
            <FiTrendingDown className="w-4 h-4" />
          ) : (
            <FiMinus className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {overallTrend > 0 ? "+" : ""}
            {overallTrend.toFixed(1)}% trend
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Monthly Trends & Rating Distribution */}
        <div className="space-y-6">
          {/* Monthly Trend Chart */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Monthly Average Ratings
            </h4>
            <div className="h-40 flex items-end gap-1">
              {monthlyTrends.slice(-6).map((monthData) => (
                <div
                  key={monthData.month}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full max-w-12 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-300 hover:opacity-90"
                    style={{
                      height: `${(monthData.averageRating / 10) * 100}%`,
                    }}
                    title={`${monthData.averageRating.toFixed(1)}/10 (${
                      monthData.count
                    } reviews)`}
                  />
                  <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                    {new Date(monthData.month + "-01").toLocaleDateString(
                      "en-US",
                      { month: "short" }
                    )}
                  </div>
                  <div className="text-xs font-medium">
                    {monthData.averageRating.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Rating Distribution
            </h4>
            <div className="space-y-3">
              {[
                {
                  label: "Excellent (9-10)",
                  count: ratingDistribution.excellent,
                  color: "bg-emerald-500",
                },
                {
                  label: "Good (7-8)",
                  count: ratingDistribution.good,
                  color: "bg-blue-500",
                },
                {
                  label: "Average (5-6)",
                  count: ratingDistribution.average,
                  color: "bg-amber-500",
                },
                {
                  label: "Poor (0-4)",
                  count: ratingDistribution.poor,
                  color: "bg-rose-500",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center">
                  <div className="w-32 text-sm text-gray-700">{item.label}</div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`h-2 ${item.color} rounded-full transition-all duration-300`}
                        style={{
                          width: `${(item.count / reviews.length) * 100}%`,
                        }}
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900 w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Category Performance & Recurring Issues */}
        <div className="space-y-6">
          {/* Category Performance */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Category Performance
            </h4>
            <div className="space-y-3">
              {categoryTrends.slice(0, 5).map((category) => (
                <div key={category.category} className="flex items-center">
                  <div className="w-32 text-sm text-gray-700 capitalize">
                    {category.category.replace(/_/g, " ")}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <div className="w-full max-w-48">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            category.average >= 8
                              ? "bg-emerald-500"
                              : category.average >= 6
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${(category.average / 10) * 100}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900 w-10 text-right">
                        {category.average.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {categoryTrends.length > 5 && (
                <div className="text-xs text-gray-500 mt-2">
                  +{categoryTrends.length - 5} more categories
                </div>
              )}
            </div>
          </div>

          {/* Recurring Issues */}
          {commonIssues.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiAlertCircle className="w-5 h-5 text-amber-500" />
                <h4 className="font-medium text-gray-900">Recurring Issues</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {commonIssues.map((issue) => (
                  <div
                    key={issue.word}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium flex items-center gap-1"
                    title={`Mentioned ${issue.count} times in low-rated reviews`}
                  >
                    <span className="capitalize">{issue.word}</span>
                    <span className="text-xs bg-rose-100 px-1.5 py-0.5 rounded">
                      {issue.count}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Based on analysis of reviews rated 7 or below
              </p>
            </div>
          )}

          {/* Key Insights */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiThumbsUp className="w-5 h-5 text-emerald-500" />
              <h4 className="font-medium text-gray-900">Key Insights</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              {categoryTrends.length > 0 && (
                <li className="flex items-start gap-2">
                  <FiStar className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-medium capitalize">
                      {categoryTrends[0]?.category.replace(/_/g, " ")}
                    </span>{" "}
                    is your strongest category (
                    {categoryTrends[0]?.average.toFixed(1)}/10)
                  </span>
                </li>
              )}

              {categoryTrends.length > 1 && (
                <li className="flex items-start gap-2">
                  <FiAlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span>
                    Focus on improving{" "}
                    <span className="font-medium capitalize">
                      {categoryTrends[
                        categoryTrends.length - 1
                      ]?.category.replace(/_/g, " ")}
                    </span>{" "}
                    (
                    {categoryTrends[categoryTrends.length - 1]?.average.toFixed(
                      1
                    )}
                    /10)
                  </span>
                </li>
              )}

              {overallTrend > 5 && (
                <li className="flex items-start gap-2">
                  <FiTrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Ratings are improving! Up {overallTrend.toFixed(1)}%
                    compared to earlier period
                  </span>
                </li>
              )}

              {monthlyTrends.length >= 2 && (
                <li className="flex items-start gap-2">
                  <FiBarChart2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>
                    {monthlyTrends[monthlyTrends.length - 1]?.count} reviews
                    this month
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {reviews.length}
            </div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {ratingDistribution.excellent + ratingDistribution.good}
            </div>
            <div className="text-sm text-gray-600">Positive Reviews (7+)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {categoryTrends.length}
            </div>
            <div className="text-sm text-gray-600">Categories Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {commonIssues.length}
            </div>
            <div className="text-sm text-gray-600">Recurring Issues</div>
          </div>
        </div>
      </div>
    </div>
  );
}
