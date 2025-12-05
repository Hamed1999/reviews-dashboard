"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiUser,
  FiChevronRight,
  FiBarChart2,
  FiHome,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";
import { useApprovalState } from "@/lib/useApprovalState";

type Review = {
  id: number;
  listing: string;
  rating: number | null;
  submittedAt: string;
  publicReview?: string;
  status: string;
  guestName?: string;
};

export default function DashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState<number | "">("");
  const [sort, setSort] = useState<"newest" | "highest">("newest");
  const [loading, setLoading] = useState(true);
  const { isApproved } = useApprovalState();

  useEffect(() => {
    fetch("/api/reviews/hostaway")
      .then((r) => r.json())
      .then((data) => setReviews(data.result ?? []))
      .catch((e) => {
        console.error(e);
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate approved reviews using our custom hook
  const approvedReviews = useMemo(
    () => reviews.filter((r) => isApproved(r.id)),
    [reviews, isApproved]
  );

  // Filter reviews based on search, rating, and sort
  const filtered = useMemo(() => {
    let out = reviews.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (r) =>
          (r.publicReview ?? "").toLowerCase().includes(q) ||
          (r.guestName ?? "").toLowerCase().includes(q)
      );
    }
    if (minRating !== "") {
      out = out.filter((r) => (r.rating ?? 0) >= Number(minRating));
    }
    if (sort === "newest") {
      out.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    } else {
      out.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return out;
  }, [reviews, query, minRating, sort]);

  // Group filtered reviews by listing
  const byListing = useMemo(() => {
    return filtered.reduce<Record<string, Review[]>>((acc, r) => {
      acc[r.listing] = acc[r.listing] || [];
      acc[r.listing].push(r);
      return acc;
    }, {});
  }, [filtered]);

  // Calculate approved count for each listing
  const approvedCountByListing = useMemo(() => {
    const counts: Record<string, number> = {};
    reviews.forEach((review) => {
      if (isApproved(review.id)) {
        counts[review.listing] = (counts[review.listing] || 0) + 1;
      }
    });
    return counts;
  }, [reviews, isApproved]);

  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  // Calculate total approved reviews count
  const totalApprovedReviews = approvedReviews.length;
  const totalPendingReviews = totalReviews - totalApprovedReviews;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Reviews Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and monitor all your property reviews in one place
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <FiBarChart2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total Reviews</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalReviews}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <FiStar className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-sm text-gray-600">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Reviews
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Search by review content or guest name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all duration-200"
                  value={minRating}
                  onChange={(e) =>
                    setMinRating(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                >
                  <option value="">All Ratings</option>
                  {[10, 9, 8, 7, 6, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}+ Stars
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all duration-200"
                value={sort}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "newest" || v === "highest") {
                    setSort(v);
                  }
                }}
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rated</option>
              </select>
            </div>

            <div className="lg:col-span-1">
              <button
                onClick={() => {
                  setQuery("");
                  setMinRating("");
                  setSort("newest");
                }}
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards - Updated to use approval state */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Approved Reviews
                </p>
                <p className="text-2xl font-bold text-blue-900 mt-2">
                  {totalApprovedReviews}
                </p>
              </div>
              <FiCheckCircle className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-amber-900 mt-2">
                  {totalPendingReviews}
                </p>
              </div>
              <FiClock className="w-10 h-10 text-amber-600" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">
                  Properties
                </p>
                <p className="text-2xl font-bold text-emerald-900 mt-2">
                  {Object.keys(byListing).length}
                </p>
              </div>
              <FiHome className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
          <span className="text-sm text-gray-600">
            Showing {Object.keys(byListing).length} properties
          </span>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(byListing).map(([listing, items]) => {
              const avg =
                items.reduce((a, b) => a + (b.rating ?? 0), 0) / items.length;
              
              // Calculate approved reviews for this specific listing
              const approvedCount = items.filter(item => isApproved(item.id)).length;

              return (
                <div
                  key={listing}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiHome className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-gray-900 text-lg">
                          {listing}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiMessageSquare className="w-4 h-4" />
                          {items.length} reviews • {approvedCount} approved
                        </span>
                        <span className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {Number.isNaN(avg)
                            ? "N/A"
                            : Math.round(avg * 10) / 10}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {items.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">
                              {r.guestName ?? "Anonymous Guest"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {r.rating && (
                              <div className="flex items-center">
                                <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium text-gray-900 ml-1">
                                  {r.rating}
                                </span>
                              </div>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(r.submittedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {r.publicReview || "No review text provided"}
                        </p>
                        {/* Show approval status from localStorage */}
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            isApproved(r.id)
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isApproved(r.id) ? (
                            <FiCheckCircle className="w-3 h-3" />
                          ) : (
                            <FiClock className="w-3 h-3" />
                          )}
                          {isApproved(r.id) ? "Approved" : "Pending"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/property/${encodeURIComponent(listing)}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 group-hover:shadow-lg"
                  >
                    Manage Reviews
                    <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {!loading && Object.keys(byListing).length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {query || minRating
                ? "Try adjusting your filters"
                : "No reviews available yet"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}