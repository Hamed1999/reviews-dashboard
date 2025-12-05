"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FiStar,
  FiCalendar,
  FiUser,
  FiHome,
  FiCheckCircle,
} from "react-icons/fi";

type Review = {
  id: number;
  listing: string;
  rating: number | null;
  submittedAt: string;
  publicReview?: string;
  guestName?: string;
  categories: Record<string, number>;
};

export default function PublicListingPage() {
  const params = useParams() as { slug?: string };
  const slug = params.slug ? decodeURIComponent(params.slug) : "";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reviews/hostaway?listing=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: { result?: Review[] }) => {
        const propertyReviews = data.result ?? [];
        setReviews(propertyReviews);

        const approved = propertyReviews.filter((review) => {
          return localStorage.getItem(`approved_review_${review.id}`) === "1";
        });
        setApprovedReviews(approved);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [slug]);

  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
        approvedReviews.length
      : 0;

  // Get unique categories from approved reviews
  const allCategories = approvedReviews.flatMap((r) =>
    Object.keys(r.categories || {})
  );
  const uniqueCategories = [...new Set(allCategories)];

  // Calculate average for each category
  const categoryAverages: Record<string, number> = {};
  uniqueCategories.forEach((category) => {
    const categoryReviews = approvedReviews.filter(
      (r) => r.categories?.[category]
    );
    if (categoryReviews.length > 0) {
      const avg =
        categoryReviews.reduce(
          (sum, r) => sum + (r.categories[category] || 0),
          0
        ) / categoryReviews.length;
      categoryAverages[category] = Math.round(avg * 10) / 10;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{slug}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating / 2)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold">
                    {averageRating.toFixed(1)}/10
                  </span>
                </div>
                <span className="text-gray-600">
                  {approvedReviews.length} guest reviews
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Info */}
          <div className="lg:col-span-2">
            {/* Category Ratings */}
            {Object.keys(categoryAverages).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Guest Ratings by Category
                </h2>
                <div className="space-y-4">
                  {Object.entries(categoryAverages).map(
                    ([category, average]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700 capitalize">
                          {category.replace("_", " ")}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{ width: `${(average / 10) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium w-10">{average}/10</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Guest Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Guest Reviews ({approvedReviews.length})
              </h2>

              {approvedReviews.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to review this property!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {approvedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 rounded-full">
                            <FiUser className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.guestName ?? "Anonymous Guest"}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <FiCalendar className="w-3 h-3" />
                                {new Date(
                                  review.submittedAt
                                ).toLocaleDateString()}
                              </span>
                              {review.rating && (
                                <span className="flex items-center gap-1">
                                  <FiStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  {review.rating}/10
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-sm">
                          <FiCheckCircle className="w-4 h-4" />
                          <span>Verified Stay</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">
                        {review.publicReview ?? "No review text provided"}
                      </p>

                      {review.categories &&
                        Object.keys(review.categories).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(review.categories).map(
                              ([category, rating]) => (
                                <span
                                  key={category}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {category.replace("_", " ")}: {rating}/10
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Property Highlights */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiHome className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Property Highlights
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location Rating</span>
                    <span className="font-medium">
                      {categoryAverages["location"] || "N/A"}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleanliness</span>
                    <span className="font-medium">
                      {categoryAverages["cleanliness"] || "N/A"}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Communication</span>
                    <span className="font-medium">
                      {categoryAverages["communication"] || "N/A"}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value</span>
                    <span className="font-medium">
                      {categoryAverages["value"] || "N/A"}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Review Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        Excellent (9-10)
                      </span>
                      <span className="text-sm font-medium">
                        {
                          approvedReviews.filter((r) => (r.rating || 0) >= 9)
                            .length
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (approvedReviews.filter((r) => (r.rating || 0) >= 9)
                              .length /
                              approvedReviews.length) *
                              100 || 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Good (7-8)</span>
                      <span className="text-sm font-medium">
                        {
                          approvedReviews.filter(
                            (r) => (r.rating || 0) >= 7 && (r.rating || 0) < 9
                          ).length
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (approvedReviews.filter(
                              (r) => (r.rating || 0) >= 7 && (r.rating || 0) < 9
                            ).length /
                              approvedReviews.length) *
                              100 || 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        Average (5-6)
                      </span>
                      <span className="text-sm font-medium">
                        {
                          approvedReviews.filter(
                            (r) => (r.rating || 0) >= 5 && (r.rating || 0) < 7
                          ).length
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (approvedReviews.filter(
                              (r) => (r.rating || 0) >= 5 && (r.rating || 0) < 7
                            ).length /
                              approvedReviews.length) *
                              100 || 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
